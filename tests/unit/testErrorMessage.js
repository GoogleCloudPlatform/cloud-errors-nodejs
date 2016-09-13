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

test(
  'Testing the ErrorMessage custom prototype'
  , function ( t ) {

    var emp = ErrorMessage.prototype;

    t.plan(28);

    t.assert(
      emp.hasOwnProperty('setEventTimeToNow')
      , 'It should have a property named setEventTimeToNow'
    );

    t.assert(
      ((typeof emp.setEventTimeToNow) === 'function')
      , 'setEventTimeToNow should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setServiceContext')
      , 'It should have a property named setServiceContext'
    );

    t.assert(
      ((typeof emp.setServiceContext) === 'function')
      , 'setServiceContext should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setMessage')
      , 'It should have a property named setMessage'
    );

    t.assert(
      ((typeof emp.setMessage) === 'function')
      , 'setMessage should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setHttpMethod')
      , 'It should have a property named setHttpMethod'
    );

    t.assert(
      ((typeof emp.setHttpMethod) === 'function')
      , 'setHttpMethod should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setUrl')
      , 'It should have a property named setUrl'
    );

    t.assert(
      ((typeof emp.setUrl) === 'function')
      , 'setUrl should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setUserAgent')
      , 'It should have a property named setUserAgent'
    );

    t.assert(
      ((typeof emp.setUserAgent) === 'function')
      , 'setUserAgent should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setReferrer')
      , 'It should have a property named setReferrer'
    );

    t.assert(
      ((typeof emp.setReferrer) === 'function')
      , 'setReferrer should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setResponseStatusCode')
      , 'It should have a property named setResponseStatusCode'
    );

    t.assert(
      ((typeof emp.setResponseStatusCode) === 'function')
      , 'setResponseStatusCode should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setRemoteIp')
      , 'It should have a property named setRemoteIp'
    );

    t.assert(
      ((typeof emp.setRemoteIp) === 'function')
      , 'setRemoteIp should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setUser')
      , 'It should have a property named setUser'
    );

    t.assert(
      ((typeof emp.setUser) === 'function')
      , 'setUser should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setFilePath')
      , 'It should have a property named setFilePath'
    );

    t.assert(
      ((typeof emp.setFilePath) === 'function')
      , 'setFilePath should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setLineNumber')
      , 'It should have a property named setLineNumber'
    );

    t.assert(
      ((typeof emp.setLineNumber) === 'function')
      , 'setLineNumber should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('setFunctionName')
      , 'It should have a property named setFunctionName'
    );

    t.assert(
      ((typeof emp.setFunctionName) === 'function')
      , 'setFunctionName should be of type function'
    );

    t.assert(
      emp.hasOwnProperty('consumeRequestInformation')
      , 'It should have a property named consumeRequestInformation'
    );

    t.assert(
      ((typeof emp.consumeRequestInformation) === 'function')
      , 'consumeRequestInformation should be of type function'
    );
  }
)

