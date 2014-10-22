var _= require('lodash'),
    Q = require('q'),
    fs = require('fs-extra'),
    path = require('path'),
    date = require('dateformat'),
    chalk = require('chalk');

module.exports = {
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
    }
};