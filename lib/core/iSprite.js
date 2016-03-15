var Q = require('q'),
    _ = require('lodash'),
    Image = require('images'),
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
            canvas = this.canvas = Image(width, height);

        return Q.all(_.map(images, function(image) {
            return Q.denodeify(fs.readFile)(image.file)
                .then(function(source) {
                    var img = Image(source),
                        fit = image.fit,
                        config = image.config;
                    if (fit) {
                        if (config.repeat !== 'none') {
                            drawRepeat(canvas, img, fit.x + config['padding-left'], fit.y + config['padding-top'], width, height, config.repeat, image.oriWidth, image.oriHeight);
                        } else {
                            canvas.draw(img, fit.x + config['padding-left'], fit.y + config['padding-top']);
                        }
                    }
                })
        }));
    },

    writeSprite: function(file) {
        this.toFile = file;
        var self = this;
        if (!this.canvas) {
            return this.drawSprite().then(function() {
                return utils.writeFile(file, self.canvas.encode('png'));
            });
        }
        return utils.writeFile(file, this.canvas.encode('png'));
    }
};

function drawRepeat(canvas, img, x, y, width, height, repeat, oriWidth, oriHeight) {
    var i = 0, l;
    if (repeat === 'x') {
        for (l = Math.ceil(width / oriWidth); i < l; i++) {
            canvas.draw(img, x, y);
            x += oriWidth;
        }
    } else if (repeat === 'y') {
        for (l = Math.ceil(height / oriHeight); i < l; i++) {
            canvas.draw(img, x, y);
            y += oriHeight;
        }
    }
}