test(
  'Instantiating a new ErrorMessage'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(19);

    t.assert(
      em.hasOwnProperty('eventTime')
      , 'It should have a property named event time'
    );

    t.assert(
      ((typeof em.eventTime) === 'string')
      , 'The event time property should be of type String'
    );

    t.assert(
      em.hasOwnProperty('serviceContext')
      , 'It should have a service context property'
    );

    t.assert(
      ((typeof em.serviceContext) === 'object')
      , 'The service context property should be of type object'
    );

    t.deepEqual(
      em.serviceContext
      , { service: "node", version: undefined }
      , [
          'The service context property should have two properties:'
          , 'service and version both with a string value of: default'
        ].join(" ")
    );

    t.assert(
      em.hasOwnProperty('message')
      , 'It should have a property named message'
    );

    t.assert(
      ((typeof em.message) === 'string')
      , 'The message property should be of type string'
    );

    t.assert(
      em.message === ""
      , "The message property should be inited to an empty string"
    );

    t.assert(
      em.hasOwnProperty('context')
      , 'It should have a property named context'
    );

    t.assert(
      ((typeof em.context) === 'object')
      , 'The context property should be of type object'
    );

    t.assert(
      em.context.hasOwnProperty('httpRequest')
      , 'The context property should have a property named httpRequest'
    );

    t.assert(
      ((typeof em.context.httpRequest) === 'object')
      , "The context.httpRequest property should be of type object"
    );

    t.deepEqual(
      em.context.httpRequest
      , {
        method: ""
        , url: ""
        , userAgent: ""
        , referrer: ""
        , responseStatusCode: 0
        , remoteIp: ""
      }
      , "The context.httpRequest property should be a properly inited object"
    );

    t.assert(
      em.context.hasOwnProperty('user')
      , 'The context property should have a property named user'
    );

    t.assert(
      ((typeof em.context.user) === 'string')
      , 'The context.user property should be of type string'
    );

    t.assert(
      em.context.user === ""
      , "The context.user property should be inited to an empty string"
    );

    t.assert(
      em.context.hasOwnProperty('reportLocation')
      , "The context property should have a property named reportLocation"
    );

    t.assert(
      ((typeof em.context.reportLocation) === 'object')
      , "The context.reportLocation should be of type object"
    );

    t.deepEqual(
      em.context.reportLocation
      , {
        filePath: ""
        , lineNumber: 0
        , functionName: ""
      }
      , "The context.report location property should a properly inited object"
    );
  }
);

test(
  'Calling against setEventTimeToNow'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(2);

    em.setEventTimeToNow();
    t.assert(
      ((typeof em.eventTime) === 'string')
      , "Calling setEventTimeToNow should set eventTime to a string"
    );

    t.assert(
      em.setEventTimeToNow() instanceof ErrorMessage
      , "Calling setEventTimeToNow should return the ErrorMessage instance"
    );
  }
)

