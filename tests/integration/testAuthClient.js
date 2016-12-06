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
var nock = require('nock');
var RequestHandler = require('../../lib/google-apis/auth-client.js');
var ErrorMessage = require('../../lib/classes/error-message.js');
var Configuration = require('../fixtures/configuration.js');
var createLogger = require('../../lib/logger.js');
var lodash = require('lodash');
var isObject = lodash.isObject;
var isString = lodash.isString;
var isEmpty = lodash.isEmpty;
var client;


test(
  'Test given valid init parameters we should be able to create a client',
  function ( t ) {
    var cfg  = new Configuration({ignoreEnvironmentCheck: true}, 
      createLogger({logLevel: 5}));
    if (!isString(process.env.GCLOUD_PROJECT)) {
      t.fail("The gcloud project id (GCLOUD_PROJECT) was not set as an env variable");
      t.end();
      process.exit();
    } else if (!isString(process.env.STUBBED_API_KEY)) {
      t.fail("The api key (STUBBED_API_KEY) was not set as an env variable");
      t.end();
      process.exit();
    } else if (!isString(process.env.STUBBED_PROJECT_NUM)) {
      t.fail('The project number (STUBBED_PROJECT_NUM) was not set as an env variable');
    }

    try {
      client = new RequestHandler(cfg, createLogger({logLevel: 5}));
    } catch (e) {

      t.fail("Could not init client:\n"+e);
      t.end();
      process.exit();
    }
   t.pass("Able to create client without throwing")
   t.end();
  }
);

test(
  'Given invalid json the api should respond with an error message ' +
  'and the callback function should be called',
  function (t) {
    client.sendError({}, function (error, response, body) {
      t.equal(
        body,
        null,
        "the body should be of type null"
      );
      t.assert(
        error instanceof Error,
        "The error should be an instance of Error"
      );
      t.equal(
        "message cannot be empty.",
        error.message.toLowerCase(),
        "The error message should be in the message property"
      );
      t.assert(
        isObject(response),
        "The response should be of type object"
      );
      t.equal(
        response.statusCode,
        400,
        "The error code should be 400"
      );
      t.end();
    });
  }
);

test('Given invalid input but a repeatable error response the client should retry',
  function ( t ) {
    var tries = 0;
    var intendedTries = 5;
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    var s = nock(
      'https://clouderrorreporting.googleapis.com/v1beta1/projects/'+
        process.env.GCLOUD_PROJECT
    ).persist().post('/events:report').reply(429, function () {
      tries += 1;
      t.comment('Mock Server Received Request: '+tries+'/'+intendedTries);
      return {error: 'Please try again later'};
    });
    client.sendError(em, function (error, response, body) {
      t.equal(
        tries,
        intendedTries,
        ["The client should retry", intendedTries, "times"].join(" ")
      );
      nock.cleanAll();
      t.end();
    });
  }
);

test('Not giving a callback function should still allow the actual request to execute',
  function ( t ) {
    var tries = 0;
    var intendedTries = 5;
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    var s = nock(
      'https://clouderrorreporting.googleapis.com/v1beta1/projects/'+
        process.env.GCLOUD_PROJECT
    ).persist().post('/events:report').reply(200, function () {
      tries += 1;
      t.pass('Mock Server Received Request');
      nock.cleanAll();
      t.end();
      return {};
    });
    client.sendError(em);
  }
);

test(
  'Given valid json the api should response with a success message ' +
  'and the callback function should be called',
  function (t) {
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    client.sendError(em, function (error, response, body) {
      t.equal(
        error,
        null,
        "The error should be null"
      );
      t.assert(
        isObject(body),
        "the body should be of type object"
      );
      t.assert(
        isEmpty(body),
        "the body should be an empty object"
      );
      t.equal(
        response.statusCode,
        200,
        'The status code should be 200'
      );
      t.end();
    });
  }
);

