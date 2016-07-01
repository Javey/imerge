var Q = require('q'),
    fs = require('fs-extra'),
    Image = require('jimp'),
    _ = require('lodash');

var IImage = module.exports = function(file, config) {
    this.file = file;
    this.config = config;
};

IImage.prototype = {
    constructor: IImage,

    init: function() {
        var self = this,
            file = this.file;
        return Q.denodeify(fs.exists)(file)
            .then(function(exists) {
                if (!exists) {
                    throw '文件' + file + '不存在';
                }
            }, function() {})
            .then(function() {
                return Q.denodeify(fs.readFile)(file);
            })
            .then(function(image) {
                return Image.read(image).then(function(img) {
                    self.oriWidth = img.bitmap.width;
                    self.oriHeight = img.bitmap.height;
                    self._resize();
                });
            });
    },

    _resize: function() {
        var config = this.config,
            width = this.oriWidth + config['padding-left'] + config['padding-right'],
            height = this.oriHeight + config['padding-top'] + config['padding-bottom'];

        var float = config.float;

        this.width = width;
        this.height = height;
        this.float = float;
    }
};
