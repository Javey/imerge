var Q = require('q'),
    _ = require('lodash'),
    css = require('css'),
    fs = require('fs-extra'),
    path = require('path');

function matchSize(value) {
    return value.match(/^([\d\.\-]+)(px)?/);
}

var IReplace = module.exports = function(files, data, root) {
    this.files = files;
    this.root = root || process.cwd();
    this.data = data;
};

IReplace.prototype = {
    constructor: IReplace,

    process: function() {
        var promises = [];
        _.each(this.files, _.bind(function(file) {
            promises.push(
                Q.denodeify(fs.readFile)(this.root + '/' + file, 'UTF-8')
                    .then(_.bind(function(content) {
                        var obj = this.parse(content);
                        fs.writeFile(this.root + '/imerge/' + path.basename(file), css.stringify(obj));
                    }, this))
            );
        }, this));
        return Q.all(promises).catch(function() {
            console.log(arguments);
        });
    },

    parse: function(content) {
        var obj = css.parse(content);
        _.each(obj.stylesheet.rules, _.bind(function(rule) {
            if (rule.type === 'rule') {
                var bgDecls = [],
                    merge = '',
                    mergeIndex = -1;
                _.each(rule.declarations, _.bind(function(decl, index) {
                    if (decl.property && ~decl.property.indexOf('background')) {
                        bgDecls.push(decl);
                    } else if (decl.property === 'merge') {
                        merge = decl.value;
                        mergeIndex = index;
                    }
                }, this));
                if (merge) {
                    rule.declarations.splice(mergeIndex, 1);
                    this.rewriteBackground(rule, bgDecls, merge);
                }
            }
        }, this));
        return obj;
    },

    rewriteBackground: function(rule, bgDecls, merge) {
        var data, url;
        _.each(bgDecls, _.bind(function(bgDecl) {
            if (bgDecl.property === 'background' || bgDecl.proptery === 'background-image') {
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
                position = {
                    left: fit.x,
                    top: fit.y
                };
            this.rewriteBackgroundSize(bgDecls, data, this.data[merge].attr, position);
            this.rewriteBackgroundPosition(rule, bgDecls, position);
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
        ret.url = this.data[merge].attr.file;
        ret.data = this.data[merge]['data'][url];
        return ret;
    },

    rewriteBackgroundSize: function(bgDecls, data, attr, position) {
        var ratio = {width: 1, height: 1};
        _.each(bgDecls, function(bgDecl) {
            if (~bgDecl.property.indexOf('background-size')) {
                var bgSize = bgDecl.value.split(/\s+/),
                    order = width,
                    setTimes = 0;
                _.each(bgSize, function(size, index) {
                    var matches;
                    if (matches = matchSize(size)) {
                        size = matches[1];
                        ratio[order] = size / data['ori_' + order];
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

    rewriteBackgroundPosition: function(rule, bgDecls, position) {
        var posDecl;
        _.find(bgDecls, function(bgDecl) {
            if (bgDecl.property === 'background-position') {
                posDecl = bgDecl;
                return true;
            } else if (bgDecl.property === 'background') {
                posDecl = bgDecl;
            }
            return false;
        });

        if (posDecl) {
            var posValues = posDecl.value.split(/\s+/);
            if (this.setPosition(posValues, position)) {
                posDecl.value = posValues.join(' ');
            } else {
                this.addPositionDecl(rule.declarations, position);
            }
        } else {
            this.addPositionDecl(rule.declarations, position);
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

    addPositionDecl: function(decls, position) {
        var decl = {
            'type': 'declaration',
            'property': 'background-position',
            'value': (-position.left) + 'px ' + (-position.top) + 'px'
        };
        decls.push(decl);
    }
};