/* global require */
var repl = require('repl')
,   Logness = require('./lib/logness')
;

var local = repl.start('> ');
local.context.Logness = Logness;
