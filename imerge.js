var IImage = require('./core/iImage.js'),
    ILayout = require('./core/iLayout.js'),
    IGenerator = require('./core/iGenerator.js'),
    IReplace = require('./core/iReplace.js'),
    glob = require('glob'),
    Q = require('q'),
    _ = require('lodash'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    fs = require('fs-extra');

var root = '/home/music/Workspace/lebo-pcweb/music_1-0-200-10_BRANCH/src',
    cssFiles = [];
Q.denodeify(glob)('/static/**/*.css', {root: root})
    .then(function(files) {
        cssFiles = files;
        var gen = new IGenerator(files, root);
        return gen.generate();
    })
    .then(function(config) {
        console.log();
        //fs.writeJSONFile(root + '/imerge/sprite.json', config);
        var allPromises = [],
            data = {};
        _.each(config, function(value, merge) {
            var promises = [],
                imageList = [];
            _.each(value, function(conf, path) {
                var image = new IImage(path, conf, root);
                imageList.push(image);
                promises.push(image.init());
            });

            allPromises.push(
                Q.all(promises).then(function() {
                    return drawSprite(imageList).then(function(ret) {
                        var file = '/imerge/sprite_' + merge + '.png',
                            canvasRoot = ret.layout.root;
                        fs.writeFile(root + file, ret.canvas.toBuffer());
                        var conf = {
                            data: {},
                            attr: {
                                file: file,
                                width: canvasRoot.width,
                                height: canvasRoot.height
                            }
                        };
                        _.each(imageList, function(image) {
                            var imageFile = image.file;
                            delete image.file;
                            conf.data[imageFile] = image;
                        });
                        data[merge] = conf;
                        fs.writeJSONFile(root + '/imerge/sprite_' + merge + '.json', conf);
                    })
                }).catch(function() {
                    console.log(arguments);
                })
            );
        });
        Q.all(allPromises).then(function() {
            fs.writeJSONFile(root + '/imerge/sprite.json', data);
            iReplace = new IReplace(cssFiles, data, root);
            console.log(iReplace);
            iReplace.process();
        }).catch(function() {
            console.log(arguments);
        })
    })
    .catch(function() {
        console.log(arguments);
    });

function drawSprite(images) {
    var layout = new ILayout(images);
    var canvas = new Canvas(layout.root.width, layout.root.height),
        ctx = canvas.getContext('2d'),
        promises = [];
    _.each(images, function(image) {
        promises.push(Q.denodeify(fs.readFile)(root + image.file)
            .then(function(source) {
                var img = new Image(),
                    fit = image.fit,
                    config = image.config;
                    img.src = source;
                if (config.repeat !== 'none') {
                    // Node canvas's createPattern method has bug
                    drawRepeat(ctx, img, fit.x + config['padding-left'], fit.y + config['padding-top'], layout.root.width, layout.root.height, config.repeat, image.oriWidth, image.oriHeight);
                } else {
                    ctx.drawImage(img, fit.x + config['padding-left'], fit.y + config['padding-top'], image.oriWidth, image.oriHeight);
                }
            })
        );
    });
    return Q.all(promises).then(function() {
        return {
            canvas: canvas,
            layout: layout
        };
    });
}

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