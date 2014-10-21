var Q = require('q'),
    _ = require('lodash'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
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
            canvas = this.canvas = new Canvas(width, height),
            ctx = canvas.getContext('2d'),
            promises = [];
        _.each(images, function(image) {
            promises.push(
                Q.denodeify(fs.readFile)(image.file)
                    .then(function(source) {
                        var img = new Image(),
                            fit = image.fit,
                            config = image.config;
                        img.src = source;
                        if (config.repeat !== 'none') {
                            // Node canvas's createPattern method has bug
                            drawRepeat(ctx, img, fit.x + config['padding-left'], fit.y + config['padding-top'], width, height, config.repeat, image.oriWidth, image.oriHeight);
                        } else {
                            ctx.drawImage(img, fit.x + config['padding-left'], fit.y + config['padding-top'], image.oriWidth, image.oriHeight);
                        }
                    })
            );
        });
        return Q.all(promises);
    },

    writeSprite: function(file) {
        this.toFile = file;
        var self = this;
        if (!this.canvas) {
            return this.drawSprite().then(function() {
                return utils.writeFile(file, self.canvas.toBuffer());
            });
        }
        return utils.writeFile(file, this.canvas.toBuffer());
    }
};

function drawRepeat(ctx, img, x, y, width, height, repeat, oriWidth, oriHeight) {
    var i = 0, l;
    if (repeat === 'x') {
        for (l = Math.ceil(width / oriWidth); i < l; i++) {
            ctx.drawImage(img, x, y, oriWidth, oriHeight);
            x += oriWidth;
        }
    } else if (repeat === 'y') {
        for (l = Math.ceil(height / oriHeight); i < l; i++) {
            ctx.drawImage(img, x, y, oriWidth, oriHeight);
            y += oriHeight;
        }
    }
}