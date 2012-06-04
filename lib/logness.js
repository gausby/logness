/* global require module */
"use strict";

var message = require('./message')
,   events = require('events')
,   util = require('util')
;

var catchAll = function() {
    return true;
};

function Logness(listen) {
    events.EventEmitter.call(this);
    this.trigger = typeof listen === 'function' ? listen : catchAll;
    message.add(this);
}

/* Logness is an event emitter */
util.inherits(Logness, events.EventEmitter);

Logness.prototype.unsubscribe = function() {
    this.removeAllListeners();
    message.remove(this);
    delete this;
}

module.exports = Logness;