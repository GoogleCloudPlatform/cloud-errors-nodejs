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
var omit = lodash.omit;
var merge = lodash.merge;
var manualRequestInformationExtractor = require('../../lib/request-extractors/manual.js');
var Fuzzer = require('../../utils/fuzzer.js');

test(
  'Test request information extraction given invalid input'
  , function ( t ) {

    var DEFAULT_RETURN_VALUE = {
      method: ""
      , url: ""
      , userAgent: ""
      , referrer: ""
      , statusCode: 0
      , remoteAddress: ""
    };

    var f = new Fuzzer();
    var cbFn = function ( value ) {

      t.deepEqual(
        value
        , DEFAULT_RETURN_VALUE
        , "Given invalid arguments the express information extractor should return the default object"
      );
    }

    f.fuzzFunctionForTypes(
      manualRequestInformationExtractor
      , ["object"]
      , cbFn
    );

    t.end();
  }
);

test(
  'Test request information extraction given valid input'
  , function ( t ) {

    var FULL_VALID_INPUT = {
      method: 'GET'
      , url: 'http://0.0.0.0/myTestRoute'
      , userAgent: 'Something like Gecko'
      , referrer: 'www.example.com'
      , statusCode: 500
      , remoteAddress: '0.0.0.1'
    };

    t.deepEqual(
      manualRequestInformationExtractor(FULL_VALID_INPUT)
      , FULL_VALID_INPUT
      , [
        "Given a full valid input object these values should be reflected by"
        , "the output of the request extraction"
      ].join(" ")
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "method"))
      , merge({}, FULL_VALID_INPUT, {method: ""})
      , [
        "Given a full valid input object sans the method property these values"
        , "should be reflected by the output of the request extraction"
      ].join(" ")
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "url"))
      , merge({}, FULL_VALID_INPUT, {url: ""})
      , [
        "Given a full valid input sans the url property these values should be"
        , "reflected by the output of the request extraction"
      ]
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "userAgent"))
      , merge({}, FULL_VALID_INPUT, {"userAgent": ""})
      , [
        "Given a full valid input sans the userAgent property these values"
        , "should be reflected by the output of the request extraction"
      ]
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "referrer"))
      , merge({}, FULL_VALID_INPUT, {referrer: ""})
      , [
        "Given a full valid input sans the referrer property these values"
        , "should be reflected by the output of the request extraction"
      ]
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "statusCode"))
      , merge({}, FULL_VALID_INPUT, {statusCode: 0})
      , [
        "Given a full valid input sans the statusCode property these values"
        , "should be reflected by the output of the request extraction"
      ]
    );

    t.deepEqual(
      manualRequestInformationExtractor(omit(FULL_VALID_INPUT, "remoteAddress"))
      , merge({}, FULL_VALID_INPUT, {remoteAddress: ""})
      , [
        "Given a full valid input sans the remoteAddress property these values"
        , "should be reflected by the output of the request extraction"
      ]
    );

    t.end();
  }
);
