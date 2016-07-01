var Q = require('q'),
    _ = require('lodash'),
    Image = require('jimp'),
    fs = require('fs-extra'),
    utils = require('./utils.js');

var ISprite = module.exports = function(images, width, height) {
    this.images = images;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.toFile = null;
};

ISprite.prototype = {
    constructor: ISprite,

    drawSprite: function() {
        var images = this.images,
            width = this.width,
            height = this.height,
            canvas = this.canvas = new Image(width, height);

        return Q.all(_.map(images, function(image) {
            return Q.denodeify(fs.readFile)(image.file)
                .then(function(source) {
                    return Image.read(source).then(function(img) {
                        var fit = image.fit,
                            config = image.config;
                        if (fit) {
                            if (config.repeat !== 'none') {
                                drawRepeat(canvas, img, fit.x + config['padding-left'], fit.y + config['padding-top'], width, height, config.repeat, image.oriWidth, image.oriHeight);
                            } else {
                                canvas.composite(img, fit.x + config['padding-left'], fit.y + config['padding-top']);
                            }
                        }
                    });
                });
        }));
    },

    writeSprite: function(file) {
        this.toFile = file;
        var self = this;

        function write() {
            var def = Q.defer();
            self.canvas.write(file, function(err) {
                if (err) {
                    def.reject(new Error(err));
                } else {
                    def.resolve();
                }
            });
            return def.promise;
        }

        if (!this.canvas) {
            return this.drawSprite().then(function() {
                return utils.ensureDir(file).then(write);
            });
        }
        return utils.ensureDir(file).then(write);
    }
};

function drawRepeat(canvas, img, x, y, width, height, repeat, oriWidth, oriHeight) {
    var i = 0, l;
    if (repeat === 'x') {
        for (l = Math.ceil(width / oriWidth); i < l; i++) {
            canvas.composite(img, x, y);
            x += oriWidth;
        }
    } else if (repeat === 'y') {
        for (l = Math.ceil(height / oriHeight); i < l; i++) {
            canvas.composite(img, x, y);
            y += oriHeight;
        }
    }
}
