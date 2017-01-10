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

var assert = require('assert');
var manual = require('../../src/interfaces/manual.js');
var Configuration = require('../fixtures/configuration.js');
var config = new Configuration({});
config.lacksCredentials = function () {
  return false;
};
var ErrorMessage = require('../../src/classes/error-message.js');
// var nock = require('nock');

describe('Manual handler', function () {
  // nock.disableNetConnect();
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
  describe('Report invocation behaviour', function () {
    it('Should allow argument-less invocation', function () {
      var r = report();
      assert(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
    });
    it('Should allow single string', function () {
      var r = report('doohickey');
      assert(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
      assert(r.message.match(/doohickey/), 'string error should propagate');
    });
    it('Should allow single instance of Error', function () {
      var r = report(new Error('hokeypokey'));
      assert(r.message.match(/hokeypokey/));
    });
    it('Should allow a single function as a malformed error input', function (done) {
      this.timeout(2000);
      var r = report(function(err, res) {
        assert(false, 'callback should not be called');
        done();
      });
      assert(r instanceof ErrorMessage, 'should be an instance of ErrorMessage');
      setTimeout(function() {
        done();
      }, 1000);
    });
    it('Should callback to the supplied function', function (done) {
      var r = report('malarkey', function(err, res) {
        done();
      });
      assert(r.message.match(/malarkey/), 'string error should propagate');
    });
    it('Should replace the error string with the additional message', function (done) {
      var r = report('monkey', 'wrench', function(err, res) {
        done();
      });
      assert.strictEqual(r.message, 'wrench', 'additional message should replace');
    });
    it('Should allow a full array of optional arguments', function (done) {
       var r = report('donkey', { method: 'FETCH' }, 'cart', function(err, res) {
        done();
      });
      assert.strictEqual(r.message, 'cart', 'additional message should replace');
      assert.strictEqual(r.context.httpRequest.method, 'FETCH');
    });
    it('Should allow all optional arguments except the callback', function () {
      var r = report('whiskey', { method: 'SIP' }, 'sour');
      assert.strictEqual(r.message, 'sour', 'additional message should replace');
      assert.strictEqual(r.context.httpRequest.method, 'SIP');
    });
    it('Should allow a lack of additional message', function (done) {
      var r = report('ticky', { method: 'TACKEY' }, function(err, res) {
        done();
      });
      assert(r.message.match(/ticky/) && !r.message.match(/TACKEY/),
        'original message should be preserved');
      assert.strictEqual(r.context.httpRequest.method, 'TACKEY');
    });
    it('Should ignore arguments after callback value placement', function (done) {
      var r = report('hockey', function(err, res) {
        done();
      }, 'field');
      assert(r.message.match('hockey') && !r.message.match('field'),
        'string after callback should be ignored');
    });
    it('Should ignore arguments after callback value placement', function (done) {
      var r = report('passkey', function(err, res) {
        done();
      }, { method: 'HONK'});
      assert.notEqual(r.context.httpRequest.method, 'HONK');
    });
    it('Should allow null arguments as placeholders', function (done) {
      var r = report('pokey', null, null, function(err, res) {
        done();
      });
      assert(r.message.match(/pokey/), 'string error should propagate');
    });
    it('Should allow explicit undefined arguments as placeholders', function (done) {
      var r = report('Turkey', undefined, undefined, function(err, res) {
        done();
      });
      assert(r.message.match(/Turkey/), 'string error should propagate');
    });
    it('Should allow request to be supplied as undefined', function (done) {
      var r = report('turnkey', undefined, 'solution', function(err, res) {
        done();
      });
      assert.strictEqual(r.message, 'solution', 'string error should propagate');
    });
    it('Should allow additional message to be supplied as undefined', function (done) {
      var r = report('Mickey', { method: 'SNIFF'}, undefined, function(err, res) {
        done();
      });
      assert(r.message.match(/Mickey/) && !r.message.match(/SNIFF/),
        'string error should propagate');
      assert.strictEqual(r.context.httpRequest.method, 'SNIFF');
    });
  });
});
