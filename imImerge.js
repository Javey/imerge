var ImImage = require('./core/image.js'),
    Layout = require('./core/layout.js'),
    Q = require('q'),
    _ = require('underscore'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    fs = require('fs-extra');

Q.denodeify(fs.readJSONFile)('/home/music/Workspace/M3DImerge/test/imerge/sprite/sprite.json')
    .then(function(config) {
            root = '/home/music/Workspace/M3DImerge/test';
        _.each(config, function(value, merge) {
            if (merge === 'float') {
                var promises = [],
                    imageList = [];
                _.each(value, function(conf, path) {
                    var image = new ImImage(root + path, conf);
                    imageList.push(image);
                    promises.push(image.init());
                });
                Q.all(promises).then(function() {
                    drawSprite(imageList).then(function(canvas) {
                        fs.writeFile('/home/music/Workspace/M3DImerge/src/sprite_' + merge + '.png', canvas.toBuffer());
                    })
                });
            }
        });
    })
    .catch(function() {
        console.log(arguments);
    });

function drawSprite(images) {
    var layout = new Layout(images);
    var canvas = new Canvas(layout.root.width, layout.root.height),
        ctx = canvas.getContext('2d'),
        promises = [];
    _.each(images, function(image) {
        console.log(image);
        promises.push(Q.denodeify(fs.readFile)(image.file)
            .then(function(source) {
                var img = new Image();
                img.src = source;
                ctx.drawImage(img, image.fit.x + image.config['padding-left'], image.fit.y + image.config['padding-top'], image.oriWidth, image.oriHeight);
            })
        );
    });
    return Q.all(promises).then(function() {
        return canvas;
    });
}