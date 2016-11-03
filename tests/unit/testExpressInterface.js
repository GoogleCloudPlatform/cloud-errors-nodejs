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
var merge = lodash.merge;
var expressInterface = require('../../lib/interfaces/express.js');
var ErrorMessage = require('../../lib/classes/error-message.js');
var Fuzzer = require('../../utils/fuzzer.js');
var Configuration = require('../fixtures/configuration.js');

test(
  "Given invalid, variable input the express interface handler setup should not throw errors"
  , function ( t ) {

    var f = new Fuzzer();

    t.doesNotThrow(
      function ( ) {

        f.fuzzFunctionForTypes(
          expressInterface
          , ["object", "object"]
        );

        return ;
      }
      , undefined
      , "The express interface handler setup should not throw when given invalid types"
    );

    t.end();
  }
);

test(
  [
    "Given invalid setup variables from the handler setup, the bound express"
    , "error handler should still not throw when given invalid input"
  ].join(" ")
  , function ( t ) {

    var f = new Fuzzer();
    var invalidBoundHandler = expressInterface();

    var cbFn = function ( returnValue ) {

      t.assert(
        returnValue instanceof ErrorMessage
        , "The return value should be an instance of the ErrorMessage class"
      );
    }

    f.fuzzFunctionForTypes(
      invalidBoundHandler
      , ["object", "object", "object", "function"]
      , cbFn
    );

    t.end();
  }
);

test(
  [
    "Given valid setup variables from the handler setup, the bound express"
    , "error handler should produce a determinate error message and callback to"
    , "the given callback function"
  ].join(" ")
  , function ( t ) {

    var sendError = function ( ) {

      t.pass("The interface should callback to the sendError function");
    };
    var nextCb = function ( ) {

      t.pass("The interface should callback to the next callback function");
    };
    var stubbedClient = {
      sendError: sendError
    };
    var stubbedConfig = new Configuration({
      serviceContext: {
        service: "a_test_service"
        , version: "a_version"
      }
    });
    var testError = new Error("This is a test");

    var validBoundHandler = expressInterface(stubbedClient, stubbedConfig);

    var res = validBoundHandler(testError, null, null, nextCb);

    t.deepEqual(
      res
      , merge(new ErrorMessage().setMessage(testError.stack)
        .setServiceContext(
          stubbedConfig._serviceContext.service
          , stubbedConfig._serviceContext.version
        ), { eventTime: res.eventTime } )
      , [
          "The error message should be default values except for the supplied"
          , "message field"
        ].join(" ")
    );

    t.end();
  }
)
