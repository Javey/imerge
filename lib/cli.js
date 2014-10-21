var IMerge = require('./imerge'),
    program = require('commander');

program
    .version('0.9.0')
    .usage('[options]')
    .option('-f, --from [path]', 'CSS scan path')
    .option('-t, --to [path]', 'CSS write path')
    .option('-p, --pattern [pattern]', 'CSS glob pattern')
    .option('-d, --default-padding [value]', 'Set default padding value.Don\'t add "px")')
    .parse(process.argv);

new IMerge({
    from: program.from,
    to: program.to,
    pattern: program.pattern,
    defaults: {
        padding: program.defaultPadding
    }
}).start();