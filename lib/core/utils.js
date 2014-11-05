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
    }
};