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
var koaRequestInformationExtractor = require('../../lib/request-extractors/koa.js');
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
      koaRequestInformationExtractor
      , ["object", "object"]
      , cbFn
    );

    t.end();
  }
);

test(
  'Test request information extraction given valid input'
  , function ( t ) {

    var FULL_REQ_DERIVATION_VALUE = {
      method: "STUB_METHOD"
      , url: "www.TEST-URL.com"
      , headers: {
        'user-agent': "Something like Mozilla"
        , referrer: "www.ANOTHER-TEST.com"
      }
      , ip: "0.0.0.0"
    };
    var FULL_RES_DERIVATION_VALUE = {
      'status': 200
    };

    var FULL_REQ_EXPECTED_VALUE = {
      method: "STUB_METHOD"
      , url: "www.TEST-URL.com"
      , userAgent: "Something like Mozilla"
      , referrer: "www.ANOTHER-TEST.com"
      , remoteAddress: '0.0.0.0'
      , statusCode: 200
    }

    t.plan(1);

    t.deepEqual(
      koaRequestInformationExtractor(FULL_REQ_DERIVATION_VALUE, FULL_RES_DERIVATION_VALUE)
      , FULL_REQ_EXPECTED_VALUE
      , [
        "Given a valid payload for the request and response objects the output value"
        , "Should assimilate these values to resemble the expected output"
      ].join(" ")
    );
  }
)
