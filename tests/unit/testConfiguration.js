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
var lodash = require('lodash');
var isNumber = lodash.isNumber;
var Configuration = require('../fixtures/configuration.js');
var version = require('../../package.json').version;
var Fuzzer = require('../../utils/fuzzer.js');
var level = process.env.GCLOUD_DEBUG_LOGLEVEL;
var logger = require('../../lib/logger.js')({
  logLevel: isNumber(level) ? level : 4
});
var nock = require('nock');
var METADATA_URL = 'http://metadata.google.internal/computeMetadata/v1/project';

test(
  'Initing an instance of Configuration should return a Configuration instance',
  function (t) {
    var c;
    var f = new Fuzzer();
    var stubConfig = {test: true};
    var oldEnv = process.env.NODE_ENV;
    var oldProject = process.env.GCLOUD_PROJECT;
    t.deepEqual(typeof Configuration, 'function');
    f.fuzzFunctionForTypes(
      function (givenConfigFuzz) {
        c = new Configuration(givenConfigFuzz, logger);
        t.deepEqual(c._givenConfiguration, {}, 
          "The _givenConfiguration property should remain null if given "+
          "invalid input"
        );
      },
      ["object"]
    );
    process.env.NODE_ENV = 'development';
    delete process.env.GCLOUD_PROJECT;
    t.doesNotThrow(function () { 
      c = new Configuration(stubConfig, logger); 
    });
    t.deepEqual(c._givenConfiguration, stubConfig, 
      "Given a valid configuration the instance should assign it as the value "+
      "to the _givenConfiguration property"
    );
    t.deepEqual(c._reportUncaughtExceptions, true);
    t.deepEqual(c.getReportUncaughtExceptions(), true);
    t.deepEqual(c._shouldReportErrorsToAPI, false, 
      "_shouldReportErrorsToAPI should init to false if env !== production "+
      "and the force flag is not set tot true");
    t.deepEqual(c.getShouldReportErrorsToAPI(), false);
    t.deepEqual(c._projectId, null);
    t.deepEqual(c._key, null);
    t.deepEqual(c.getKey(), null);
    t.deepEqual(c._serviceContext, {service: '', version: ''});
    t.deepEqual(c.getServiceContext(), {service: '', version: ''});
    t.deepEqual(c._version, version);
    t.deepEqual(c.getVersion(), version);
    stubConfig.ignoreEnvironmentCheck = true;
    c = new Configuration(stubConfig, logger);
    t.deepEqual(c.getShouldReportErrorsToAPI(), true, 
      'ignoreEnvironmentCheck flag should set the report errors to api flag '+
      'true even if env is not set production');
    delete stubConfig.ignoreEnvironmentCheck;
    c = new Configuration(stubConfig, logger);
    c.getProjectId(function (err, id) {
      t.assert(err instanceof Error);
      t.deepEqual(id, null);
      process.env.NODE_ENV = 'production';
      c = new Configuration(undefined, logger);
      t.deepEqual(c._shouldReportErrorsToAPI, true, 
        "_shouldReportErrorsToAPI should init to true if env === production");
      t.deepEqual(c.getShouldReportErrorsToAPI(), true);
      process.env.NODE_ENV = oldEnv;
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
    t.throws(c.getProjectId, undefined, 'Should throw not given a callback parameter');
    t.throws(function () { new Configuration({reportUncaughtExceptions: 1}, logger) },
      'Should throw when not given a boolean for reportUncaughtExceptions');
    t.throws(function () { new Configuration({key: null}, logger) },
      'Should throw when not given a string for reportUncaughtExceptions');
    t.throws(function () { new Configuration({serviceContext: {service: false}}, logger) },
      'Should throw when not given a string for serviceContext.service');  
    t.throws(function () { new Configuration({serviceContext: {version: true}}, logger) },
      'Should throw when not given a string for serviceContext.version');
    t.throws(function () {new Configuration({ignoreEnvironmentCheck: null}, logger)},
      'Should throw if given an invalid type for ignoreEnvironmentCheck')
    t.doesNotThrow(function () { new Configuration({serviceContext: {}}, logger) },
      'Should not throw when given an empty object');
  }
);

test(
  'Testing basic init process on a Configuration instance',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    var c = new Configuration(undefined, logger);
    c.getProjectId(function (err, id) {
      t.assert(err instanceof Error);
      t.deepEqual(id, null, 'The returned value for project number should be null');
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project number',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var projectNumber = 1234;
    var c = new Configuration({projectId: projectNumber}, logger);
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    c.getProjectId(function (err, id) {
      t.deepEqual(err, null);
      t.deepEqual(id, projectNumber.toString());
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project number when invalid - should throw',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var projectNumber = null;
    var c = new Configuration({projectId: projectNumber}, logger);
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    c.getProjectId(function (err, id) {
      t.assert(err instanceof Error);
      t.deepEqual(id, null);
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project number as string',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var projectNumber = '1234';
    var c = new Configuration({projectId: projectNumber}, logger);
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    c.getProjectId(function (err, id) {
      t.deepEqual(null, err);
      t.deepEqual(id, projectNumber);
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing basic init behaviours',
  function (t) {
    var c = new Configuration(undefined, logger);
    var pn = '123';
    var pi = 'test';
    c._projectId = pi;
    c._checkLocalProjectId(function (err, id) {
      t.deepEqual(err, null);
      t.deepEqual(pi, id);
    });
    t.deepEqual(c._projectId, pi,
      'The project id should not be reset by _checkLocalProjectId');
    c.getProjectId(function (err, id) {
      t.deepEqual(null, err);
      t.deepEqual(id, pi,
        'The project pi should not be reset by _checkLocalProjectNumber');
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project number in env variable',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    var projectNumber = '1234';
    process.env.GCLOUD_PROJECT = projectNumber;
    var c = new Configuration(undefined, logger);
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    c.getProjectId(function (err, id) {
      t.deepEqual(null, err);
      t.deepEqual(id, projectNumber);
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project id',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var projectId = 'test-123';
    var c = new Configuration({projectId: projectId}, logger);
    var s = nock(METADATA_URL).get('/project-id').times(1).reply(500);
    c.getProjectId(function (err, id) {
      t.deepEqual(err, null);
      t.deepEqual(id, projectId);
      s.done();
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for project id in env variable',
  function (t) {
    var projectId = 'test-123';
    var oldProject = process.env.GCLOUD_PROJECT;
    process.env.GCLOUD_PROJECT = projectId;
    var c = new Configuration(undefined, logger);
    c.getProjectId(function (err, id) {
      t.deepEqual(err, null);
      t.deepEqual(id, projectId);
      process.env.GCLOUD_PROJECT = oldProject;
      t.end();
    });
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for service context',
  function (t) {
    var oldProject = process.env.GCLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    var projectId = 'test-123';
    var serv = {service: 'test', version: '1.2.x'};
    var c = new Configuration({projectId: projectId, serviceContext: serv},
      logger);
    t.deepEqual(c.getServiceContext(), serv);
    process.env.GCLOUD_PROJECT = oldProject;
    t.end();
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for service context in env variable',
  function (t) {
    var projectId = 'test-123';
    var name = 'test';
    var ver = 'test2';
    var oldProject = process.env.GCLOUD_PROJECT;
    process.env.GCLOUD_PROJECT = projectId;
    process.env.GAE_MODULE_NAME = name;
    process.env.GAE_MODULE_VERSION = ver;
    var c = new Configuration(undefined, logger);
    t.deepEqual(c.getServiceContext(), {service: name, version: ver});
    delete process.env.GCLOUD_PROJECT;
    delete process.env.GAE_MODULE_VERSION;
    process.env.GCLOUD_PROJECT = oldProject;
    t.end();
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for key',
  function (t) {
    var projectId = 'test-123';
    var key = '1337';
    var c = new Configuration({key: key, projectId: projectId}, logger);
    t.deepEqual(c.getKey(), key);
    t.end();
  }
);

test(
  'Testing local value assignment in init process on a Configuration instance '+
  'for reportUncaughtExceptions',
  function (t) {
    var projectId = 'test-123';
    var key = '1337';
    var c = new Configuration({reportUncaughtExceptions: false, 
      projectId: projectId}, logger);
    t.deepEqual(c.getReportUncaughtExceptions(), false);
    t.end();
  }
);

test(
  'Testing service value assignment in init process on a configuration ' +
  'instance with number as id',
  function (t) {
    var id = '1234';
    var s = nock(METADATA_URL).get('/project-id').times(1)
      .reply(200, id);
    var c = new Configuration(undefined, logger);
    c.getProjectId(function (err, num) {
      t.deepEqual(err, null);
      t.deepEqual(num, id);
      t.end();
    });
  }
);

test(
  'Testing service value assignment in init process on a configuration ' +
  'instance with string as id',
  function (t) {
    var projectId = 'test-project-id';
    var s = nock(METADATA_URL).get('/project-id').times(1)
      .reply(200, projectId);
    var c = new Configuration(undefined, logger);
    c.getProjectId(function (err, id) {
      t.deepEqual(err, null);
      t.deepEqual(id, projectId);
      t.end();
    });
  }
);
