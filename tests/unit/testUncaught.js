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
var lodash = require('lodash');
var isString = lodash.isString;
var uncaughtSetup = require('../../lib/interfaces/uncaught.js');
var Configuration = require('../fixtures/configuration.js');
var originalHandlers = process.listeners('uncaughtException');
var fork = require('child_process').fork;

function reattachOriginalListeners ( ) {
  for (var i = 0; i < originalHandlers.length; i++) {
    process.on('uncaughtException', originalHandlers[i]);
  }
}

// Returns a Configuration object with given value for reportUncaughtExceptions,
// and dummy logger
function getConfig(reportUncaughtExceptions) {
  return new Configuration({
    reportUncaughtExceptions: reportUncaughtExceptions
  });
}

test('Uncaught handler setup', function (t) {
  t.throws(uncaughtSetup, undefined, 'Should throw given no configuration');
  t.doesNotThrow(uncaughtSetup.bind(null, {}, getConfig(true)), undefined,
    'Should not throw given valid configuration');
  t.doesNotThrow(uncaughtSetup.bind(null, {}, getConfig(false)), undefined,
    'Should not throw given valid configuration');
  t.assert(process === uncaughtSetup({}, getConfig(true)),
    'Should return the process on successful initialization');
  process.removeAllListeners('uncaughtException');
  t.deepEqual(process.listeners('uncaughtException').length, 0,
    'There should be no listeners');
  uncaughtSetup({}, getConfig(false));
  t.deepEqual(process.listeners('uncaughtException').length, 0,
    'There should be no listeners if reportUncaughtExceptions is false');
  uncaughtSetup({}, getConfig(true));
  t.deepEqual(process.listeners('uncaughtException').length, 1,
    'There should be one listener if reportUncaughtExceptions is true');
  process.removeAllListeners('uncaughtException');
  t.end();
});

test('Test uncaught shutdown behavior', function (t) {
  if (!isString(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    || !isString(process.env.GCLOUD_PROJECT)) {
    t.skip('Skipping uncaught fixture test because environment variables' +
      'are not set');
    t.end();
    return;
  }
  var isolate = fork('./tests/fixtures/uncaughtExitBehaviour.js', null, process.env);
  var timeout = setTimeout(function () {
    t.fail('Should terminate before 2500ms');
    reattachOriginalListeners();
    t.end();
  }, 2500);
  isolate.on('close', function () {
    t.pass('Should terminate before 2500ms');
    clearTimeout(timeout);
    reattachOriginalListeners();
    t.end();
  });
  isolate.on('error', function () {
    console.log('got error:\n', arguments);
    t.fail('Got an error in isolate');
    reattachOriginalListeners();
    t.end();
  });
});
