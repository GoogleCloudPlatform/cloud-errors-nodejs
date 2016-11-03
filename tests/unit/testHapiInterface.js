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

var lodash = require('lodash');
var isFunction = lodash.isFunction;
var isPlainObject = lodash.isPlainObject;
var has = lodash.has;
var test = require('tape');
var hapiInterface = require('../../lib/interfaces/hapi.js');
var ErrorMessage = require('../../lib/classes/error-message.js');
var Fuzzer = require('../../utils/fuzzer.js');
var EventEmitter = require('events').EventEmitter;
var Configuration = require('../fixtures/configuration.js');

test(
  "Given invalid, variable input the hapi interface handler setup should not throw errors"
  , function ( t ) {

    var f = new Fuzzer();

    t.doesNotThrow(
      function ( ) {

        f.fuzzFunctionForTypes(
          hapiInterface
          , ["object", "object"]
        );

        return ;
      }
      , undefined
      , "The express interface handler setup should not throw when given invalid types"
    );

    t.end();
  }
);

test(
  [
    "Given valid input, the handler setup function should return a object with"
    , "one property"
  ].join(" ")
  , function ( t ) {

    var givenConfig = {getVersion: function () {return '1';}};
    var plugin = hapiInterface(null, givenConfig);

    t.assert(
      isPlainObject(plugin)
      , "The plugin should be a lodash `plain object`"
    );

    t.assert(
      has(plugin, "register")
      , "The plugin object should have a register property"
    );

    t.assert(
      isFunction(plugin.register)
      , "The register property should be of type function"
    );

    t.assert(
      has(plugin.register, "attributes")
      , "The register function property should have a property called attributes"
    );

    t.assert(
      isPlainObject(plugin.register.attributes)
      , "The attributes property should be a lodash `plain object`"
    );

    t.assert(
      has(plugin.register.attributes, "name")
      , "The attributes object property should have a name property"
    );

    t.assert(
      plugin.register.attributes.name === "@google/cloud-errors"
      , "The name property should be of type string and the same value as `@google/cloud-errors`"
    );

    t.assert(
      has(plugin.register.attributes, "version")
      , "The attributes object property should have a version property"
    );

    t.end();
  }
);

test(
  [
    "Given a fake server the hapiRegisterFunction should call the clientSend"
    , "error function and create an errorMessage"
  ].join(" ")
  , function ( t ) {

      var fakeServer = new EventEmitter();
      var fakeClient = {
        sendError: function ( errMsg ) {

          t.assert(
            errMsg instanceof ErrorMessage
            , "The value given to sendError should be an instance of Error message"
          );
          t.pass("The sendError function should be called on emission of request-error");
        }
      };

      var plugin = hapiInterface(fakeClient, null);

      plugin.register(fakeServer, null, null, null);

      fakeServer.emit('request-error');

      fakseServer = new EventEmitter();
      fakeServer.ext = fakeServer.on;
      fakeClient.sendError = function ( errMsg ) {

        t.assert(
          errMsg instanceof ErrorMessage
          , "The value given to sendError should be an instance of Error message"
        );
        t.assert(
          errMsg.serviceContext.service === testConfig._serviceContext.service
          , "The errMsg service value and the test config service value should match"
        );
        t.assert(
          errMsg.serviceContext.version === testConfig._serviceContext.version
          , "The errMsg version value and the test config service value should match"
        );
        t.pass("The sendError function should be emitted when the onPreResponse event is emitted");
      };

      var testConfig = new Configuration({serviceContext: { service: "1", version: "2"  }});
      plugin = hapiInterface(fakeClient, testConfig);

      plugin.register(fakeServer, null, function ( errMsg ) {

        t.pass("Next should be called");
      });

      fakeServer.emit('onPreResponse', {response: { isBoom: true }},
        {
          continue: function () {

            t.pass("The continue function should be called");
          }
        }
      );

      fakeServer.emit("onPreResponse");
      t.pass("The onPreResponse function should not throw given invalid input");

      t.doesNotThrow(
        plugin.register
        , undefined
        , "The register function should not throw if given invalid arguments"
      );

      t.doesNotThrow(
        plugin.register.bind(null, {})
        , undefined
        , "The register function should not throw if given an invalid server object"
      );

      t.end();
  }
);
