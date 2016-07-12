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
var lodash = require('lodash');
var isArray = lodash.isArray;
var isObject = lodash.isObject;
var isString = lodash.isString;
var isNumber = lodash.isNumber;
var isUndefined = lodash.isUndefined;
var has = lodash.has;
var uncaughtHandlingOptions = require('./uncaught-handling-options.js');
var env = process.env;
var version = require('../package.json').version;

/**
 * @typedef ServiceContextConfiguration
 * @type Object
 * @property {String} service - the hosting applications underlying service
 *  platform
 * @property {String} version - the hosting applications version
 */

/**
 * Attempts to determine whether or not a service context parameter was given
 * by the Object configuration. If it is and it is of the correct type then
 * it will be merged with the default service context where the given
 * configuration will overwrite all shared properties on the default return
 * value.
 * @function extractServiceContext
 * @param {ConfigurationOptions} initConfiguration - the init configuration
 * @returns {ServiceContextConfiguration} - The service context of the hosting
 *  application
 */
function extractServiceContext(initConfiguration) {

  var gaeModuleName = env.GAE_MODULE_NAME;
  var gaeModuleVersion = env.GAE_MODULE_VERSION;

  var defaultReturnObject = {
    service : isString(gaeModuleName) ? gaeModuleName : '',
    version : isString(gaeModuleVersion) ? gaeModuleVersion : ''
  };

  if (has(initConfiguration, 'serviceContext') &&
      isObject(initConfiguration.serviceContext)) {

    if (has(initConfiguration.serviceContext, 'service')) {

      defaultReturnObject.service = initConfiguration.serviceContext.service;
    }

    if (has(initConfiguration.serviceContext, 'version')) {

      defaultReturnObject.version = initConfiguration.serviceContext.version;
    }
  }

  return defaultReturnObject;
}

/**
 * @typedef NormalizedConfigurationVariables
 * @type Object
 * @property {String} projectId - the project id of the hosting application
 * @property {uncaughtHandlingEnum}
 *  onUncaughtException=uncaughtHandlingEnum.ignore - the flag denoting how to
 *  handle uncaught exceptions
 * @property {Object} serviceContext - the hosting applications service
 *  information
 * @property {String} serviceContext.service - the hosting applications service
 *  that it is running atop of
 * @property {String} serviceContext.version - the hosting applications version
 * @property {String} key - an API key used to communicate with the service
 * @property {String} version - the version of the module
 * @property {Boolean} shouldReportErrorsToAPI - a flag indicating whether or
 *  not the Middleware should send errors to the Stackdriver Error Reporting
 *  API. This flag is derived from the `NODE_ENV` environmental varaible being
 *  set to production: if the flag is set to 'production' then the
 *  `shouldReportErrorsToAPI` property will be set to true and the API client
 *  will attempt to send errors to the Stackdriver Error Reporting API.
 */

/**
 * Orchestrates the gathering of configuration based on submission of the
 * initConfiguration parameter. If all optional properties are given in the
 * initConfiguration parameter then the only environmental variable that will
 * be read is the NODE_ENV variable. If initConfiguration is not supplied or
 * only partially supplied then gatherConfiguration will attempt to read
 * environmental variables to supplement information as necessary.
 * @function gatherConfiguration
 * @param {ConfigurationOptions} initConfiguration - the options object
 * @returns {NormalizedConfigurationVariables} - a configuration object
 *  supplemented with environmental information as necessary
 */
function gatherConfiguration(initConfiguration) {

  var projectId = null;
  var onUncaughtException = uncaughtHandlingOptions.ignore;
  var serviceContext = null;
  var key = null;
  var shouldReportErrorsToAPI = false;

  if (env.NODE_ENV === 'production') {

    shouldReportErrorsToAPI = true;
  } else {

    console.log([
      'Warning: the NODE_ENV environmental variable is not set to',
      '\'production\'. To send errors to the Stackdriver Error Reporting API',
      'please set the NODE_ENV to \'production\'.'
    ].join(' '));
  }

  if (isObject(initConfiguration) && !isArray(initConfiguration)) {

    if (has(initConfiguration, 'projectId')) {

      projectId = initConfiguration.projectId;
    }

    if (has(initConfiguration, 'onUncaughtException') &&
        has(uncaughtHandlingOptions, initConfiguration.onUncaughtException)) {

      onUncaughtException = initConfiguration.onUncaughtException;
    }

    if (has(initConfiguration, 'key')) {

      key = initConfiguration.key;
    }
  } else if (!isUndefined(initConfiguration)) {

    throw new Error(
        'An invalid configuration was given to the Stackdriver Error Library');
  }

  serviceContext = extractServiceContext(initConfiguration);

  if (isString(env.GCLOUD_PROJECT) || isNumber(env.GCLOUD_PROJECT)) {

    projectId = env.GCLOUD_PROJECT;
  }

  return {
    projectId : projectId,
    onUncaughtException : onUncaughtException,
    serviceContext : serviceContext,
    shouldReportErrorsToAPI : shouldReportErrorsToAPI,
    key : key,
    version : version
  };
}

module.exports = gatherConfiguration;
