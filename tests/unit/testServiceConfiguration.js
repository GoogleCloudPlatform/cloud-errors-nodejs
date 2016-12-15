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
var level = process.env.GCLOUD_ERRORS_LOGLEVEL;
var logger = require('../../src/logger.js')({
  logLevel: isNumber(level) ? level : 4
});

function makeTest(serviceName, serviceVersion,
                  moduleName, moduleVersion,
                  functionName, testFunction) {
  return function(t) {
    // store the old environment
    var oldServiceName = process.env.GAE_SERVICE || '';
    var oldServiceVersion = process.env.GAE_VERSION || '';

    var oldModuleName = process.env.GAE_MODULE_NAME || '';
    var oldModuleVersion = process.env.GAE_MODULE_VERSION || '';

    var oldFunctionName = process.env.FUNCTION_NAME || '';

    var updateEnv = function(key, value) {
      if (lodash.isNull(value)) {
        delete process.env[key];
        return;
      }

      process.env[key] = value;
    };

    // setup the new environment
    updateEnv('GAE_SERVICE', serviceName);
    updateEnv('GAE_VERSION', serviceVersion);

    updateEnv('GAE_MODULE_NAME', moduleName);
    updateEnv('GAE_MODULE_VERSION', moduleVersion);

    updateEnv('FUNCTION_NAME', functionName);

    // run the function
    return testFunction(t, function() {
      process.env.GAE_SERVICE = oldServiceName;
      process.env.GAE_VERSION = oldServiceVersion;

      process.env.GAE_MODULE_NAME = oldModuleName;
      process.env.GAE_MODULE_VERSION = oldModuleVersion;

      process.env.FUNCTION_NAME = oldFunctionName;

      t.end();
    });
  };
}

test(
  'A Configuration uses the function name as the service name on GCF ' + 
  'if the service name is not given in the given config',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           'someFunction',
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someFunction');
      // FUNCTION_NAME is set and the user didn't specify a version, and so 
      // the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the function name as the service name on GCF ' +
  'if the service name is not given in the given config ' +
  'even if the GAE_SERVICE was not set',
  makeTest(null, '1.0',
           null, 'InvalidVersion',
          'someFunction',
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someFunction');
      // The user didn't specify a version and FUNCTION_NAME is defined, and 
      // so the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the GAE_SERVICE env value as the service name ' +
  'if the FUNCTION_NAME env variable is not set and the given config ' +
  'does not specify the service name',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someModuleName');
      // The user didn't specify a version, and FUNCTION_NAME is not defined, 
      // and so use the GAE_MODULE_VERSION
      t.deepEqual(c.getServiceContext().version, '1.0');

      end();
  })
);

test(
  'A Configuration uses the service name in the given config if it ' +
  'was specified and both the GAE_SERVICE and FUNCTION_NAME ' +
  'env vars are set',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version, but FUNCTION_NAME is defined, and 
      // so the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and both the GAE_SERVICE and FUNCTION_NAME ' +
  'env vars are set',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'A Configuration uses the service name in the given config if it ' +
  'was specified and only the GAE_SERVICE env var is set',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version and FUNCTION_NAME is not defined 
      // and so the GAE_MODULE_VERSION should be used
      t.deepEqual(c.getServiceContext().version, '1.0');

      end();
  })
);

