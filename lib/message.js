/* global module require console */
"use strict";

var JSON3 = require('JSON3');

function receive(data) {
    var m
    ,   messages = data.toString().split('---split---\n')
    ;

    /* throw the last one away (it is empty) */
    messages.pop();

    for (m in messages) {
        messages[m] = parse(messages[m]);
    }

    return messages;
}

function parse(message) {
    /* clean up new lines */
    try {
        message = message.replace(/\n/g, "\\\\n");

        message = JSON3.parse(message);

        if (message.time) {
            message.time = new Date(message.time);
        }
        if (message.pid) {
            message.pid = parseInt(message.pid, 10);
        }

        return message;
    }
    catch(e) {
        console.log('did not compute!', e);
    }
    return {sender:'FAILURE', message: 'omg'}
}

module.exports.receive = receive;
module.exports.parse = parse;