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
        this.message = '[[ASLMessageID 258072] [Time 1338717334] [TimeNanoSec 896557000] [Level 5] [PID 43361] [UID 0] [GID 1854641853] [ReadGID 80] [Host m01215] [Sender login] [Facility com.apple.system.utmpx] [Message DEAD_PROCESS: 43361 ttys006] [ut_user magu] [ut_id s006] [ut_line ttys006] [ut_pid 43361] [ut_type 8] [ut_tv.tv_sec 1338717334] [ut_tv.tv_usec 896297] [ASLExpireTime 1370339734]]\n';
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
             var m = '[ASLMessageID 261144] [Time 1338745259] [TimeNanoSec 562597000] [Level 4] [PID 12504] [UID 1223284547] [GID 1854468531] [ReadUID 1932842457] [Host home] [Sender Mail] [Facility com.apple.mail] [Message __-MessageContentController _asyncFetchContentsForMessage:withViewingState:_block_invoke_2 | MimePart+GPGMail.m150 DEBUG -MimePart(GPGMail) MADecodeWithContext: enter - decoding: Re: cake in the meeting room - part: \n|   <MimePart:0xf7b3d6ei49ff>\n|   Content-Type: text/html;\n|       charset=ISO-8859-1\n|   Content-Transfer-Encoding: quoted-printable\n|   X-Content-Range: 1854/2907\n|   X-IMAP-Part-Number: 2] [CFLog\sLocal\sTime 2012-06-03 19:40:59.562] [CFLog\sThread 9347]\n';

             assert.equals(message.receive(m).length, 1);
             assert.equals(message.receive(m + this.message).length, 2);
             assert.equals(message.receive(m + this.message + m).length, 3);
             assert.equals(message.receive(this.message + m + this.message + m).length, 4);
        }
        ,'should handle messages with closing square brackets inside of them': function() {
             var m = '[ASLMessageID 261144] [Time 1338745259] [TimeNanoSec 562597000] [Level 4] [PID 12504] [UID 1223284547] [GID 1854468531] [ReadUID 1932842457] [Host home] [Sender Mail] [Facility com.apple.mail] [Message __-MessageContentController _asyncFetchContentsForMessage:withViewingState:\]_block_invoke_2 | MimePart+GPGMail.m150\] DEBUG\] -MimePart(GPGMail) MADecodeWithContext:\] enter - decoding: Re: cake in the meeting room - part: \n|   <MimePart:0xf7b3d6ei49ff>\n|   Content-Type: text/html;\n|       charset=ISO-8859-1\n|   Content-Transfer-Encoding: quoted-printable\n|   X-Content-Range: 1854/2907\n|   X-IMAP-Part-Number: 2] [CFLog\sLocal\sTime 2012-06-03 19:40:59.562] [CFLog\sThread 9347]\n';
             assert.equals(message.receive(m).length, 1);
             assert.equals(message.receive(m + this.message).length, 2);
        }

    }
});