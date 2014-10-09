var Q = require('q'),
    glob = require('glob'),
    IGenerator = require('./core/iGenerator.js'),
    IWriter = require('./core/iWriter.js');

var root = '/home/music/Workspace/lebo-pcweb/music_1-0-200-10_BRANCH/src';
Q.denodeify(glob)('**/*.css', {cwd: root})
    .then(function(files) {
        var gen = new IGenerator(files, root);
        return gen.generate();
    })
    .then(function(data) {
        var write = new IWriter(root);
        console.log(data);
        write.writeConfig(data);
    });