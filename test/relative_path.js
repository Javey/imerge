var IMerge = require('../lib/imerge.js');

var imerge = new IMerge({
    from: '/home/javey/Workspace/test/src',
    to: '/home/javey/Workspace/test/dist',
    defaults: {
        padding: 10
    },
    options: {
        all: true
    }
});
imerge.start();