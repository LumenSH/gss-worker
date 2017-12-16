'use strict';

const spawn = require('child_process').spawn,
        phpConfig = {
            executable: '/usr/local/bin/php7.1',
            cwd: '/home/current'
        };

module.exports = {
    run: (cmd, args) => {
        try {

            let process = spawn(phpConfig.executable, args.unshift(cmd), {
                cwd: phpConfig.cwd,
                detached: true
            });

            process.on('error', (err) => {
                log.error('PHP', err.toString());
            });

        } catch(err) {
            log.error('PHP', err.toString());
        }
    }
};