test(
  'Fuzzing against setServiceContext'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var DEFAULT_TEST_VALUE = "DEFAULT";
    var DEFAULT_VERSION_VALUE = undefined;
    var DEFAULT_SERVICE_VALUE = "node";

    t.plan(10);

    em.setServiceContext(AFFIRMATIVE_TEST_VALUE, AFFIRMATIVE_TEST_VALUE);
    t.deepEqual(
      em.serviceContext
      , {
        service: AFFIRMATIVE_TEST_VALUE
        , version: AFFIRMATIVE_TEST_VALUE
      }
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setServiceContext(DEFAULT_TEST_VALUE, DEFAULT_TEST_VALUE);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_TEST_VALUE
        , version: DEFAULT_TEST_VALUE
      }
      , [
        "In resetting to default valid values the instance should reflect the"
        , "value update"
      ].join(" ")
    );

    em.setServiceContext(null, AFFIRMATIVE_TEST_VALUE);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: AFFIRMATIVE_TEST_VALUE
      }
      , [
        "Providing only a valid value to the second argument of"
        , "setServiceContext should set the service property as an empty string"
        , "but set the version property to the affirmative value."
      ].join(" ")
    );

    em.setServiceContext(AFFIRMATIVE_TEST_VALUE, null);
    t.deepEqual(
      em.serviceContext
      , {
        service: AFFIRMATIVE_TEST_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , [
        "Providing only a valid value to the first argument of"
        , "setServiceContext should set the version property as an empty string"
        , "but set the service property to the affirmative value."
      ].join(" ")
    );

    em.setServiceContext(null, null);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , [
        "Providing null as the value to both arguments should set both"
        , "properties as empty strings."
      ].join(" ")
    );

    em.setServiceContext(2, 1.3);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , [
        "Providing numbers as the value to both arguments should set both"
        , "properties as empty strings."
      ].join(" ")
    );

    em.setServiceContext(1.3, 2);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , [
        "Providing numbers as the value to both arguments should set both"
        , "properties as empty strings."
      ].join(" ")
    );

    em.setServiceContext({ test: "true" }, []);
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , [
        "Providing arrays or objects as the value to both arguments"
        , "should set both properties as empty strings."
      ].join(" ")
    );

    em.setServiceContext();
    t.deepEqual(
      em.serviceContext
      , {
        service: DEFAULT_SERVICE_VALUE
        , version: DEFAULT_VERSION_VALUE
      }
      , "Providing no arguments should set both properties as empty strings"
    );

    t.assert(
      em.setServiceContext() instanceof ErrorMessage
      , "Calling set service context should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setMessage'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setMessage(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.message === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setMessage();
    t.assert(
      em.message === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setMessage the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setMessage(1.2);
    t.assert(
      em.message === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setMessage the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setMessage(null);
    t.assert(
      em.message === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setMessage the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setMessage({});
    t.assert(
      em.message === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setMessage the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setMessage([]);
    t.assert(
      em.message === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setMessage the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setMessage() instanceof ErrorMessage
      , "Calling setMessage should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setHttpMethod'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setHttpMethod(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.method === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setHttpMethod();
    t.assert(
      em.context.httpRequest.method === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setHttpMethod the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setHttpMethod(1.2);
    t.assert(
      em.context.httpRequest.method === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setHttpMethod the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setHttpMethod(null);
    t.assert(
      em.context.httpRequest.method === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setHttpMethod the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setHttpMethod({});
    t.assert(
      em.context.httpRequest.method === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setHttpMethod the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setHttpMethod([]);
    t.assert(
      em.context.httpRequest.method === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setHttpMethod the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setHttpMethod() instanceof ErrorMessage
      , "Calling setHttpMethod should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setUrl'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setUrl(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.url === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setUrl();
    t.assert(
      em.context.httpRequest.url === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setUrl the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUrl(1.2);
    t.assert(
      em.context.httpRequest.url === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setUrl the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUrl(null);
    t.assert(
      em.context.httpRequest.url === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setUrl the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUrl({});
    t.assert(
      em.context.httpRequest.url === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setUrl the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUrl([]);
    t.assert(
      em.context.httpRequest.url === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setUrl the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setUrl() instanceof ErrorMessage
      , "Calling setUrl should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setUserAgent'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setUserAgent(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.userAgent === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setUserAgent();
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setUserAgent the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUserAgent(1.2);
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setUserAgent the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUserAgent(null);
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setUserAgent the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUserAgent({});
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setUserAgent the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUserAgent([]);
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setUserAgent the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setUserAgent() instanceof ErrorMessage
      , "Calling setUserAgent should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setReferrer'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setReferrer(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.referrer === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setReferrer();
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setReferrer the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setReferrer(1.2);
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setReferrer the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setReferrer(null);
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setReferrer the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setReferrer({});
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setReferrer the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setReferrer([]);
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setReferrer the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setReferrer() instanceof ErrorMessage
      , "Calling setReferrer should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setResponseStatusCode'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = 200;
    var NEGATIVE_TEST_VALUE = 0;

    t.plan(7);

    em.setResponseStatusCode(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.responseStatusCode === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setResponseStatusCode();
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setResponseStatusCode the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setResponseStatusCode("500");
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setResponseStatusCode the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setResponseStatusCode(null);
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setResponseStatusCode the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setResponseStatusCode({});
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setResponseStatusCode the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setResponseStatusCode([]);
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setResponseStatusCode the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setResponseStatusCode() instanceof ErrorMessage
      , "Calling setResponseStatusCode should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setRemoteIp'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setRemoteIp(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.remoteIp === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setRemoteIp();
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setRemoteIp the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setRemoteIp(1.2);
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setRemoteIp the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setRemoteIp(null);
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setRemoteIp the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setRemoteIp({});
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setRemoteIp the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setRemoteIp([]);
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setRemoteIp the property"
        , "message should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setRemoteIp() instanceof ErrorMessage
      , "Calling setRemoteIp should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setUser'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setUser(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.user === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setUser();
    t.assert(
      em.context.user === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setUser the property"
        , "user should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUser(1.2);
    t.assert(
      em.context.user === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setUser the property"
        , "user should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUser(null);
    t.assert(
      em.context.user === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setUser the property"
        , "user should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUser({});
    t.assert(
      em.context.user === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setUser the property"
        , "user should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setUser([]);
    t.assert(
      em.context.user === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setUser the property"
        , "user should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setUser() instanceof ErrorMessage
      , "Calling setUser should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setFilePath'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setFilePath(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.reportLocation.filePath === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setFilePath();
    t.assert(
      em.context.reportLocation.filePath === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setFilePath the property"
        , "filePath should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFilePath(1.2);
    t.assert(
      em.context.reportLocation.filePath === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setFilePath the property"
        , "filePath should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFilePath(null);
    t.assert(
      em.context.reportLocation.filePath === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setFilePath the property"
        , "filePath should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFilePath({});
    t.assert(
      em.context.reportLocation.filePath === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setFilePath the property"
        , "filePath should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFilePath([]);
    t.assert(
      em.context.reportLocation.filePath === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setFilePath the property"
        , "filePath should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setFilePath() instanceof ErrorMessage
      , "Calling setFilePath should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setLineNumber'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = 27;
    var NEGATIVE_TEST_VALUE = 0;

    t.plan(7);

    em.setLineNumber(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.reportLocation.lineNumber === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setLineNumber();
    t.assert(
      em.context.reportLocation.lineNumber === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setLineNumber the property"
        , "lineNumber should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setLineNumber("290");
    t.assert(
      em.context.reportLocation.lineNumber === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setLineNumber the property"
        , "lineNumber should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setLineNumber(null);
    t.assert(
      em.context.reportLocation.lineNumber === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setLineNumber the property"
        , "lineNumber should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setLineNumber({});
    t.assert(
      em.context.reportLocation.lineNumber === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setLineNumber the property"
        , "lineNumber should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setLineNumber([]);
    t.assert(
      em.context.reportLocation.lineNumber === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setLineNumber the property"
        , "lineNumber should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setLineNumber() instanceof ErrorMessage
      , "Calling setLineNumber should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against setFunctionName'
  , function ( t ) {

    var em = new ErrorMessage();
    var AFFIRMATIVE_TEST_VALUE = "VALID_INPUT_AND_TYPE";
    var NEGATIVE_TEST_VALUE = "";

    t.plan(7);

    em.setFunctionName(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.reportLocation.functionName === AFFIRMATIVE_TEST_VALUE
      , [
        "In the affirmative case the value should be settable to a valid string"
        , "and by setting this value this should mutate the instance"
      ].join(" ")
    );

    em.setFunctionName();
    t.assert(
      em.context.reportLocation.functionName === NEGATIVE_TEST_VALUE
      , [
        "By providing no argument (undefined) to setFunctionName the property"
        , "functionName should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFunctionName(1.2);
    t.assert(
      em.context.reportLocation.functionName === NEGATIVE_TEST_VALUE
      , [
        "By providing a number to setFunctionName the property"
        , "functionName should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFunctionName(null);
    t.assert(
      em.context.reportLocation.functionName === NEGATIVE_TEST_VALUE
      , [
        "By providing null to setFunctionName the property"
        , "functionName should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFunctionName({});
    t.assert(
      em.context.reportLocation.functionName === NEGATIVE_TEST_VALUE
      , [
        "By providing an object to setFunctionName the property"
        , "functionName should be set to an empty string on the instance"
      ].join(" ")
    );

    em.setFunctionName([]);
    t.assert(
      em.context.reportLocation.functionName === NEGATIVE_TEST_VALUE
      , [
        "By providing an array to setFunctionName the property"
        , "functionName should be set to an empty string on the instance"
      ].join(" ")
    );

    t.assert(
      em.setFunctionName() instanceof ErrorMessage
      , "Calling setFunctionName should return the ErrorMessage instance"
    );
  }
);

test(
  'Fuzzing against consumeRequestInformation'
  , function ( t ) {

    var em = new ErrorMessage();

    var A_VALID_STRING = "A_VALID_STRING";
    var A_VALID_NUMBER = 201;
    var NEGATIVE_STRING_CASE = "";
    var NEGATIVE_NUMBER_CASE = 0;

    var AFFIRMATIVE_TEST_VALUE = {
      method: A_VALID_STRING
      , url: A_VALID_STRING
      , userAgent: A_VALID_STRING
      , referrer: A_VALID_STRING
      , statusCode: A_VALID_NUMBER
      , remoteAddress: A_VALID_STRING
    };
    var NEGATIVE_TEST_VALUE = {
      method: null
      , url: A_VALID_NUMBER
      , userAgent: {}
      , referrer: []
      , statusCode: A_VALID_STRING
      , remoteAddress: undefined
    };

    t.plan(20);

    em.consumeRequestInformation(AFFIRMATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.method === A_VALID_STRING
      , [
        "The error messages method, given a valid string, should be"
        , "set to that value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.url === A_VALID_STRING
      , [
        "The error messages url, given a valid string, should be"
        , "set to that value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.userAgent === A_VALID_STRING
      , [
        "The error messages userAgent, given a valid string, should be"
        , "set to that value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.referrer === A_VALID_STRING
      , [
        "The error messages referrer, given a valid string, should be"
        , "set to that value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.responseStatusCode === A_VALID_NUMBER
      , [
        "The error messages responseStatusCode, given a valid number, should be"
        , "set to that value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.remoteIp === A_VALID_STRING
      , [
        "The error messages remoteAddress, given a valid string, should be"
        , "set to that value"
      ].join(" ")
    );

    em.consumeRequestInformation(null);
    t.assert(
      em.context.httpRequest.method === A_VALID_STRING
      , [
        "The error messages method, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.url === A_VALID_STRING
      , [
        "The error messages url, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.userAgent === A_VALID_STRING
      , [
        "The error messages userAgent, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.referrer === A_VALID_STRING
      , [
        "The error messages referrer, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.responseStatusCode === A_VALID_NUMBER
      , [
        "The error messages responseStatusCode, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.remoteIp === A_VALID_STRING
      , [
        "The error messages remoteAddress, given an invalid type a the top-level"
        , "should remain untouched"
      ].join(" ")
    );

    em.consumeRequestInformation(NEGATIVE_TEST_VALUE);
    t.assert(
      em.context.httpRequest.method === NEGATIVE_STRING_CASE
      , [
        "The error messages method, given an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.url === NEGATIVE_STRING_CASE
      , [
        "The error messages url, given an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.userAgent === NEGATIVE_STRING_CASE
      , [
        "The error messages userAgent, ggiven an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.referrer === NEGATIVE_STRING_CASE
      , [
        "The error messages referrer, given an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.responseStatusCode === NEGATIVE_NUMBER_CASE
      , [
        "The error messages responseStatusCode, given an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );
    t.assert(
      em.context.httpRequest.remoteIp === NEGATIVE_STRING_CASE
      , [
        "The error messages remoteAddress, given an invalid input should default to"
        , "the negative value"
      ].join(" ")
    );

    t.assert(
      em.consumeRequestInformation(AFFIRMATIVE_TEST_VALUE) instanceof ErrorMessage
      , [
          "Calling consumeRequestInformation with valid input should return"
          , "the ErrorMessage instance"
        ].join(" ")
    );

    t.assert(
      em.consumeRequestInformation() instanceof ErrorMessage
      , [
          "Calling consumeRequestInformation with invalid input should return"
          , "the ErrorMessage instance"
        ].join(" ")
    );
  }
);
