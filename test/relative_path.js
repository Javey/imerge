var IMerge = require('../lib/imerge.js');

var imerge = new IMerge({
    from: '/home/javey/Workspace/test/src',
    to: '/home/javey/Workspace/test/dist',
    defaults: {
        padding: 10
    }
}, {
    spriteAbsolutePath: function(merge) {
        return '/home/javey/Workspace/test/dist/sprite/spirte_' + merge + '.png';
    },
    spriteRelativePath: function(file) {
        return file.replace('/home/javey/Workspace/test/dist', '');
    },
    imageAbsolutePath: function(file) {
        console.log(file);
        return this.options.from + file.replace('..', '');
    },
    imageRelativePath: function(file) {
        return file.replace(opt.from, '');
    },
    cssAbsolutePath: function(file) {
        return file.replace(opt.from, opt.to);
    }
});
imerge.start();