var Q = require('q'),
    fs = require('fs-extra'),
    md5 = require('blueimp-md5').md5,
    _ = require('lodash');

var IWriter = module.exports = function(root) {
    this.root = root;
};
IWriter.prototype = {
    constructor: IWriter,

    writeConfig: function(config) {
        var self = this;
        this.writeSpriteConfig(config);
        _.each(config, function(value, key) {
            self.writeConfigByType(value, key);
        });
    },

    writeSpriteConfig: function(config) {
        var path = this.root + '/imerge/sprite';
        Q.denodeify(fs.exists)(path)
            .then(function(exists) {
                if (!exists) {
                    return Q.denodeify(fs.mkdirp)(path);
                }
                return null;
            }, function() {})
            .then(function() {
                Q.denodeify(fs.writeJSON)(path + '/sprite.json', config);
            })
            .catch(function() {
                console.log(arguments);
            })
    },

    writeConfigByType: function(config, type) {
        var path = this.root + '/imerge/image',
            typePath = path + '/' + type;
        Q.denodeify(fs.exists)(typePath)
            .then(function(exists) {
                if (!exists) {
                    return Q.denodeify(fs.mkdirp)(typePath);
                }
                return null;
            }, function() {})
            .then(function() {
                var promises = [];
                _.each(config, function(value, url) {
                    var uid = md5(url),
                        file = typePath + '/' + uid + '.json';
                    promises.push(Q.denodeify(fs.writeJSON)(file, value));
                });
                return Q.all(promises);
            })
            .then(function() {
                console.log('Data file has saved.');
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    };