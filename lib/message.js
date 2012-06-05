/* global module require console */
"use strict";

var spawn = require('child_process').spawn;

/* configure a messageBox */
var messageBox = spawn('syslog', [
    /* on start it should show no log items */
    '-w', '0',
    /* format */
    '-F', 'raw',
    /* use utc time format,
     * less headache when converting to a js date object */
    '-T', 'utc'
]);

/* set the messageBox to listen for incoming data */
messageBox.stdout.on('data', handle);


/* registre clients, and handle adding and removing of them */
var clients = {
    list : [],

    add: function (client) {
        clients.list.push(client);

        return true;
    },

    remove: function (client) {
        var removed = false;

        for (var i = clients.list.length; i >= 0; i--) {
            if (clients.list[i] === client) {
                clients.list.splice(i,1);
                removed = true;
            }
        }

        return removed;
    }
}

function handle(data) {
    var messages = receive(data)
    , m, c;

    for (m in messages) {
        m = messages[m];

        for (c in clients.list) {
            c = clients.list[c];

            if (typeof c.trigger === 'function' && !!c.trigger.call(m)) {
                c.emit('message', m);
            }
        }
    }
}


function receive(data) {
    var m
    /* messages could come in the form of a buffer, so we have to cast
     * it into a string. */
    ,   messages = data.toString()
    ;

    /* if two messages is received shortly after each other they will
     * arrive in the same recieval, so we have to split them into an
     * array of messages. */
    messages = messages.split('\]\n');
    messages.pop();

    /* parse each message */
    for (m in messages) {
        messages[m] = parse(messages[m]);
    }

    return messages;
}


function parse(message) {
    var rtn = {}, key, value, m;

    /* sanitize the message */
    message = message.substr(1)+'] [';
    message = message.split('] [');
    message.pop();

    for (m in message) {
        m = message[m];

        key = m.substr(0, m.indexOf(" "));
        value = m.substr(m.indexOf(" ")+1);

        rtn[key.toLowerCase()] = value;
    }

    /* convert the time into a native javascript Date object */
    if (rtn.time) {
        rtn.time = new Date(rtn.time);
    }

    /* convert the pid into a native javascript number object */
    if (rtn.pid) {
        rtn.pid = parseInt(rtn.pid, 10);
    }

    /* convert the level into a native javascript number object */
    if (rtn.level) {
        rtn.level = parseInt(rtn.level, 10);
    }

    return rtn;
}

module.exports.receive = receive;
module.exports.parse = parse;
module.exports.messageBox = messageBox;
module.exports.add = clients.add;
module.exports.remove = clients.remove;