test(
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and only the GAE_SERVICE env var is set',
  makeTest('someModuleName', '1.0',
           'InvalidName', 'InvalidVersion',
           null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'A Configuration uses the service name in the given config if it ' +
  'was specified and only the FUNCTION_NAME env var is set',
  makeTest(null, '1.0',
           null, 'InvalidVersion',
           'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version and thus because FUNCTION_NAME is 
      // defined the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and only the FUNCTION_NAME env var is set',
  makeTest(null, '1.0',
           null, 'InvalidVersion',
           'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'A Configuration uses the service name "node" and no version if ' +
  'GAE_SERVICE is not set, FUNCTION_NAME is not set, and the user has '+
  'not specified a service name or version',
  makeTest(null, null,
           null, null,
           null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the service name "node" and no version if ' +
  'GAE_SERVICE is not set, FUNCTION_NAME is not set, and the user has '+
  'not specified a service name or version even if GAE_VERSION has ' +
  'been set',
  makeTest(null, 'InvalidVersion',
           null, 'InvalidVersion',
           null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'A Configuration uses the service name "node" and the user specified ' +
  'version if GAE_SERVICE is not set, FUNCTION_NAME is not set, and the ' +
  'user has not specified a service name but has specified a version',
  makeTest(null, null,
           null, null,
           null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'A Configuration uses the service name "node" and the user specified ' +
  'version if GAE_SERVICE is not set, FUNCTION_NAME is not set, and the ' +
  'user has not specified a service name but has specified a version even ' +
  'if GAE_VERSION has been set',
  makeTest(null, 'InvalidVersion',
           null, 'InvalidVersion',
           null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

// The following tests always have GAE_SERVICE and GAE_VERSION not set
test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the function name as the service name on GCF ' + 
  'if the service name is not given in the given config',
  makeTest(null, null, 'someModuleName', '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someFunction');
      // FUNCTION_NAME is set and the user didn't specify a version, and so 
      // the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the function name as the service name on GCF ' +
  'if the service name is not given in the given config ' +
  'even if the GAE_MODULE_NAME was not set',
  makeTest(null, null, null, '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someFunction');
      // The user didn't specify a version and FUNCTION_NAME is defined, and 
      // so the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the GAE_MODULE_NAME env value as the service name ' +
  'if the FUNCTION_NAME env variable is not set and the given config ' +
  'does not specify the service name',
  makeTest(null, null, 'someModuleName', '1.0', null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'someModuleName');
      // The user didn't specify a version, and FUNCTION_NAME is not defined, 
      // and so use the GAE_MODULE_VERSION
      t.deepEqual(c.getServiceContext().version, '1.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name in the given config if it ' +
  'was specified and both the GAE_MODULE_NAME and FUNCTION_NAME ' +
  'env vars are set',
  makeTest(null, null, 'someModuleName', '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version, but FUNCTION_NAME is defined, and 
      // so the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and both the GAE_MODULE_NAME and FUNCTION_NAME ' +
  'env vars are set',
  makeTest(null, null, 'someModuleName', '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name in the given config if it ' +
  'was specified and only the GAE_MODULE_NAME env var is set',
  makeTest(null, null, 'someModuleName', '1.0', null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version and FUNCTION_NAME is not defined 
      // and so the GAE_MODULE_VERSION should be used
      t.deepEqual(c.getServiceContext().version, '1.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and only the GAE_MODULE_NAME env var is set',
  makeTest(null, null, 'someModuleName', '1.0', null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name in the given config if it ' +
  'was specified and only the FUNCTION_NAME env var is set',
  makeTest(null, null, null, '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user didn't specify a version and thus because FUNCTION_NAME is 
      // defined the version should not be defined
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name and version in the given config if ' +
  'they were both specified and only the FUNCTION_NAME env var is set',
  makeTest(null, null, null, '1.0', 'someFunction',
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          service: 'customService',
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'customService');
      // The user specified version should be used
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name "node" and no version if ' +
  'GAE_MODULE_NAME is not set, FUNCTION_NAME is not set, and the user has '+
  'not specified a service name or version',
  makeTest(null, null, null, null, null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name "node" and no version if ' +
  'GAE_MODULE_NAME is not set, FUNCTION_NAME is not set, and the user has '+
  'not specified a service name or version even if GAE_MODULE_VERSION has ' +
  'been set',
  makeTest(null, null, null, '1.0', null,
    function(t, end) {
      var c = new Configuration({}, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, undefined);

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name "node" and the user specified ' +
  'version if GAE_MODULE_NAME is not set, FUNCTION_NAME is not set, and the ' +
  'user has not specified a service name but has specified a version',
  makeTest(null, null, null, null, null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);

test(
  'With GAE_SERVICE and GAE_VERSION not set: ' +
  'A Configuration uses the service name "node" and the user specified ' +
  'version if GAE_MODULE_NAME is not set, FUNCTION_NAME is not set, and the ' +
  'user has not specified a service name but has specified a version even ' +
  'if GAE_MODULE_VERSION has been set',
  makeTest(null, null, null, '1.0', null,
    function(t, end) {
      var c = new Configuration({
        serviceContext: {
          version: '2.0'
        }
      }, logger);
      t.deepEqual(c.getServiceContext().service, 'node');
      t.deepEqual(c.getServiceContext().version, '2.0');

      end();
  })
);
