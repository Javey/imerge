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
