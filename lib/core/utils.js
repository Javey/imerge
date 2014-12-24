var _= require('lodash'),
    Q = require('q'),
    fs = require('fs-extra'),
    path = require('path'),
    date = require('dateformat'),
    chalk = require('chalk');

var utils = module.exports = {
    writeFile: function(file, content) {
        var dirname = path.dirname(file);
        return Q.denodeify(fs.exists)(dirname)
            .then(function(exists) {
                if (!exists) {
                    return Q.denodeify(fs.mkdirp)(dirname);
                }
                return null;
            }, function() {
            })
            .then(function() {
                return Q.denodeify(fs.writeFile)(file, content);
            });
    },

    log: function() {
        var time = '[' + chalk.grey(date(new Date(), 'HH:MM:ss')) + ']',
            args = Array.prototype.slice.call(arguments);
        args.unshift(time);
        console.log.apply(console, args);
    },

    /**
     * Support deep extend
     * Referece to jQuery.extend
     * @returns {*|{}}
     */
    extend: function() {
        var target = arguments[0] || {},
            length = arguments.length,
            i = 1,
            deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        var options;
        for (; i< length; i++) {
            if ((options = arguments[i]) != null) {
                for (var name in options) {
                    var src = target[name],
                        copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    var copyIsArray;
                    if (deep && copy && (_.isObject(copy) || (copyIsArray = _.isArray(copy)))) {
                        var clone;
                        if (copyIsArray) {
                            clone = src && _.isArray(src) ? src : [];
                        } else {
                            clone = src && _.isObject(src) ? src : [];
                        }
                        target[name] = utils.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    },

    defaults: {
        config: {
            'padding-top': 0,
            'padding-right': 0,
            'padding-bottom': 0,
            'padding-left': 0,
            'float': 'none',
            'repeat': 'none'
        },
        merge: 'sprite',
        ie6Suffix: '_ie6'
    },

    css_bg_walk: function (options) {
        var result = [],
            opt = options.options,
            noop = function () {},
            css_ast = options.css_ast,
            declare_handler = options.declare_handler || noop;
            rule_done_handler = options.rule_done_handler || noop;

        _.each(css_ast.stylesheet.rules, function(rule) {
            if (rule.type !== 'rule') return;

            var bgDecls = [],
                merge = '',
                setImage = {},
                rule_result = [];

            _.each(rule.declarations, function(decl, index) {
                if (decl.property && ~decl.property.indexOf('background')) {
                    bgDecls.push(decl);
                    if (decl.property === 'background' || decl.property === 'background-image') {
                        setImage.common = true;
                    } else if (decl.property === '_background' || decl.property === '_background-image') {
                        setImage.ie6 = true;
                    }
                } else if (decl.property === 'merge' || decl.property === 'imerge') {
                    // 在stylus中merge为一个函数，存在冲突
                    merge = decl.value;
                }

                declare_handler.call(null, decl, index, rule.declarations);
            });

            if (opt.all)    merge = utils.defaults.merge;
            if (_.isEmpty(setImage) || !merge.length)  return;

            _.each(setImage, function (val, key) {
                is_ie6 = key === "ie6" && val === true;
                rule_result.push({
                    bgDecls: bgDecls,
                    merge: merge + (is_ie6 ? utils.defaults.ie6Suffix : ''),
                    isHack: is_ie6
                });
            });

            result = result.concat(rule_result);
            rule_done_handler.call(null, rule, rule_result, merge, is_ie6);
        });

        return result;
    }
};
