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
var handleStringAsError = require('../../lib/error-handlers/string.js');
var errorClassParsingUtils = require('../../lib/error-parsing-utils.js');


test(
  'Given variable inputs and input-types in the handleStringAsError handler'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(7);

    t.doesNotThrow(
      handleStringAsError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, {}, em)
      , undefined
      , "Should not throw when given an object"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, [], em)
      , undefined
      , "Should not throw when given an array"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, new Error("test"), em)
      , undefined
      , "Should not throw when given an error"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, 1.3, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
