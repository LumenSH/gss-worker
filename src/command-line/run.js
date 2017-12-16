'use strict';

let amqp = require('../amqp'),
    php = require('../php');

module.exports = () => {
    log.debug('AMQP Events', 'Register events');

    amqp.connect(() => {
        /* amqp.on('*', (eventName, data) => {
            console.log(eventName + ": " + JSON.stringify(data, null, 4));
            php.run('--help');
        });

        setTimeout(function() {
            amqp.emit({
                'name': 'GSReinstall'
            });
        }, 2000); */
    });
};