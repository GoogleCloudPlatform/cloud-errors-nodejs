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
var extractFromErrorClass = require('../../lib/error-extractors/error.js');
var ErrorMessage = require('../../lib/classes/error-message.js');

test(
  'Test Error Class Extraction Message'
  , function ( t ) {

    var TEST_MESSAGE = "This is a test";

    var em = new ErrorMessage();
    var err = new Error(TEST_MESSAGE);

    t.plan(1);

    extractFromErrorClass(err, em);

    t.deepEqual(
      em.message
      , err.stack
      , "Given a valid message the error message should absorb the error stack as the message"
    );
  }
);

test(
  'Test Error Class Extraction User'
  , function ( t ) {

    var TEST_USER_VALID = "TEST_USER";
    var TEST_USER_INVALID = 12;

    t.plan(2);

    var em = new ErrorMessage();
    var err = new Error();
    err.user = TEST_USER_VALID;

    extractFromErrorClass(err, em);
    t.assert(
      em.context.user === TEST_USER_VALID
      , "Given a valid user the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = new Error();
    err.user = TEST_USER_INVALID;

    extractFromErrorClass(err, em);
    t.assert(
      em.context.user === ""
      , "Given an invalid user the error message should set the user property as an empty string"
    );
  }
);

test(
  'Test Error Class Extraction Service'
  , function ( t ) {

    var TEST_SERVICE_VALID = {service: 'test', version: 'test'};
    var TEST_SERVICE_DEFAULT = {service: 'node', version: undefined};
    var TEST_SERVICE_INVALID = 12;

    t.plan(3);

    var em = new ErrorMessage();
    var err = new Error();
    err.serviceContext = TEST_SERVICE_VALID;

    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_VALID
      , "Given a valid service context the value should be set on the error message"
    );

    em = new ErrorMessage();
    err = new Error();
    err.serviceContext = TEST_SERVICE_INVALID;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given an invalid service context the error message should retain default values on service context"
    );

    em = new ErrorMessage();
    err = new Error();
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given no service context the error message should retain default values on service context"
    );
  }
);

test(
  'Test Error Class Extraction Report Location'
  , function ( t ) {

    var TEST_STACK_DEFAULT = {
      filePath: ""
      , lineNumber: 0
      , functionName: ""
    };
    var TEST_STACK_VALID = {
      filePath: "valid"
      , lineNumber: 2
      , functionName: "value"
    };
    var TEST_STACK_INVALID_CONTENTS = {
      filePath: null
      , lineNumber: "2"
      , functionName: {}
    };
    var TEST_STACK_INVALID_TYPE = [];

    t.plan(2);

    // DISABLED SINCE WE MUST USE THE DEFAULT STACK DATA
    // var em = new ErrorMessage();
    // var err = new Error();
    // err.stack = TEST_STACK_VALID;
    // extractFromErrorClass(err, em);
    // t.deepEqual(
    //   em.context.reportLocation
    //   , TEST_STACK_VALID
    //   , "Given a valid stack the error message should absorb these values"
    // );

    var em = new ErrorMessage();
    var err = new Error();
    err.stack = TEST_STACK_INVALID_CONTENTS;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.context.reportLocation
      , TEST_STACK_DEFAULT
      , "Given an invalid stack contents the error message should be the default values"
    );

    var em = new ErrorMessage();
    var err = new Error();
    err.stack = TEST_STACK_INVALID_TYPE;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.context.reportLocation
      , TEST_STACK_DEFAULT
      , "Given an invalid stack type the error message should be the default values"
    );
  }
)
