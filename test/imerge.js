var IMerge = require('../lib/imerge');

new IMerge.IMerge({
    from: './web',
    to: './build'
}).start();