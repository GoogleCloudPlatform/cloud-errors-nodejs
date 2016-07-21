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

'use strict';
var test = require('tape');
var configuration = require('../../lib/configuration.js');
var version = require('../../package.json').version;

test(
  'Giving an invalid configuration to the configuration function should throw',
  function (t) {

    t.throws(
      configuration.bind(null, 5),
      undefined,
      "Should throw an error when given a number"
    );

    t.throws(
      configuration.bind(null, "test"),
      undefined,
      "Should throw an error when given a string"
    );

    t.throws(
      configuration.bind(null, null),
      undefined,
      "Should throw an error when given null"
    );

    t.throws(
      configuration.bind(null, []),
      undefined,
      "Should throw an error when given an array"
    );

    t.throws(
      configuration.bind(null, true),
      undefined,
      "Should throw an error when given a boolean"
    );

    t.doesNotThrow(
      configuration.bind(null, {}),
      undefined,
      "Should not throw an error if given an object"
    );

    t.doesNotThrow(
      configuration,
      undefined,
      "Should not throw an error if given undefined"
    );

    t.end();
  }
);

test(
  'Testing how configuration creates a configuration object',
  function (t) {

    delete process.env.NODE_ENV;
    delete process.env.GCLOUD_PROJECT;
    t.deepEqual(
      configuration()
      , {projectId: null, reportUncaughtExceptions: true,
        serviceContext: {service: '', version: ''}, key: null, shouldReportErrorsToAPI: false, version: version}
      , "Given no configuration the return value should return a default value"
    );

    t.deepEqual(
      configuration({projectId: "a-project-id"})
      , {projectId: "a-project-id", reportUncaughtExceptions: true,
        serviceContext: {service: '', version: ''}, key: null, shouldReportErrorsToAPI: false, version: version}
      , "Given a valid project id the configuration the return value should assimilate this value"
    );

    t.deepEqual(
      configuration({projectId: "a-project-id", reportUncaughtExceptions: true})
      , {projectId: "a-project-id", reportUncaughtExceptions: true,
        serviceContext: {service: '', version: ''}, key: null, shouldReportErrorsToAPI: false, version: version}
      , "Given a valid project id and uncaught param the configuration the return value should assimilate these values"
    );

    t.deepEqual(
      configuration({projectId: "a-project-id", reportUncaughtExceptions: false, key: 'akey'})
      , {projectId: "a-project-id", reportUncaughtExceptions: false,
        serviceContext: {service: '', version: ''}, key: 'akey', shouldReportErrorsToAPI: false, version: version}
      , "Given a valid project id, uncaught param and a key the configuration the return value should assimilate these values"
    );

    process.env.GCLOUD_PROJECT = "another-project-id";
    t.deepEqual(
      configuration({projectId: "a-project-id", reportUncaughtExceptions: true, key: 'akey'})
      , {projectId: "another-project-id", reportUncaughtExceptions: true,
        serviceContext: {service: '', version: ''}, key: 'akey', shouldReportErrorsToAPI: false, version: version}
      , "Given a project id set as the env var GCLOUD_PROJECT this will not override the given configuration"
    );
    delete process.env.GCLOUD_PROJECT;

    process.env.NODE_ENV = 'production';
    t.deepEqual(
      configuration({projectId: "a-project-id", reportUncaughtExceptions: true, key: 'akey'})
      , {projectId: "a-project-id", reportUncaughtExceptions: true,
        serviceContext: {service: '', version: ''}, key: 'akey', shouldReportErrorsToAPI: true, version: version}
      , "Given that the NODE_ENV is set to production the returned configuration of shouldReportErrorsToAPI should be set to true"
    );
    delete process.env.NODE_ENV;

    process.env.GAE_MODULE_NAME = 'test_name';
    process.env.GAE_MODULE_VERSION = 'test_version';
    t.deepEqual(
      configuration()
      , {projectId: null, key: null, reportUncaughtExceptions: true, serviceContext: {service: 'test_name', version: 'test_version'}, shouldReportErrorsToAPI: false, version: version}
      , "Given that the GAE_MODULE_NAME and GAE_MODULE_VERSION env variables are set the returned configuration of serviceContext should reflect those values"
    );

    t.deepEqual(
      configuration({serviceContext: {service: 'another_name'}})
      , {projectId: null, key: null, reportUncaughtExceptions: true, serviceContext: {service: 'another_name', version: 'test_version'}, shouldReportErrorsToAPI: false, version: version}
      , "Given that the GAE_MODULE_NAME and GAE_MODULE_VERSION env variables are set but the service property is given in the configuration"
        +"the returned configuration of serviceContext should reflect those values"
    );

    t.deepEqual(
      configuration({serviceContext: {version: 'another_version'}})
      , {projectId: null, key: null, reportUncaughtExceptions: true, serviceContext: {service: 'test_name', version: 'another_version'}, shouldReportErrorsToAPI: false, version: version}
      , "Given that the GAE_MODULE_NAME and GAE_MODULE_VERSION env variables are set but the version property is given in the configuration"
        +"the returned configuration of serviceContext should reflect those values"
    );
    delete process.env.GAE_MODULE_NAME;
    delete process.env.GAE_MODULE_VERSION;

    t.deepEqual(
      configuration({serviceContext: {service: 'a_different_test_name', version: 'another_version'}})
      , {projectId: null, key: null, reportUncaughtExceptions: true, serviceContext: {service: 'a_different_test_name', version: 'another_version'}, shouldReportErrorsToAPI: false, version: version}
      , "Given that the serviceContext service and version are given in the object configuration these values should be reflected in the configuration output."
    );

    process.env.GCLOUD_PROJECT = "another-project-id";
    process.env.NODE_ENV = 'production';
    t.deepEqual(
      configuration({serviceContext: {service: 'a_different_test_name', version: 'another_version'}})
      , {projectId: 'another-project-id', key: null, reportUncaughtExceptions: true, serviceContext: {service: 'a_different_test_name', version: 'another_version'}, shouldReportErrorsToAPI: true, version: version}
      , "Given that the node env is set to production the shouldReportErrorToAPI property should be of type boolean and value true"
    );
    delete process.env.NODE_ENV;
    delete process.env.GCLOUD_PROJECT;

    t.end();
  }
);
