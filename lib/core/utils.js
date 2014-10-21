var _= require('lodash'),
    Q = require('q'),
    fs = require('fs-extra'),
    path = require('path');

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
    }
};