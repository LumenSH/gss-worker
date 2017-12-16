'use strict';

let program = require('commander');

program.version(`v${pkg.version}`);

global.log.initialize();

program.command('run')
    .description('Run consumer')
    .action(require('./run'));

program.option('-d, --debug', 'Enable debug mode', () => {
    global.pkg.debug = true;
});

program.parse(process.argv);
