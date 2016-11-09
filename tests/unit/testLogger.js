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

'use strict';
var test = require('tape');
var lodash = require('lodash');
var createLogger = require('../../lib/logger.js');

test('Initializing the logger', function (t) {
  var oldEnv = process.env.GCLOUD_ERRORS_LOGLEVEL;
  delete process.env.GCLOUD_ERRORS_LOGLEVEL;
  t.doesNotThrow(createLogger, createLogger(),
    'Does not throw given undefined');
  t.doesNotThrow(createLogger.bind(null, {}), createLogger(),
    'Does not throw given an empty object');
  t.doesNotThrow(
    createLogger.bind(null, {logLevel: 3}),
    createLogger({logLevel: 3}),
    'Does not throw given a valid configuration object with a valid log level'
  );
  t.doesNotThrow(
    createLogger.bind(null, {logLevel: '3'}),
    createLogger({logLevel: '3'}),
    ['Does not throw given a valid configuration object with a valid log level',
    'in string form'].join(' ')
  );
  t.throws(
    createLogger.bind(null, {logLevel: null}),
    undefined,
    ['Throws given a configuration object with the logLevel key specified that',
    'is not of the correct type'].join(' ')
  );
  process.env.GCLOUD_ERRORS_LOGLEVEL = 4;
  t.doesNotThrow(
    createLogger,
    createLogger({logLevel: 4}),
    ['Does not throw given only the environment configuration variable for log',
    'level setting'].join(' ')
  );
  process.env.GCLOUD_ERRORS_LOGLEVEL = oldEnv;
  t.end();
});

test('Default log level is WARN', function(t) {
  var oldEnv = process.env.GCLOUD_ERRORS_LOGLEVEL;
  delete process.env.GCLOUD_ERRORS_LOGLEVEL;

  var buffer = [];
  var orig = console._stdout.write;
  console._stdout.write = function() {
    buffer.push(arguments[0]);
    orig.apply(this, arguments);
  }

  var logger = createLogger({});
  logger.warn('test warning message');
  t.ok(
    buffer.pop().match(/test warning message/),
    'warn message should have logged'
  );

  console._stdout.write = orig;

  process.env.GCLOUD_ERRORS_LOGLEVEL = oldEnv;
  t.end();
});