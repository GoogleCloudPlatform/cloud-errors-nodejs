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

var uncaughtSetup = require('../../lib/interfaces/uncaught.js');
var test = require('tape');
var nock = require('nock');
var isString = require('lodash').isString;
var Configuration = require('../fixtures/configuration.js');
var RequestHandler = require('../../lib/google-apis/auth-client.js');
var originalHandlers = process.listeners('uncaughtException');

function reattachOriginalListeners ( ) {
  for (var i = 0; i < originalHandlers.length; i++) {
    process.on('uncaughtException', originalHandlers[i]);
  }
}
test('Sending behavior when an uncaughtException is encountered', function (t) {
  process.removeAllListeners('uncaughtException');
  if (!isString(process.env.GCLOUD_PROJECT)) {
    t.fail("The gcloud project id (GCLOUD_PROJECT) was not set as an env variable");
    t.end();
    process.exit();
  } else if (!isString(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    t.fail("The app credentials (GOOGLE_APPLICATION_CREDENTIALS) was not set as an env variable");
    t.end();
    process.exit();
  }
  var s = nock(
    'https://clouderrorreporting.googleapis.com/v1beta1/projects/'+
      process.env.GCLOUD_PROJECT
  ).post('/events:report').once().reply(200, function () {
    t.pass('The library should attempt to create an entry with the service');
    reattachOriginalListeners();
    t.end();
    return {success: true};
  });
  var cfg = new Configuration({reportUncaughtExceptions: true});
  var client = new RequestHandler(cfg);
  var uncaught = uncaughtSetup(client, cfg);
  setImmediate(function () {
    throw new Error('This error was supposed to be thrown');
  });
});
