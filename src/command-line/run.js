'use strict';

let amqp = require('../amqp'),
    php = require('../php');

module.exports = () => {
    log.debug('AMQP Events', 'Register events');

    amqp.connect(() => {
        amqp.on('*', (eventName, data) => {
            php.run(['gs:task:runner', JSON.stringify(data)]);
        });
    });
};
