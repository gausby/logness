/* global require module */
"use strict";

var spawn = require('child_process').spawn
,   message = require('./message')
,   JSON3 = require('JSON3')
;

var json_format = '{"time":"$(Time)","host":"$(Host)","sender":"$(Sender)","pid":"$(PID)","message":"$(Message)"}---split---'

var messageBox = spawn('syslog', [
    /* on start it should show zero log items */
    '-w', '0',
    /* format */
    '-F', json_format
]);


function handle(data) {
    var messages = message.receive(data)
    , m;

    for (m in messages) {
        console.log(messages[m].sender + ": " + messages[m].message + "\n");
    }
}

messageBox.stdout.on('data', handle);

function Logness() {

}

module.exports = Logness;