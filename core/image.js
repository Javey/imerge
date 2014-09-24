var Q = require('q'),
    fs = require('fs-extra'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    utils = require('./utils.js'),
    _ = require('underscore');

var ImImage = module.exports = function(file, config) {
    this.file = file;
    this.config = config || utils.defaults;
};

ImImage.prototype = {
    constructor: ImImage,

    init: function() {
        var self = this;
        return Q.denodeify(fs.exists)(this.file)
            .then(function(exists) {
                if (!exists) {
                    throw '文件' + self.file + '不存在';
                }
            }, function() {})
            .then(function() {
                return Q.denodeify(fs.readFile)(self.file)
            })
            .then(function(image) {
                var img = new Image();
                img.src = image;
                self.oriWidth = img.width;
                self.oriHeight = img.height;
                self._resize();
            })
            .catch(function() {
                console.log(arguments);
            })
    },

    _resize: function() {
        var config = this.config,
            width = this.oriWidth + config['padding-left'] + config['padding-right'],
            height = this.oriHeight + config['padding-top'] + config['padding-bottom'];

        this.width = width;
        this.height = height;
    }
};