test(
  'Given a key the client should include it as a url param on all requests',
  function (t) {
    var key = process.env.STUBBED_API_KEY
    client = new RequestHandler(new Configuration(
      {key: key, ignoreEnvironmentCheck: true},
      createLogger({logLevel: 5})
    ));
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    var s = nock(
      'https://clouderrorreporting.googleapis.com/v1beta1/projects/' +
       process.env.GCLOUD_PROJECT
    ).persist().post('/events:report?key='+key).reply(200, function (uri) {
      t.deepEqual(
        uri.split("key=")[1],
        key,
        "The uri should have the key embedded into it"
      );

      return {done: true};
    });
   client.sendError(em, function(error, body, response) {
      nock.cleanAll();
      t.end();
    });
  }
);

test(
  'Given valid json and API key the api should response with a success message'+
  ' and the callback function should be called',
  function (t) {
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_API_KEY_ERROR__");
    var em = new ErrorMessage().setMessage(er.stack);
    client.sendError(em, function (error, response, body) {
      t.equal(
        error,
        null,
        "The error should be null"
      );
      t.assert(
        isObject(body),
        "the body should be of type object"
      );
      t.assert(
        isEmpty(body),
        "the body should be an empty object"
      );
      t.equal(
        response.statusCode,
        200,
        'The status code should be 200'
      );
      t.end();
    });
  }
);

test(
  'Given a configuration to not report errors the client should callback with an error',
  function (t) {
    var old = process.env.NODE_ENV;
    delete process.env.NODE_ENV;
    var l = createLogger({logLevel: 5});
    client = new RequestHandler(new Configuration(undefined, l), createLogger({logLevel: 5}));
    client.sendError({}, function (err, response, body){
      t.assert(
        err instanceof Error,
        "The error should be an instance of the Error class"
      );
      t.assert(
        isString(err.message),
        "The error message property should be of type string"
      );
      t.deepEqual(
        body,
        null,
        "the body should be null"
      );
      t.deepEqual(
        response,
        null,
        "The response should be null"
      );
      process.env.NODE_ENV = old;
      t.end();
    });
  }
);

test(
  'Given an invalid env configuration the client should move into the cannot init state',
  function (t) {
    var old = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_API_KEY_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    var cfg = new Configuration(undefined, createLogger({logLevel: 5}));
    client = new RequestHandler(cfg, createLogger({logLevel: 5}));
    client.sendError(em, function (err, response, body) {
      t.assert(
        err instanceof Error,
        "The error should be an instance of the Error class"
      );
      t.deepEqual(
        response,
        null,
        "The response should be of type null"
      );
      t.deepEqual(
        body,
        null,
        "The response body should be of type null"
      );
      t.end();
    });
  }
);

test(
  'Test given valid init parameters we should be able to create a client using' +
  ' project number',
  function ( t ) {
    var client;
    var oldProject = process.env.GCLOUD_PROJECT;
    var oldKey = process.env.STUBBED_API_KEY;
    delete process.env.GCLOUD_PROJECT;
    delete process.env.STUBBED_API_KEY;
     var cfg  = new Configuration(
      {
        projectId: process.env.STUBBED_PROJECT_NUM,
        ignoreEnvironmentCheck: true
      },
      createLogger({logLevel: 5})
    );

    try {
      client = new RequestHandler(cfg, createLogger({logLevel: 5}));
    } catch (e) {

      t.fail("Could not init client:\n"+e);
      t.end();
      process.exit();
    }
   t.pass("Able to create client without throwing");
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    client.sendError(em, function (error, response, body) {
      t.equal(
        error,
        null,
        "The error should be null"
      );
      t.assert(
        isObject(body),
        "the body should be of type object"
      );
      t.assert(
        isEmpty(body),
        "the body should be an empty object"
      );
      t.equal(
        response.statusCode,
        200,
        'The status code should be 200'
      );
      process.env.GCLOUD_PROJECT = oldProject;
      process.env.STUBBED_API_KEY = oldKey;
      t.end();
    });
  }
);
