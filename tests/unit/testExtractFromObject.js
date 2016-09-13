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
var extractFromObject = require('../../lib/error-extractors/object.js');
var ErrorMessage = require('../../lib/classes/error-message.js');

test(
  'Test Object Extraction Message'
  , function ( t ) {

    var MESSAGE = "test";

    var em = new ErrorMessage();
    var err = { message: MESSAGE };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.message === MESSAGE
      , "Given a valid message the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.message === ""
      , "Given that the object does not have a message property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction User'
  , function ( t ) {

    var USER = "test";

    var em = new ErrorMessage();
    var err = { user: USER };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.user === USER
      , "Given a valid user the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.user === ""
      , "Given that the object does not have a user property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction filePath'
  , function ( t ) {

    var PATH = "test";

    var em = new ErrorMessage();
    var err = { filePath: PATH };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.filePath === PATH
      , "Given a valid filePath the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.filePath === ""
      , "Given that the object does not have a filePath property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction lineNumber'
  , function ( t ) {

    var LINE_NUMBER = 10;

    var em = new ErrorMessage();
    var err = { lineNumber: LINE_NUMBER };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.lineNumber === LINE_NUMBER
      , "Given a valid lineNumber the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.lineNumber === 0
      , "Given that the object does not have a lineNumber property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction functionName'
  , function ( t ) {

    var FUNCTION_NAME = "test";

    var em = new ErrorMessage();
    var err = { functionName: FUNCTION_NAME };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.functionName === FUNCTION_NAME
      , "Given a valid functionName the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.functionName === ""
      , "Given that the object does not have a functionName property the ErrorMessage will retain its default value"
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
    var err = { serviceContext: TEST_SERVICE_VALID };

    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_VALID
      , "Given a valid service context the value should be set on the error message"
    );

    em = new ErrorMessage();
    err = { serviceContext: TEST_SERVICE_INVALID };
    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given an invalid service context the error message should retain default values on service context"
    );

    em = new ErrorMessage();
    err = {}
    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given no service context the error message should retain default values on service context"
    );
  }
);
