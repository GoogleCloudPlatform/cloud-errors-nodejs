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

var EventEmitter = require('events').EventEmitter;
var test = require('tape');
var restifyInterface = require('../../lib/interfaces/restify.js');
var UNCAUGHT_EVENT = 'uncaughtException';

// node v0.12 compatibility
if (!EventEmitter.prototype.listenerCount) {
  EventEmitter.prototype.listenerCount = function(eventName) {
    return EventEmitter.listenerCount(this, eventName);
  }
}

test('Attachment of the server object to uncaughtException', function (t) {
  var ee = new EventEmitter;
  t.plan(2);
  t.deepEqual(ee.listenerCount(UNCAUGHT_EVENT), 0,
    'Listeners on event should be zero');
  // return the bound function which the user will actually interface with
  var errorHandlerInstance = restifyInterface(null, null);
  // execute the handler the user will use with the stubbed server instance
  errorHandlerInstance(ee);
  t.deepEqual(ee.listenerCount(UNCAUGHT_EVENT), 1,
    'Listeners on event should now be one');
});

test('Restify request handler lifecycle events', function (t) {
  var noOp = function () {return;};
  var ee = new EventEmitter;
  var errorHandlerInstance = restifyInterface(null, null);
  var requestHandlerInstance = errorHandlerInstance(ee);
  // excerise the default path on invalid input to the request handler
  t.doesNotThrow(function () {
    requestHandlerInstance(null, null, noOp);
  });
  // exercise the valid path without an error having occured on the req/res
  var req = new EventEmitter;
  var res = new EventEmitter;
  res.statusCode = 200;
  t.deepEqual(res.listenerCount('finish'), 0,
    'There should be zero listeners on the finish event');
  t.doesNotThrow(function () {
    requestHandlerInstance(req, res, noOp);
  });
  t.deepEqual(res.listenerCount('finish'), 1,
    'There should be one listener on the finish event');
  t.doesNotThrow(function () {
    res.emit('finish');
  });
  // exercise the valid path with an error having occured on the req/res
  var client = {
    sendError: function () {
      t.pass('sendError should be called');
    }
  };
  var config = {
    getServiceContext: function ( ) {
      t.pass('getServiceContext should be called');
      return {
        service: 'stub-service',
        version: 'stub-version'
      }
    }
  };
  ee.removeAllListeners();
  errorHandlerInstance = restifyInterface(client, config);
  requestHandlerInstance = errorHandlerInstance(ee);
  req = new EventEmitter;
  res = new EventEmitter;
  res.statusCode = 500;
  t.deepEqual(res.listenerCount('finish'), 0,
    'There should be zero listeners on the finish event');
  t.doesNotThrow(function () {
    requestHandlerInstance(req, res, noOp);
  });
  t.deepEqual(res.listenerCount('finish'), 1,
    'There should be one listener on the finish event');
  t.doesNotThrow(function () {
    res.emit('finish');
  });
  client.sendError = function () {
    t.pass('sendError should be called');
    t.end();
  };
  // exercise the server uncaughtException path
  t.doesNotThrow(function () {
    ee.emit('uncaughtException');
  });
});
