var IMerge = require('../lib/imerge');

new IMerge({
    from: './web',
    to: './build'
}).start();