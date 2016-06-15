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
var errorClassParsingUtils = require('../../lib/error-parsing-utils.js');
var CustomStackTrace = require('../../lib/classes/custom-stack-trace.js');

test(
  'Test error parsing utils formatting stack traces'
  , function ( t ) {

    // !! THIS IS VERY IMPORTANT !!
    Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;
    // FOR THESE TESTS TO SUCCEED YOU MUST OVERRIDE THE STACK
    // TRACE PREPARER LIKE IN THE ABOVE

    var TEST_MESSAGE = "This is a test.";
    var errorTest = new Error(TEST_MESSAGE);

    t.plan(8);

    t.assert(
      errorTest.message === TEST_MESSAGE
      , "The error should have the test message as its message property"
    );

    t.assert(
      ((typeof errorTest.stack) === 'object')
      , "The error's stack property should be of type string"
    );

    t.assert(
      ((typeof errorTest.stack.filePath) === 'string')
      , "error.stack.filePath should be of type string"
    );

    t.assert(
      ((typeof errorTest.stack.lineNumber) === 'number')
      , "error.stack.lineNumber should be of type number"
    );

    t.assert(
      ((typeof errorTest.stack.functionName) === 'string')
      , "error.stack.functionName should be of type string"
    );

    t.assert(
      ((typeof errorTest.stack.stringifyStucturedCallList) === 'function')
      , "The error's stringifyStucturedCallList property should be of type function"
    );

    t.assert(
      ((typeof errorTest.stack.stringifyStucturedCallList()) === 'string')
      , "stringifyStucturedCallList should return type string"
    );

    console.log("here is the call list", errorTest.stack.stringifyStucturedCallList())

    t.assert(
      JSON.parse(errorTest.stack.stringifyStucturedCallList())
      , "One should be able to parse the JSON string returned by stringifyStucturedCallList"
    );

    Error.prepareStackTrace = undefined;
  }
);

test(
  'Fuzzing the prepareStackTraceError function'
  , function ( t ) {

    var output = errorClassParsingUtils.prepareStackTraceError(null, null);
    var defaultReturn = new CustomStackTrace();
    t.deepEqual(
      output
      , defaultReturn
      , "Given an invalid value for structured stack trace the output should be an empty CustomStackTrace instance"
    );

    t.deepEqual(
      output.stringifyStucturedCallList()
      , JSON.stringify({error: "Unable to capture stack trace information"})
      , "Given an invalid input in prepareStackTrace error should return a valid JSON string that is an error"
    );

    output = errorClassParsingUtils.extractStructuredCallList(null)();
    t.deepEqual(
      output
      , "[]"
      , "Given an invalid input for extract structured call list will return an empty JSON array"
    );

    t.end();
  }
);
