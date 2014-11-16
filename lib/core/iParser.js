/**
 * 解析css，生成配置信息
 * @type {exports}
 */

var Q = require('q'),
    _ = require('lodash'),
    css = require('css'),
    utils = require('./utils.js'),
    path = require('path'),
    fs = require('fs-extra');

var paddings = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    COMMON = 1,
    IE6 = 2;

var IParser = module.exports = function(files, options) {
    this.files = files;
    this.defaults = utils.defaults.config;
    //this.setDefaults(defaults);
    //this.options = _.extend({all: false}, options);
    this.options = utils.extend(true, {
        defaults: {
            padding: null
        },
        options: {
            all: false
        }
    }, options);
    this.setDefaults(this.options.defaults);

    this.config = {};
    this._position = true;
};
IParser.prototype = {
    constructor: IParser,

    setDefaults: function(defaults) {
        var def = this.defaults;
        _.each(defaults, function(value, key) {
            if (value) {
                if (key === 'padding') {
                    var values = value.toString().split(' ');
                    for (var i = 0; i < 4; i++) {
                        if (_.isUndefined(values[i])) {
                            values[i] = values[i - 1];
                        }
                        def[paddings[i]] = parseInt(values[i]);
                    }
                } else {
                    if (~key.indexOf('padding')) {
                        value = parseInt(value);
                    }
                    def[key] = value;
                }
            }
        });
    },

    _readFile: function (file) {
        return Q.denodeify(fs.readFile)(file, 'UTF-8');
    },

    parse: function() {
        var self = this,
            promises = [];
        this.files.forEach(function(file) {
            promises.push(self._readFile(file)
                .then(function(content) {
                    // 传入css文件路径，写入config中，用于计算相对地址图片的绝对地址
                    return self._parse(content, file);
                })
            );
        });
        
        return Q.all(promises).then(function() {
            return self.config;
        });
    },

    _parse: function(content, file) {
        var self = this,
            bind = function (f) {
                return _.bind(self[f], self); 
            };

        return Q.fcall(function () {
                return content;
            })
            .then(bind("_parse_css"))
            .then(bind("_filter_bg"))
            .then(_.bind(_.curry(self._do_config)(file), self))
            .catch(function (error) {
                 console.log(error);
            });
    },
    
    _parse_css: function (content) {
        return css.parse(content);
    },

    _filter_bg: function (css_ast) {
        var result = [],
            opt = this.options;

        _.each(css_ast.stylesheet.rules, function(rule) {
            if (rule.type !== 'rule') return;

            var bgDecls = [],
                merge = '',
                setImage = {};

            rule.declarations.forEach(function(decl) {
                if (decl.property && ~decl.property.indexOf('background')) {
                    bgDecls.push(decl);
                    if (decl.property === 'background' || decl.property === 'background-image') {
                        setImage.common = true;
                    } else if (decl.property === '_background' || decl.property === '_background-image') {
                        setImage.ie6 = true;
                    }
                } else if (decl.property === 'merge') {
                    merge = decl.value;
                }
            });

            if (opt.options.all)    merge = utils.defaults.merge;
            if (_.isEmpty(setImage) || !merge.length)  return;

            _.each(setImage, function (val, key) {
                is_ie6 = key === "ie6" && val === true;
                result.push({
                    bgDecls: bgDecls,
                    merge: merge + (is_ie6 ? utils.defaults.ie6Suffix : ''),
                    isHack: is_ie6
                });
            });
        });

        return result;
    },

    _do_config: function (css_file, bg_list) {
        var self = this;

        _.each(bg_list, function (bg_obj, i) {
            config = self._getConfigByRule(bg_obj.merge, bg_obj.bgDecls, bg_obj.isHack);
            if (config.url) {
                var url = config.url;
                delete config.url;
                self._setConfig(bg_obj.merge, url, self._getAbsPathByUrl(url, css_file), _.extend({}, self.defaults, config));
            }
        });
    },
    
    _getConfigByRule: function(merge, bgDecls, isHack) {
        var config = {},
            self = this;
        bgDecls.forEach(function(decl) {
            // 去掉hack写法前缀
            var property = decl.property;
            if (isHack) {
                property = property.replace(/^_/, '');
            }
            switch (property) {
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
        });
        return config;
    },

    _setConfig: function(merge, url, key, config) {
        if (config.repeat === 'xy') {
            console.log('舍弃x和y方向同时repeat的图片:' + url);
            return;
        }
        if (!this.config[merge]) {
            this.config[merge] = {};
        }
        if (!this.config[merge][key]) {
            this.config[merge][key] = config;
        } else {
            var oldConfig = this.config[merge][key];
            paddings.forEach(function(padding) {
                oldConfig[padding] = Math.max(oldConfig[padding], config[padding]);
            });

            var oF = oldConfig.float,
                nF = config.float;

            // FIXME: 貌似不可能有 none 的情况
            if (oF === 'none') {
                if (nF !== 'none') {
                    oldConfig.float = nF;
                }
            } else {
                if (nF !== 'none' && oF !== nF) {
                    // 冲突
                }
            }

            // FIXME: 貌似不可能有 none 的情况
            var oR = oldConfig.repeat,
                nR = config.repeat;
            if (oR === 'none') {
                if (nR !== 'none') {
                    oldConfig.repeat = nR;
                }
            } else {
                if (nR !== 'none' && oR !== nR) {
                    throw '图片：' + url + '，被多次引用，但存在冲突，请检查background-repeat.';
                }
            }
        }
        if (!this.config[merge][key].urls) {
            this.config[merge][key].urls = {};
        }
        this.config[merge][key].urls[url] = true;
    },

    _getAbsPathByUrl: function(url, file) {
        if (_.isString(url)) {
            if (url.charAt(0) === '/') {
                // 如果是绝对地址
                return path.join(this.options.webroot, url);
            } else {
                // 相对地址
                return path.resolve(path.dirname(file), url);
            }
        }
        throw new Error('url必须为字符串');
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
        // FIXME: 如果先后有两次 background-repeat, repeat无法清除之前的ret.float
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
