var Q = require('q'),
    _ = require('lodash'),
    css = require('css'),
    fs = require('fs-extra'),
    utils = require('./utils.js');


function matchSize(value) {
    return value.match(/^([\d\.\-]+)(px)?/);
}

var IReplace = module.exports = function(file, data, options) {
    this.file = file;
    this.data = data;
    this.options = _.extend({all: false}, options);
    this.content = '';
};

IReplace.prototype = {
    constructor: IReplace,

    replace: function() {
        return Q.denodeify(fs.readFile)(this.file, 'UTF-8')
            .then(_.bind(function(content) {
                var obj = this.parse(content);
                this.content = css.stringify(obj);
                return this.content;
            }, this));
    },

    writeFile: function(file) {
        this.toFile = file;
        if (!this.content) {
            return this.replace().then(function(content) {
                return utils.writeFile(file, content);
            });
        }
        return utils.writeFile(file, this.content);
    },

    parse: function(content) {
        var obj = css.parse(content),
            opt = this.options;
        _.each(obj.stylesheet.rules, _.bind(function(rule) {
            if (rule.type === 'rule') {
                var bgDecls = [],
                    hackBgDecls = [],
                    merge = '',
                    mergeIndex = -1,
                    setImage = {};
                _.each(rule.declarations, _.bind(function(decl, index) {
                    var property = decl.property;
                    if (property && ~property.indexOf('background')) {
                        if (property === 'background' || property === 'background-image') {
                            setImage.common = true;
                        } else if (property === '_background' || property === '_background-image') {
                            setImage.ie6 = true;
                        }
                        if (property.substr(0, 1) === '_') {
                            // is ie6 hack
                            hackBgDecls.push(decl);
                        } else {
                            bgDecls.push(decl);
                        }
                    } else if (decl.property === 'merge') {
                        merge = decl.value;
                        mergeIndex = index;
                    }
                }, this));
                if (opt.all && setImage) {
                    merge = utils.defaults.merge;
                }
                if (merge) {
                    if (~mergeIndex) {
                        rule.declarations.splice(mergeIndex, 1);
                    }
                    _.each(setImage, _.bind(function(value, key) {
                        if (key === 'ie6') {
                            this.rewriteBackground(rule, hackBgDecls, merge + utils.defaults.ie6Suffix, true);
                        } else {
                            this.rewriteBackground(rule, bgDecls, merge);
                        }
                    }, this));
                }
            }
        }, this));
        return obj;
    },

    rewriteBackground: function(rule, bgDecls, merge, isHack) {
        var data, url;
        _.each(bgDecls, _.bind(function(bgDecl) {
            var property = bgDecl.property;
            if (isHack) {
                property = property.replace(/^_/, '');
            }
            if (property === 'background' || property === 'background-image') {
                var matches = bgDecl.value.match(/(.*url\()([\'\"]?)([^\'\"\)]+)([\'\"]?)(\).*)/);
                if (matches) {
                    url = matches[3];
                    data = this.getDataByUrl(url, merge);
                    bgDecl.value = matches[1] + '"' + data['url'] + '"' + matches[5];
                }
            }
        }, this));

        if (data && data.data) {
            data = data.data;
            var fit = data.fit,
                conf = data.config,
                position = {
                    left: fit.x + conf['padding-left'],
                    top: fit.y + conf['padding-top']
                };
            this.rewriteBackgroundSize(bgDecls, data, this.data[merge], position);
            this.rewriteBackgroundPosition(rule, bgDecls, position, isHack);
        }
    },

    getDataByUrl: function(url, merge) {
        var ret = {
            url: url,
            data: {}
        };
        if (!url || ~url.indexOf('data:') || ~url.indexOf('about:') || ~url.indexOf('://')) {
            return ret;
        }
        ret.url = this.data[merge].spriteFile;
        ret.data = this.data[merge]['data'][url];
        return ret;
    },

    rewriteBackgroundSize: function(bgDecls, data, attr, position) {
        var ratio = {width: 1, height: 1};
        _.each(bgDecls, function(bgDecl) {
            if (~bgDecl.property.indexOf('background-size')) {
                var bgSize = bgDecl.value.split(/\s+/),
                    order = 'width',
                    setTimes = 0;
                _.each(bgSize, function(size, index) {
                    var matches;
                    if (matches = matchSize(size)) {
                        size = matches[1];
                        ratio[order] = size / data['ori' + order.substring(0, 1).toLocaleUpperCase() + order.substring(1)];
                        size = Math.floor(ratio[order] * attr[order]);
                        bgSize[index] = size + 'px';
                        setTimes++;
                    }
                    order = 'height';
                });
                bgDecl.value = bgSize.join(' ');

                if (setTimes < 2) {
                    if (ratio.width !== 1) {
                        ratio.height = ratio.width;
                    } else if (ratio.height !== 1) {
                        ratio.width = ratio.height;
                    }
                }
            }
        });

        position.left = Math.round(position.left * ratio.width);
        position.top = Math.round(position.top * ratio.height);
    },

    rewriteBackgroundPosition: function(rule, bgDecls, position, isHack) {
        var posDecl;
        _.find(bgDecls, function(bgDecl) {
            var property = bgDecl.property;
            if (isHack) {
                property = property.replace(/^_/, '');
            }
            if (property === 'background-position') {
                posDecl = bgDecl;
                return true;
            } else if (property === 'background') {
                posDecl = bgDecl;
            }
            return false;
        });

        if (posDecl) {
            var posValues = posDecl.value.split(/\s+/);
            if (this.setPosition(posValues, position)) {
                posDecl.value = posValues.join(' ');
            } else {
                this.addPositionDecl(rule.declarations, position, isHack);
            }
        } else {
            this.addPositionDecl(rule.declarations, position, isHack);
        }
    },

    setPosition: function(values, position) {
        var order = 'left',
            setTimes = 0;
        _.find(values, function(value, index) {
            var matches;
            if (matches = matchSize(value)) {
                values[index] = (matches[1] - position[order]) + 'px';
                order = 'top';
                setTimes++;
            } else if (_.isString(value) && ~['left', 'center', 'right', 'top', 'bottom'].indexOf(value)) {
                order = 'top';
                setTimes++;
            }
            return setTimes === 2;
        });

        return setTimes > 0;
    },

    addPositionDecl: function(decls, position, isHack) {
        var decl = {
            'type': 'declaration',
            'property': (isHack ? '_' : '') + 'background-position',
            'value': (-position.left) + 'px ' + (-position.top) + 'px'
        };
        decls.push(decl);
    }
};