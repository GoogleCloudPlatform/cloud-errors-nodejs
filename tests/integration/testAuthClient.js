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
var AuthClient = require('../../lib/google-apis/auth-client.js');
var ErrorMessage = require('../../lib/classes/error-message.js');
var lodash = require('lodash');
var isObject = lodash.isObject;
var isString = lodash.isString;
var isEmpty = lodash.isEmpty;
var has = lodash.has;
var client;

test(
  'Test given valid init parameters we should be able to create a client',
  function ( t ) {

    if (!isString(process.env.GCLOUD_PROJECT)) {
      t.fail("The gcloud project id (GCLOUD_PROJECT) was not set as an env variable");
      t.end();
      process.exit();
    }

    try {
      client = new AuthClient(process.env.GCLOUD_PROJECT, true);
    } catch (e) {

      t.fail("Could not init client:\n"+e);
      t.end();
      process.exit();
    }
   
   t.assert(
     client instanceof AuthClient,
     "The client should be an instance of AuthClient"
   );

   t.end();
  }
);

test(
  'Given invalid json the api should respond with an error message ' +
  'and the callback function should be called',
  function (t) {

    client.sendError({}, function (error, result, response) {

      t.equal(
        result
        null,
        "The result should be of type null",
      );

      t.assert(
        error instanceof Error,
        "The error should be an instance of Error"
      );
      
      t.equal(
        "message cannot be empty.",
        error.message.toLowerCase()
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

test(
  'Given invalid input but a repeatable error response the client should retry'
  , function ( t ) {

    var tries = 0;
    var intendedTries = 4;
    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);
    var s = nock(
      'https://clouderrorreporting.googleapis.com/v1beta1/projects/',
        process.env.GCLOUD_PROJECT 
    ).persist().post('/events:report').reply(429, function () {
      
      tries += 1;
      t.comment('Mock Server Received Request: '+tries+'/'+intendedTries);
      return {error: 'Please try again later'}; 
    });

    client.sendError(em, function (error, result, response) {

      t.equal(
        tries,
        intendedTries,
        "The client should retry four times"
      );

      nock.cleanAll();
      t.end();
    });
  }
);

test(
  'Given valid json the api should response with a success message ' +
  'and the callback function should be called',
  function (t) {

    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);

    client.sendError(em, function (error, result, response) {

      t.equal(
        error,
        null,
        "The error should be null"
      );

      t.assert(
        isObject(result),
        "The result should be of type object"
      );

      t.assert(
        isEmpty(result),
        "The result should be an empty object"
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
  'Launching two requests at the same time should defer the execution of one ' +
  'request until the other has finished',
  function (t) {

    var er = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_ERROR__");
    var em = new ErrorMessage()
      .setMessage(er.stack);

    client.sendError(em, function (error, result, response) {

      t.equal(
        error,
        null,
        "The error should be null"
      );

      t.assert(
        isObject(result),
        "The result should be of type object"
      );

      t.assert(
        isEmpty(result),
        "The result should be an empty object"
      );

      t.equal(
        response.statusCode,
        200,
        'The status code should be 200'
      );
    });

    t.deepEqual(
      client.getRequestStatus(),
      true,
      "The client should be in requesting status"
    );

    var oer = new Error("_@google_STACKDRIVER_INTEGRATION_TEST_SECOND_ERROR__");
    var oem = new ErrorMessage()
      .setMessage(oer.stack);

    client.sendError(oem, function (error, result, response) {

      t.equal(
        error,
        null,
        "The error should be null"
      );

      t.assert(
        isObject(result),
        "The result should be of type object"
      );

      t.assert(
        isEmpty(result),
        "The result should be an empty object"
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
    
    var key = 'sdfdsf'
    client = new AuthClient(process.env.GCLOUD_PROJECT, true, key);
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
    
   client.sendError(em, function(error, result, response) {

      nock.cleanAll();
      t.end();
    });
  }
);

test(
  'Given a configuration to not report errors the client should callback with an error',
  function (t) {

    client = new AuthClient(process.env.GCLOUD_PROJECT, false);

    client.sendError({}, function (err, result, response){

      t.assert(
        err instanceof Error,
        "The error should be an instance of the Error class"
      );

      t.assert(
        isString(err.message),
        "The error message property should be of type string"
      );

      t.deepEqual(
        result,
        null,
        "The result should be null"
      );

      t.deepEqual(
        response,
        null,
        "The response should be null"
      );

      t.end();
    });
  }
);

test(
  'Given an invalid env configuration the client should move into the cannot init state',
  function (t) {

    process.env.GOOGLE_APPLICATION_CREDENTIALS = "error";
    client = new AuthClient(process.env.GCLOUD_PROJECT, true);

    client.on('init',
      function (initStatus) {

        t.deepEqual(
          initStatus,
          false,
          "The init status of the client should be false"
        );

        client.sendError({}, function (err, result, response) {
      
            t.assert(
              err instanceof Error,
              "The error should be an instance of the Error class"
            );

            t.deepEqual(
              result,
              null,
              "The result should be null"
            );

            t.deepEqual(
              response,
              null,
              "The response should be null"
            );

            client._requestQueue = [
              [null, null, null], 
              [null, function (err, result, response) {

                t.pass("The callback function should be called if the request queue is clear");
                t.assert(
                  err instanceof Error,
                  "The error should be an instance of the Error class"
                );

                t.deepEqual(
                  result,
                  null,
                  "The result should be null"
                );

                t.deepEqual(
                  response,
                  null,
                  "The response should be null"
                );
              }, null]
            ];

            client._queueNextRequest();

            t.deepEqual(
              client._requestQueue,
              [],
              "Artificially inserting a request into the request queue when" +
                " in the cannot init state and then attempting to queue a new" +
                " request should result in the requestQueue being cleared on the" +
                " client"
            );

            var cb = function ( ) {

              return true;
            };

            client.on('init', cb);

            t.doesNotThrow(
              client.removeListener.bind(client, 'init', cb),
              undefined,
              "Should not throw when removing a listener"
            );

            t.end();
        });
      }
    );
  }
);