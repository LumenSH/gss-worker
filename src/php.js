const spawn = require('child_process').spawn;

module.exports = {
    run: (args) =>  {
        if (typeof args !== 'object') {
            args = [args];
        }

        args.unshift('bin/console');

        log.debug('PHP', `Run command "${args[1] || 'undefined'}" with args "${JSON.stringify(args)}"`);

        let process = spawn('/usr/bin/php7.1', args, {
            cwd: '/home/gs3/current',
            // uid: 1001,
            detached: true
        });

        process.stdin.setEncoding('utf-8');
        process.stdout.setEncoding('utf-8');

        process.on('error', (err) => {
            log.error('PHP', err.toString());
        });

        process.stdout.on('data', (data) => {
            log.log('PHP', data);
        });

        process.stderr.on('data', (data) => {
            log.error('PHP', data);
        });
    }
};