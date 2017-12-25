const spawn = require('child_process').spawn;

let queue =  {
    running: false,
    tasks: []
};

let php = {
    queue: {
        running: false,
        tasks: [],
        add: (args) => {
            php.queue.tasks.push(args);
            php.queue.execute();
        },
        execute: () => {
            if (php.queue.running !== true && php.queue.tasks.length > 0) {
                let task = php.queue.tasks.shift();
                php.run(task);
            }
        }
    },
    run: (args) =>  {
        if (typeof args !== 'object') {
            args = [args];
        }

        args.unshift('bin/console');

        log.debug('PHP', `Run command "${args[1] || 'undefined'}" with args "${JSON.stringify(args)}"`);

        let process = spawn('/usr/bin/php7.1', args, {
            cwd: '/home/gs3/current',
        });

        process.stdin.setEncoding('utf-8');
        process.stdout.setEncoding('utf-8');

        process.on('error', (err) => {
            log.error('PHP (Start)', err);
        });

        process.stdout.on('data', (data) => {
            log.log('PHP (Run)', data);
        });

        process.stderr.on('data', (data) => {
            log.error('PHP (Run)', data);
        });

        process.on('close', () => {
            php.queue.running = false;
            php.queue.execute();
        });
    }
};

module.exports = php;