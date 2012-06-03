/* global require */
var repl = require('repl')
,   message = require('./lib/message')
;

var local = repl.start('> ');
local.context.message = message;
