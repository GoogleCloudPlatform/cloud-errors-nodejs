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
var ErrorMessage = require('../../lib/classes/error-message.js');
var handleObjectAsError = require('../../lib/error-handlers/object.js');
var errorClassParsingUtils = require('../../lib/error-parsing-utils.js');


test(
  'Given variable inputs and input-types in the handleObjectAsError handler'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(6);

    t.doesNotThrow(
      handleObjectAsError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleObjectAsError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleObjectAsError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a string"
    );

    t.doesNotThrow(
      handleObjectAsError.bind(null, new Error("test"), em)
      , undefined
      , "Should not throw when given an error"
    );

    t.doesNotThrow(
      handleObjectAsError.bind(null, 1.3, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleObjectAsError.bind(null, {}, em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
