/**
 * Copyright 2014 Google Inc. All Rights Reserved.
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
var isObject = require('../typeCheckers/isObject.js');
var isString = require('../typeCheckers/isString.js');
var uncaughtHandlingOptions = require('../constants/uncaughtHandlingOptions.js');

/**
 * Attempts to extract the projectId from the environmental variable
 * `GCLOUD_PROJECT`. Will return null if the environmental variable is not of
 * type String.
 * @function attemptToExtractProjectIdFromEnv
 * @returns {String|Null} - will return the projectId if it is present in the
 *  environmental configuration or Null if it is not.
 */
function attemptToExtractProjectIdFromEnv ( ) {

  if ( isString(process.env.GCLOUD_PROJECT) ) {

    return process.env.GCLOUD_PROJECT;
  }

  console.log("WARNING: Unable to find project id in configuration or env");

  return null;
}

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
 * @function attemptToExtractServiceContextFromConfiguration
 * @param {ConfigurationOptions} initConfiguration - the init configuration
 * @returns {ServiceContextConfiguration} - The service context of the hosting
 *  application
 */
function attemptToExtractServiceContextFromConfiguration ( initConfiguration ) {

  var defaultReturnObject = {
    service: 'my-service'
    , version: 'alpha1'
  };

  if ( initConfiguration.hasOwnProperty('serviceContext')
    && isObject(initConfiguration.serviceContext)) {

    return Object.assign(
      defaultReturnObject
      , initConfiguration.serviceContext
    );
  }

  return defaultReturnObject;
}

/**
 * Attempts to determine whether or not a uncaught exception handling parameter
 * was given in the Object configuration and, if submitted, whether that
 * parameter is valid according to the uncaughtHandlingEnum. If the handling
 * parameter is either not given or is of an invalid value/type then the
 * then the function will return the ignore option by default.
 * @function attemptToExtractExceptionHandlingFromConfiguration
 * @param {ConfigurationOptions} initConfiguration - the init configuration
 * @return {uncaughtHandlingEnum} - one of the uncaughtHandlingEnum properties
 */
function attemptToExtractExceptionHandlingFromConfiguration ( initConfiguration ) {

  if ( initConfiguration.hasOwnProperty('onUncaughtException')
    && uncaughtHandlingOptions.hasOwnProperty(initConfiguration.onUncaughtException) ) {

    return initConfiguration.onUncaughtException;
  }

  return uncaughtHandlingOptions.ignore;
}

/**
 * Attempts to extract a projectId from the given configuration object,
 * otherwise execution will defer to attempting to extract the projectId from
 * the environment.
 * @function attemptToExtractProjectIdFromConfiguration
 * @param {ConfigurationOptions} initConfiguration - the init configuration
 * @returns {String|Null} - will return the projectId as a String if found,
 *  otherwise will return null
 */
function attemptToExtractProjectIdFromConfiguration ( initConfiguration ) {

  if ( initConfiguration.hasOwnProperty('projectId') ) {

    return initConfiguration.projectId;
  }

  return attemptToExtractProjectIdFromEnv();
}

/**
 * Returns a boolean indicating whether or not the `NODE_ENV` environmental
 * variable is set to the string "production".
 * @function determineReportingEnv
 * @returns {Boolean} - Returns true if `NODE_ENV` is set to "production"
 */
function determineReportingEnv ( ) {

  return process.env.NODE_ENV === "production";
}

/**
 * @typedef NormalizedConfigurationVariables
 * @type Object
 * @property {String} projectId - the project id of the hosting application
 * @property {uncaughtHandlingEnum} onUncaughtException - the flag denoting how
 *  to handle uncaught exceptions
 * @property {Object} serviceContext - the hosting applications service
 *  information
 * @property {String} serviceContext.service - the hosting applications service
 *  that it is running atop of
 * @property {String} serviceContext.version - the hosting applications version
 * @property {Boolean} shouldReportErrorsToAPI - a flag indicating whether or
 *  not the Middleware should send errors to the StackDriver Error Reporting
 *  API. This flag is derived from the `NODE_ENV` environmental varaible being
 *  set to production: if the flag is set to "production" then the
 *  `shouldReportErrorsToAPI` property will be set to true and the API client
 *  will attempt to send errors to the StackDriver Error Reporting API.
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
function gatherConfiguration ( initConfiguration ) {

  var projectId = null;
  var onUncaughtException = null;
  var serviceContext = null;
  var shouldReportErrorsToAPI = determineReportingEnv();

  if ( isObject( initConfiguration ) ) {

    projectId = attemptToExtractProjectIdFromConfiguration(initConfiguration);
    onUncaughtException = attemptToExtractExceptionHandlingFromConfiguration(initConfiguration);
    serviceContext = attemptToExtractServiceContextFromConfiguration(initConfiguration);
  } else {

    projectId = attemptToExtractProjectIdFromEnv();
    onUncaughtException = uncaughtHandlingOptions.ignore;
  }

  return {
    projectId: projectId
    , onUncaughtException: onUncaughtException
    , serviceContext: serviceContext
    , shouldReportErrorsToAPI: shouldReportErrorsToAPI
  };
}

module.exports = gatherConfiguration;
