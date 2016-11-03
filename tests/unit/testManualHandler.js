/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var test = require('tape');
var manual = require('../../lib/interfaces/manual.js');
var Configuration = require('../fixtures/configuration.js');
var config = new Configuration({});
var ErrorMessage = require('../../lib/classes/error-message.js');

// Mocked client
var client = {
    sendError: function(e, cb) {
    // immediately callback
    if (cb) {
      setImmediate(cb);
    }
  }
};
var report = manual(client, config);

test('Test manual handler interface', function(t) {
  t.equal(typeof report, 'function', 'should be a function');
  t.end();
});

test('single string argument is accepted', function(t) {
  var r = report('doohickey');
  t.ok(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
  t.ok(r.message.match(/doohickey/), 'string error should propagate');
  t.end();
});

test('single error argument is accepted', function(t) {
  var r = report(new Error('hokeypokey'));
  t.ok(r.message.match(/hokeypokey/));
  t.end();
});

test('callback function should get called', function(t) {
  var r = report('malarkey', function(err, res) {
    t.end();
  });
  t.ok(r.message.match(/malarkey/), 'string error should propagate');
});

test('calls without any arguments work', function(t) {
  var r = report();
  t.ok(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
  t.end();
});

test('just a function is accepted as a malformed error rather than a callback',
    function(t) {
      var r = report(function(err, res) {
        t.fail('callback should not get called');
      });
      t.ok(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
      setTimeout(function() {
        t.end();
      }, 1000);
    });

test('optional additional message should replace error string', function(t) {
  var r = report('monkey', 'wrench', function(err, res) {
    t.end();
  });
  t.equal(r.message, 'wrench', 'additional message should replace');
});

test('all arguments', function(t) {
  var r = report('donkey', { method: 'FETCH' }, 'cart', function(err, res) {
    t.end();
  });
  t.equal(r.message, 'cart', 'additional message should replace');
  t.equal(r.context.httpRequest.method, 'FETCH');
});

test('everything but the callback', function(t) {
  var r = report('whiskey', { method: 'SIP' }, 'sour');
  t.equal(r.message, 'sour', 'additional message should replace');
  t.equal(r.context.httpRequest.method, 'SIP');
  t.end();
});

test('missing additional message', function(t) {
  var r = report('ticky', { method: 'TACKEY' }, function(err, res) {
    t.end();
  });
  t.ok(r.message.match(/ticky/) && !r.message.match(/TACKEY/),
    'original message should be preserved');
  t.equal(r.context.httpRequest.method, 'TACKEY');
});

test('arguments after callback function should get ignored', function(t) {
  var r = report('hockey', function(err, res) {
    t.end();
  }, 'field');
  t.ok(r.message.match('hockey') && !r.message.match('field'),
    'string after callback should be ignored');
});

test('null arguments in the middle', function(t) {
  var r = report('pokey', null, null, function(err, res) {
    t.end();
  });
  t.ok(r.message.match(/pokey/), 'string error should propagate');
});

test('undefined arguments in the middle', function(t) {
  var r = report('Turkey', undefined, undefined, function(err, res) {
    t.end();
  });
  t.ok(r.message.match(/Turkey/), 'string error should propagate');
});

test('undefined request', function(t) {
  var r = report('turnkey', undefined, 'solution', function(err, res) {
    t.end();
  });
  t.equal(r.message, 'solution', 'string error should propagate');
});

test('undefined additional message', function(t) {
  var r = report('Mickey', { method: 'SNIFF'}, undefined, function(err, res) {
    t.end();
  });
  t.ok(r.message.match(/Mickey/) && !r.message.match(/SNIFF/),
    'string error should propagate');
  t.equal(r.context.httpRequest.method, 'SNIFF');
});

test('arguments after the callback funciton should get ignored', function(t) {
  var r = report('passkey', function(err, res) {
    t.end();
  }, { method: 'HONK'});
  t.notEqual(r.context.httpRequest.method, 'HONK');
});
