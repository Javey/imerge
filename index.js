var Q = require('q'),
    glob = require('glob'),
    Generator = require('./core/generator.js'),
    Writer = require('./core/writer.js');

var root = '/home/music/Workspace/M3DImerge/test';
Q.denodeify(glob)('**/*.css', {cwd: root})
    .then(function(files) {
        var gen = new Generator(files, root);
        return gen.generate();
    })
    .then(function(data) {
        var write = new Writer(root);
        write.writeConfig(data);
    });