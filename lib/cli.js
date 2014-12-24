var IMerge = require('./imerge'),
    utils = require('./core/utils'),
    chalk = require('chalk'),
	_package = require('../package.json'),
    program = require('commander');

program
    .version(_package.version)
    .usage('source dest [options]')
    .option('-p, --pattern [pattern]', 'CSS file glob pattern')
    .option('-d, --default-padding [value]', 'Set default padding value')
    .option('-a, --all', 'Process all background images')
    .option('-w, --webroot', 'Set webroot path. Default: source path')
    .option('-c, --css-to', 'CSS output path. The priority is higher than dest')
    .option('-s, --sprite-to', 'Sprite image output path. The priority is higher than dest')
    .option('-e, --source-context', 'Source file webroot')
    .option('-t, --output-context', 'Output file webroot')
    .parse(process.argv);

if (program.args.length < 2) {
    utils.log(chalk.red('You must provide the path of source and destination.'));
    program.help();
} else {
    var from = program.args[0],
        to = program.args[1];
    if (from === to) {
        var prompt = require('prompt');
        prompt.start();
        utils.log(chalk.yellow('Source is equal to destination. Do you mean rewrite the source files?(y/n)'));
        prompt.get('ok', function(err, result) {
            if (result.ok === 'y') {
                start();
            }
        });
    } else {
        start();
    }
}

function start() {
    new IMerge({
        from: program.args[0],
        to: program.args[1],
        webroot: program.webroot,
        pattern: program.pattern,
        defaults: {
            padding: program.defaultPadding
        },
        options: {
            all: program.all
        }
    }).start()
        .then(function() {
            utils.log('Finished.');
        }).catch(function(err) {
            utils.log(chalk.red(err));
        });
}
