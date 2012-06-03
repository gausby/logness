/*global assert require JSON */
"use strict";

var buster = require('buster')
,   message = require('../lib/message')
,   util = require('util')
;

var refute = buster.assertions.refute;
var assert = buster.assertions.assert;

buster.testCase('A message', {
    setUp: function() {
        this.message = JSON.stringify({
            "time":"Dec 24 21:28:49",
            "host":"home",
            "sender":"log.ness.js",
            "pid":"42",
            "message":"Something went wrong."
        });
    }

    ,'parsing': {
        setUp: function() {}
        ,'should parse time into a date object': function() {
             assert.isTrue(message.parse(this.message).time instanceof Date);
        }
        ,'should parse pid into a number object': function() {
             assert.isTrue(typeof message.parse(this.message).pid === 'number');
        }

    }

    ,'receiving': {
        setUp: function() {
            this.message = JSON.stringify({
                "time":"Dec 24 21:28:49",
                "host":"home",
                "sender":"log.ness.js",
                "pid":"42",
                "message":"Something went wrong."
            }) + '---split---\n';

        }
        ,'should be able to recieve one message': function() {
             assert.equals(message.receive(this.message).length, 1);
        }
        ,'should be able to recieve two messages': function() {
             assert.equals(message.receive(this.message + this.message).length, 2);
        }
        ,'should be able to recieve five messages': function() {
             var m = [
                 this.message, this.message, this.message, this.message, this.message
             ].join('');
             assert.equals(message.receive(m).length, 5);
        }
        ,'should handle messages with newlines': function() {
             var m = '{"time":"Dec 24 21:28:49","host":"home","sender":"Mail","pid":"42","message":"__-[MessageContentController _asyncFetchContentsForMessage:withViewingState:]_block_invoke_3 | MimePart+GPGMail.m[150] [DEBUG] -[MimePart(GPGMail) MADecodeWithContext:] enter - decoding: Re: cake in the meeting room - part: \n|   <MimePart:0x3ff126f21201>\n|   Content-Type: text/plain;\n|       charset=iso-8859-1\n|   Content-Transfer-Encoding: quoted-printable\n|   X-Content-Range: 142/560\n|   X-IMAP-Part-Number: 1"}---split---\n';

             assert.equals(message.receive(m).length, 1);
             assert.equals(message.receive(m + this.message).length, 2);
             assert.equals(message.receive(m + this.message + m).length, 3);
             assert.equals(message.receive(this.message + m + this.message + m).length, 4);
        }
        ,'should handle messages with closing curly brackets inside of them': function() {
             var m = '{"time":"Dec 24 21:28:49","host":"home","sender":"Mail","pid":"42","message":"this is a curly bracket }"}---split---\n';
             assert.equals(message.receive(m).length, 1);
             assert.equals(message.receive(m + this.message).length, 2);
        }
        ,'should be able to parse messages with closing curly brackets inside of them': function() {
             var m = '{"time":"Dec 24 21:28:49","host":"home","sender":"Mail","pid":"42","message":"this is a curly bracket }"}';

             assert.equals(message.parse(m).message, "this is a curly bracket }");
        }

    }
});