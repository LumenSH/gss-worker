'use strict';

const   colors = require('colors'),
        callerId = require('caller-id'),
        defaultUnknownText = 'undefined';

console.debug = console.log;

let logging = { 
    consoleEvents: [
        {
            name: 'info',
            color: 'white'
        },
        {
            name: 'log',
            color: 'green'
        },
        {
            name: 'error',
            color: 'red'
        },
        {
            name: 'warn',
            color: 'yellow'
        },
        {
            name: 'debug',
            color: 'grey'
        }
    ],

    getLogDate: () => {
        
        return new Date().toLocaleString();
    },
    getTrace: (eventName) => {
        let caller = callerId.getString(logging[eventName]);
        if (!caller || caller === 'getData') {
            caller = '(anonymous function)';
        }
        return caller;
    },

    initialize: () => {
        logging.consoleEvents.forEach((consoleEvent) => {
            logging[consoleEvent.name] = (name, data) => {
                if (consoleEvent.name === 'debug' && !global.pkg.debug) {
                    return;
                }

                let calledCategory;
                let calledByFunction = logging.getTrace(consoleEvent.name);
                if (data === undefined) {
                    data = name;
                    calledCategory = defaultUnknownText;
                } else {
                    calledCategory = name || defaultUnknownText;
                }
                console[`${consoleEvent.name}`](`[${logging.getLogDate()}] [${calledCategory}/${calledByFunction}] ${consoleEvent.name.toUpperCase()[consoleEvent.color]}   ${data.white}`);
            }
        });
    },

    info: null,
    log: null,
    error: null,
    warn: null
};

module.exports = logging;