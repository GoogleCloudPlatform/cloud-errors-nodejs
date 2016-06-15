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
var RequestInformationContainer = require('../../lib/classes/request-information-container.js');
var Fuzzer = require('../../utils/fuzzer.js');

test(
  'Checking the RequestInformationContainer prototype after instantiation'
  , function ( t ) {

    var ric = new RequestInformationContainer();

    t.deepEqual(
      (typeof ric.setUrl)
      , 'function'
      , "setUrl should be of type function"
    );

    t.deepEqual(
      (typeof ric.setMethod)
      , 'function'
      , 'setMethod should be of type function'
    );

    t.deepEqual(
      (typeof ric.setReferrer)
      , 'function'
      , 'setReferrer should be of type function'
    );

    t.deepEqual(
      (typeof ric.setUserAgent)
      , 'function'
      , 'setUserAgent should be of type function'
    );

    t.deepEqual(
      (typeof ric.setRemoteAddress)
      , 'function'
      , 'setRemoteAddress should be of type function'
    );

    t.deepEqual(
      (typeof ric.setStatusCode)
      , 'function'
      , 'setStatusCode should be of type function'
    );

    t.end();
  }
);

test(
  'Fuzzing against the RequestInformationContainer setter functions for negative cases'
  , function ( t ) {

    var ric = new RequestInformationContainer();
    var f = new Fuzzer();

    var cbFn = function ( returnValue ) {

      t.deepEqual(
        ric.url
        , ""
        , "Given an invalid input the RequestInformationContainer.url property should be assigned as an empty string"
      );
    }
    f.fuzzFunctionForTypes(ric.setUrl, ["string"], cbFn, ric);

    cbFn = function ( returnValue ) {
      t.deepEqual(
        ric.method
        , ""
        , "Given an invalid input the RequestInformationContainer.method property should be assigned as an empty string"
      );
    }
    f.fuzzFunctionForTypes(ric.setMethod, ["string"], cbFn, ric);

    cbFn = function ( returnValue ) {
      t.deepEqual(
        ric.referrer
        , ""
        , "Given an invalid input the RequestInformationContainer.referrer property should be assigned as an empty string"
      );
    }
    f.fuzzFunctionForTypes(ric.setReferrer, ["string"], cbFn, ric);

    cbFn = function ( returnValue ) {
      t.deepEqual(
        ric.userAgent
        , ""
        , "Given an invalid input the RequestInformationContainer.userAgent property should be assigned as an empty string"
      );
    }
    f.fuzzFunctionForTypes(ric.setUserAgent, ["string"], cbFn, ric);

    cbFn = function ( returnValue ) {
      t.deepEqual(
        ric.remoteAddress
        , ""
        , "Given an invalid input the RequestInformationContainer.remoteAddress property should be assigned as an empty string"
      );
    }
    f.fuzzFunctionForTypes(ric.setRemoteAddress, ["string"], cbFn, ric);

    cbFn = function ( returnValue ) {
      t.deepEqual(
        ric.statusCode
        , 0
        , "Given an invalid input the RequestInformationContainer.statusCode property should be assigned as the number 0"
      );
    }
    f.fuzzFunctionForTypes(ric.setStatusCode, ["number"], cbFn, ric);

    t.end();
  }
);

test(
  'Fuzzing against the RequestInformationContainer for affirmative cases'
  , function ( t ) {

    var VALID_STRING_INPUT = "valid";
    var VALID_NUMBER_INPUT = 500;
    var ric = new RequestInformationContainer();

    ric.setUrl(VALID_STRING_INPUT);
    t.deepEqual(
      ric.url
      , VALID_STRING_INPUT
      , "Given a valid input RequestInformationContainer.url property should be assigned that value"
    );

    ric = new RequestInformationContainer();
    ric.setMethod(VALID_STRING_INPUT);
    t.deepEqual(
      ric.method
      , VALID_STRING_INPUT
      , "Given a valid input RequestInformationContainer.method property should be assigned that value"
    );

    ric = new RequestInformationContainer();
    ric.setReferrer(VALID_STRING_INPUT);
    t.deepEqual(
      ric.referrer
      , VALID_STRING_INPUT
      , "Given a valid input RequestInformationContainer.referrer property should be assigned that value"
    );

    ric = new RequestInformationContainer();
    ric.setUserAgent(VALID_STRING_INPUT);
    t.deepEqual(
      ric.userAgent
      , VALID_STRING_INPUT
      , "Given a valid input RequestInformationContainer.userAgent property should be assigned that value"
    );

    ric = new RequestInformationContainer();
    ric.setRemoteAddress(VALID_STRING_INPUT);
    t.deepEqual(
      ric.remoteAddress
      , VALID_STRING_INPUT
      , "Given a valid input RequestInformationContainer.remoteAddress property should be assigned that value"
    );

    ric = new RequestInformationContainer();
    ric.setStatusCode(VALID_NUMBER_INPUT);
    t.deepEqual(
      ric.statusCode
      , VALID_NUMBER_INPUT
      , "Given a valid input RequestInformationContainer.statusCode property should be assigned that value"
    );

    t.end();
  }
);
