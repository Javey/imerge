var IMerge = require('../lib/imerge');

new IMerge.IMerge({
    from: './web',
    to: './build',
    spriteTo: './build/sprite'
}).start();