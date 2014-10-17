var Q = require('q'),
    _ = require('lodash'),
    css = require('css');
    fs = require('fs-extra');

var Generator = module.exports = function(files, root) {
    this.files = files;
    this.config = {};
    this._position = true;
};
Generator.prototype = {
    constructor: Generator,
    
    defaults: {
        'padding-top': 0,
        'padding-right': 0,
        'padding-bottom': 0,
        'padding-left': 0,
        'float': 'none',
        'repeat': 'none'
    },

    generate: function() {
        var self = this,
            promises = [];
        this.files.forEach(function(file) {
            promises.push(Q.denodeify(fs.readFile)(file, 'UTF-8')
                .then(function(content) {
                    self._parse(content);
                })
            );
        });
        return Q.all(promises).then(function() {
            return self.config;
        });
    },
    
    _parse: function(content) {
        var obj = css.parse(content),
            self = this;
        obj.stylesheet.rules.forEach(function(rule) {
            if (rule.type === 'rule') {
                var bgDecls = [],
                    merge = '';
                rule.declarations.forEach(function(decl) {
                    if (decl.property && ~decl.property.indexOf('background')) {
                        bgDecls.push(decl);
                    } else if (decl.property === 'merge') {
                        merge = decl.value;
                    }
                });
                if (merge) {
                    self._setConfigByRule(merge, bgDecls);
                }
            }
        });
    },
    
    _setConfigByRule: function(merge, bgDecls) {
        var config = {},
            self = this;
        bgDecls.forEach(function(decl) {
            switch (decl.property) {
                case 'background':
                    _.extend(config, self._handleBackground(decl.value));
                    break;
                case 'background-image':
                    _.extend(config, self._handleBackgroundImage(decl.value));
                    break;
                case 'background-position':
                    var values = decl.value.split(/\s+/);
                    self._position = true;
                    values.forEach(function(value) {
                        _.extend(config, self._handleBackgroundPosition(value));
                    });
                    break;
                case 'background-repeat':
                    _.extend(config, self._handleBackgroundRepeat(decl.value));
                    break;
                default:
                    break;
            }
            if (config.url) {
                var url = config.url;
                delete config.url;
                self._setConfig(merge, url, _.extend({}, self.defaults, config));
            }
        });
    },

    _setConfig: function(merge, url, config) {
        if (config.repeat === 'xy') {
            console.log('舍弃x和y方向同时repeat的图片:' + url);
            return;
        }
        if (!this.config[merge]) {
            this.config[merge] = {};
        }
        if (!this.config[merge][url]) {
            this.config[merge][url] = config;
        } else {
            var paddings = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'],
                oldConfig = this.config[merge][url];
            paddings.forEach(function(padding) {
                oldConfig[padding] = Math.max(oldConfig[padding], config[padding]);
            });

            var oF = oldConfig.float,
                nF = config.float;
            if (oF === 'none') {
                if (nF !== 'none') {
                    oldConfig.float = nF;
                }
            } else {
                if (nF !== 'none' && oF !== nF) {
                    // 冲突
                }
            }

            var oR = oldConfig.repeat,
                nR = config.repeat;
            if (oR === 'none') {
                if (nR !== 'none') {
                    oldConfig.repeat = nR;
                }
            } else {
                if (nR !== 'none' && oR !== nR) {
                    throw '图片：' + url + '，被多次引用，但存在冲突，请检查background-repeat.'
                }
            }
        }
    },

    _handleBackground: function(value) {
        var ret = {},
            values = value.split(/\s+/),
            self = this,
            temp;
        this._position = true;
        values.forEach(function(val) {
            if ((temp = self._handleBackgroundImage(val)) && !_.isEmpty(temp)) {
                _.extend(ret, temp);
            } else if ((temp = self._handleBackgroundPosition(val)) && !_.isEmpty(temp)) {
                _.extend(ret, temp);
            } else if ((temp = self._handleBackgroundImage(val)) && !_.isEmpty(temp)) {
                _.extend(ret, temp);
            } else if ((temp = self._handleBackgroundRepeat(val)) && !_.isEmpty(temp)) {
                _.extend(ret, temp);
            }
        });
        return ret;
    },

    _handleBackgroundImage: function(value) {
        var ret = {},
            matches = value.match(/(url\()([\'\"]?)([^\'\"\)]+)([\'\"]?)(\).*)/);
        if (matches) {
            var url = matches[3];
            if (!~url.indexOf('data:') && !~url.indexOf('about:') && !~url.indexOf('://')) {
                ret.url = url;
            }
        }
        return ret;
    },

    _handleBackgroundPosition: function(value) {
        var ret = {},
            matches = value.match(/^([\d\.]+)(px)?/);
        if (matches || ~['left', 'right', 'top', 'bottom', 'center'].indexOf(value.toLowerCase())) {
            if (matches) {
                value = parseInt(matches[1]);
            }
            ret = this._getPosition(value);
        }

        return ret;
    },

    _handleBackgroundRepeat: function(value) {
        var ret = {};
        if (~value.toLowerCase().indexOf('repeat')) {
            ret = this._getRepeat(value);
        }
        return ret;
    },

    _getPosition: function(value) {
        var ret = {},
            flag = this._position,
            self = this;
        if (_.isString(value)) {
            ret.float = value.toLowerCase();
        } else {
            var paddings = [
                ['padding-left', 'padding-right'],
                ['padding-top', 'padding-bottom']
            ];
            paddings = flag ? paddings[0] : paddings[1];
            paddings.forEach(function(padding) {
                ret[padding] = Math.max(self.defaults[padding], value);
            });
        }
        this._position = !flag;
        return ret;
    },

    _getRepeat: function(value) {
        var ret = {};
        switch (value.toLowerCase()) {
            case 'repeat-x':
                ret.repeat = 'x';
                ret.float = 'left';
                break;
            case 'repeat-y':
                ret.repeat = 'y';
                ret.float = 'top';
                break;
            case 'repeat':
                ret.repeat = 'xy';
                break;
            default:
                break;
        }
        return ret;
    }
};