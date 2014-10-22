var IMerge = require('../lib/imerge.js');

var imerge = new IMerge({
    from: '/home/javey/Workspace/webapp-lebo/music_1-0-200-3_ad_BRANCH/src',
    to: '/home/javey/Workspace/webapp-lebo/music_1-0-200-3_ad_BRANCH/dist',
    defaults: {
        padding: 10
    },
    options: {
        all: true
    }
});
imerge.start();