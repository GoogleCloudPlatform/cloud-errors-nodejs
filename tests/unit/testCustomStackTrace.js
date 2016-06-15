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
var CustomStackTrace = require('../../lib/classes/custom-stack-trace.js');
test(
  'Fuzzing the CustomStackTrace class'
  , function ( t ) {

    var cs = new CustomStackTrace();
    var testFunction = function testFunction ( ) {

      return "";
    }

    cs.setFilePath("test");
    t.assert(
      cs.filePath === "test"
      , "Setting a valid string on the CustomStackTrace.filePath instance should result in assignment"
    );

    cs.setFilePath(null);
    t.assert(
      cs.filePath === ""
      , "Setting an invalid type on the CustomStackTrace.filePath instance should result in default value of an empty string"
    );

    cs.setLineNumber(10);
    t.assert(
      cs.lineNumber === 10
      , "Setting a valid number on the CustomStackTrace.lineNumber instance should result in assignment"
    );

    cs.setLineNumber("10");
    t.assert(
      cs.lineNumber === 0
      , "Setting an invalid type on the CustomStackTrace.lineNumber instance should result in default value of number 0"
    );

    cs.setFunctionName("test");
    t.assert(
      cs.functionName === "test"
      , "Setting a valid function name on the CustomStackTrace. functionName instance should result in assignment"
    );

    cs.setFunctionName(10);
    t.assert(
      cs.functionName === ""
      , "Setting an invalid function name on the CustomStackTrace. functionName instance should result in default value of an empty string"
    );

    cs.setStringifyStructuredCallList(testFunction);
    t.deepEqual(
      cs.stringifyStucturedCallList
      , testFunction
      , "Setting a valid function on the CustomStackTrace. setStringifyStructuredCallList should result in assignment"
    );

    cs.setStringifyStructuredCallList(null);
    t.assert(
      ((typeof cs.setStringifyStructuredCallList) === "function")
      , "Setting an invalid setStringifyStructuredCallList on the CustomStackTrace. setStringifyStructuredCallList should result in a default value of a function"
    );

    t.end();
  }
);
