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
var handleErrorClassError = require('../../lib/error-handlers/error.js');
var errorClassParsingUtils = require('../../lib/error-parsing-utils.js');


test(
  'Given variable inputs and input-types in the handleErrorClassError handler'
  , function ( t ) {

    var adversarialObjectInput = {
      stack: {}
    };
    var adversarialObjectInputTwo = {
      stack: []
    };

    var em = new ErrorMessage();

    t.plan(8);

    t.doesNotThrow(
      handleErrorClassError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a string"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, 1.2, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, [], em)
      , undefined
      , "Should not throw when given an array"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, adversarialObjectInput, em)
      , undefined
      , "Should not throw when given a masquerading object"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, adversarialObjectInputTwo, em)
      , undefined
      , "Should not throw when given a masquerading array"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, new Error("Test"), em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
