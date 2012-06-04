# Logness

A wrapper for the Mac OS X syslog log message viewer.

If you just initialize a Logness without a filtering function the Logness will emit on every log item that goes into the system `syslog`.

A Logness that would grep all incoming log messages and display their sender and error level could be written as:

    var Logness = require('logness');
    var logs = new Logness();

    logs.on('message', function(data) {
        console.log([data.sender, data.level].join(' '));
    });


## Filtering

If you pass in a function when you initialize a Logness, you can filter the messages it will react to.

    var Logness = require('logness');
    var mail = new Logness(function() {
        /* grep everything send to mail with an error level above 3 */
        return this.sender === 'Mail' && this.level > 3;
    });

    mail.on('message', function(data) {
        console.log(data.time, data.message);
    });

The function passed to Logness should return a Boolean value; `true` if the Logness instance should react on the message, and `false` if it should be ignore it. If no function is passed it will get passed a 'catch all'-function that return `true` for every message, in other words; the Logness instance will get every message.

Inside the filtering function `this` refers to the message data.


## Message format

The message should have the following data attached to it:

  * `sender` {string} The name of the program that send the message

  * `pid` {number} process id of the sender

  * `message` {string} what happened

  * `time` {date} the time it happened

  * `level` {number} error level

  * `host` {string} the name of the machine where the log occurred


## Todo

  * Make this work for BSD, Linux and other operating systems. Perhaps make a plugin system, that enables Logness to understand other log formats.

  * Fix the way the obejcts get notified about messages. I don't know if I like the way it is currently implemented.
