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
    var opt = this.options = utils.extend(true, {
        from: '',
        to: '',
        webroot: '',
        pattern: '/**/*.css',
        defaults: {
            padding: null
        },
        options: {
            all: false
        }
    }, options);
    opt.from = path.resolve(process.cwd(), opt.from);
    opt.to = path.resolve(process.cwd(), opt.to);
    opt.webroot = opt.webroot ? path.resolve(process.cwd(), opt.webroot) : opt.from;
    this.pathFilter = _.defaults(pathFilter || {}, {
        // 图片地址过滤器
        imagePathFilter: function(file) {
            return file;
        },
        // sprite图片输出路径
        spriteTo: function(merge) {
            return opt.to + '/sprite/spirte_' + merge + '.png';
        },
        // sprite图片写回css中地址
        spritePathFilter: function(file) {
            return file.replace(opt.to, '');
        },
        // 处理后的css存放地址
        cssTo: function(file) {
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
        var opt = this.options;
        return new IParser(files, opt).parse();
    },

    layout: function(data) {
        var promises = [],
            imageList = [],
            pathFilter = this.pathFilter.imagePathFilter;
        _.each(data, function(conf, path) {
            var image = new IImage(pathFilter(path), conf);
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
            pathFilter = this.pathFilter.spriteTo;
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
        var spritePathFilter = this.pathFilter.spritePathFilter;
        _.each(data, function(sprite) {
            sprite.data = {};
            sprite.spriteFile = spritePathFilter(sprite.toFile);
            _.each(sprite.images, function(image) {
                _.each(image.config.urls, function(v, url) {
                    sprite.data[url] = image;
                });
            });
        });
    },

    replace: function(files, data) {
        var pathFilter = this.pathFilter.cssTo,
            promises = [],
            opt = this.options;
        this.kvData(data);
        _.each(files, function(file) {
            var iReplace = new IReplace(file, data, opt.options);
            promises.push(iReplace.writeFile(pathFilter(file)));
        });
        return Q.all(promises);
    }
};



