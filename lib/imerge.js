var IImage = require('./core/iImage.js'),
    ILayout = require('./core/iLayout.js'),
    IParser = require('./core/iParser.js'),
    IReplace = require('./core/iReplace.js'),
    ISprite = require('./core/iSprite.js'),
    glob = require('glob'),
    Q = require('q'),
    _ = require('lodash'),
    utils = require('./core/utils'),
    chalk = require('chalk'),
    path = require('path');

var IMerge = module.exports = function(options, pathFilter) {
    var opt = this.options = _.defaults(options || {}, {
        from: '',
        to: '',
        pattern: '/**/*.css'
    });
    opt.from = path.resolve(process.cwd(), opt.from);
    opt.to = path.resolve(process.cwd(), opt.to);
    this.pathFilter = _.defaults(pathFilter || {}, {
        spriteAbsolutePath: function(merge) {
            return opt.to + '/sprite/spirte_' + merge + '.png';
        },
        spriteRelativePath: function(file) {
            return file.replace(opt.to, '');
        },
        imageAbsolutePath: function(file) {
            return opt.from + file;
        },
        imageRelativePath: function(file) {
            return file.replace(opt.from, '');
        },
        cssAbsolutePath: function(file) {
            return file.replace(opt.from, opt.to);
        }
    });
    this.init();
};

IMerge.prototype = {
    constructor: IMerge,

    init: function() {
        // 使pathFilter中this指向本实例
        _.each(this.pathFilter, _.bind(function(fun, key) {
            this.pathFilter[key] = _.bind(fun, this);
        }, this));
    },

    start: function() {
        var self = this,
            opt = this.options;
        return Q.denodeify(glob)(opt.pattern, {root: opt.from})
            .then(function(files) {
                utils.log('We get ' + chalk.blue(files.length) + ' css file' + (files.length > 1 ? 's' : '') + ' from path: ' + chalk.magenta(opt.from));
                utils.log('Starting to process...');
                return self.parse(files)
                    .then(function(config) {
                        return self.sprite(config);
                    })
                    .then(function(data) {
                        utils.log('Writing processed files to path: ' + chalk.magenta(opt.to));
                        return self.replace(files, data);
                    });
            })
            .catch(function(err) {
                console.log(err.stack);
            });
    },

    parse: function(files) {
        return new IParser(files, this.options.defaults).parse();
    },

    layout: function(data) {
        var promises = [],
            imageList = [],
            pathFilter = this.pathFilter.imageAbsolutePath;
        _.each(data, function(conf, path) {
            path = pathFilter(path);
            var image = new IImage(path, conf);
            imageList.push(image);
            promises.push(image.init());
        });

        return Q.all(promises).then(function() {
            return new ILayout(imageList);
        });
    },

    sprite: function(config) {
        var promises = [],
            ret = {},
            self = this,
            pathFilter = this.pathFilter.spriteAbsolutePath;
        _.each(config, function(value, merge) {
            promises.push(
                self.layout(value).then(function(layout) {
                    var sprite = new ISprite(layout.blocks, layout.root.width, layout.root.height),
                        file = pathFilter(merge);
                    return sprite.writeSprite(file).then(function() {
                        ret[merge] = sprite;
                    });
                })
            );
        });
        return Q.all(promises).then(function() {
            return ret;
        });
    },

    kvData: function(data) {
        var imagePathFilter = this.pathFilter.imageRelativePath,
            spritePathFilter = this.pathFilter.spriteRelativePath;
        _.each(data, function(sprite) {
            sprite.data = {};
            sprite.spriteFile = spritePathFilter(sprite.toFile);
            _.each(sprite.images, function(image) {
                var imageFile = imagePathFilter(image.file);
                sprite.data[imageFile] = image;
            });
        });
    },

    replace: function(files, data) {
        var pathFilter = this.pathFilter.cssAbsolutePath,
            promises = [];
        this.kvData(data);
        _.each(files, function(file) {
            var iReplace = new IReplace(file, data);
            promises.push(iReplace.writeFile(pathFilter(file)));
        });
        return Q.all(promises);
    }
};

//var imerge = new IMerge({
//    from: '/home/javey/Workspace/webapp-lebo/music_1-0-200-3_ad_BRANCH/src',
//    to: '/home/javey/Workspace/webapp-lebo/music_1-0-200-3_ad_BRANCH/dist'
//});
//imerge.start();


