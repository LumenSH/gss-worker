'use strict';

const amqp = require('amqp');

let AMQPClass = {
    connection: null,
    exchange: null,
    cb: () => {},
    queueName: 'server_queue',
    events: {
        'GSUpdate': [],
        'GSReinstall': [],
        'GSDelete': [],
        '*': []
    },

    connect: (cb) => {
        if (AMQPClass.connection) {
            return;
        }

        log.debug('AMQP', 'Establishing connection to AMQP server');
        AMQPClass.connection = amqp.createConnection(global.pkg.amqp);
        AMQPClass.connection.once('ready', () => {
            log.debug('AMQP', 'Connected');
            this.cb = cb;
            AMQPClass.registerExchange();
        });
        AMQPClass.connection.on('error', function(error) {
            log.error('AMQP', `Error from amqp: ${error}`);
        });
    },

    registerExchange: () => {
        if (!AMQPClass.connection) {
            throw new Error('No connection established');
        }

        log.debug('AMQP', 'Creating exchange');
        AMQPClass.connection.exchange('server_queue', {
            type: 'direct',
            durable: false,
            confirm: true,
            autoDelete: false
        }, (exchange) => {
            AMQPClass.exchange = exchange;
        });
	AMQPClass.registerQueue();
    },
    
    emit: (msg, cb) => {
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        log.debug('AMQP', 'Emitting data');
        AMQPClass.exchange.publish('', msg, null, cb);
    },

    registerQueue: () => {
        log.debug('AMQP', 'Register queue');
        AMQPClass.connection.queue(AMQPClass.queueName, {
            durable: true,
            autoDelete: false
	}, (queue) => {
            AMQPClass.queue = queue;
            queue.bind(AMQPClass.queueName, '');
            AMQPClass.registerSubscriber();
        });
    },

    registerSubscriber: () => {
        log.debug('AMQP', 'Register event subscriber');
        AMQPClass.queue.subscribe((message) => {
            try {
                if (typeof message !== 'object') {
                    log.warn('AMQP', `Ignoring task -> ${message}`);
                    return;
                }

                let data = JSON.parse(message.data.toString());
                if (!data) {
                    log.error(`Error parsing buffer from message: ${message.data.toString()}`);
                    return;
                }

                AMQPClass._trigger(data.name, data);
            } catch(e) {
                log.error('AMQP', `Error consuming task: ${e.toString()}`);
            }
        });
        this.cb();
    },

    on: (eventName, func) => {
        if (AMQPClass.events[eventName] === undefined) {
            throw new Error(`Undefined event "${eventName}"`);
        }

        AMQPClass.events[eventName].push(func);
    },

    _trigger: (eventName, data) => {
        log.debug('AMQP', `Got trigger for event "${eventName}"`);
        if (AMQPClass.events[eventName] !== undefined) {
            AMQPClass.events[eventName].forEach((func) => {
                try {
                    void func(data);
                } catch(e) {}
            });
        }

        AMQPClass.events['*'].forEach((func) => {
            try {
                void func(eventName, data);
            } catch(e) {}
        });
    }
};

module.exports = AMQPClass;
