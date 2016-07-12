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
var uncaughtHandlingOptions = require('../uncaught-handling-options.js');
var errorHandlerRouter = require('../error-router.js');
var ErrorMessage = require('../classes/error-message.js');

/**
 * Exits the process with exit code `1` which indicates that an unhandled error
 * occurred. !! Invocation of this function will terminate the process !!
 * @function handleProcessExit
 * @return {Undefined} - does not return a value
 */
function handleProcessExit() { process.exit(1); }

/**
 * The actual exception handler creates a new instance of `ErrorMessage`,
 * extracts infomation from the propagated `Error` and marshals it into the
 * `ErrorMessage` instance, attempts to send this `ErrorMessage` instance to the
 * Stackdriver Error Reporting API and, if given `reportAndExit` as the uncaught
 * exception handling procedure, will attempt to exit the process by calling the
 * function `handleProcessExit`.
 * @function uncaughtExceptionHandler
 * @listens module:process~event:uncaughtException
 * @param {AuthClient} client - the API client for communicating with the
 *  Stackdriver Error API
 * @param {NormalizedConfigurationVariables} config - the init configuration
 * @param {Error} err - The error that has been uncaught to this point
 * @returns {Undefined} - does not return a value
 */
function uncaughtExceptionHandler(client, config, err) {
  var em = new ErrorMessage();

  errorHandlerRouter(err, em);

  if (config.onUncaughtException === uncaughtHandlingOptions.report) {

    client.sendError(em);
  } else if (config.onUncaughtException ===
             uncaughtHandlingOptions.reportAndExit) {

    client.sendError(em, handleProcessExit);
  }
}

/**
 * This function serves only to attach the `uncaughtExceptionHandler` function
 * to the `uncaughtException` event on the process and should only be called if
 * the configuration does not specify `ignore` as the uncaught exception
 * handling procedure. This function will bind the `client` and `config`
 * arguments to the exception handler so that the handler can determine if it
 * should exit after receiving an uncaught exception. See the uncaughtException
 * event for [more information.]
 * {@link https://nodejs.org/api/process.html#process_event_uncaughtexception}
 * @function attachUncaughtExceptionHandler
 * @param {AuthClient} client - the API client for communicating with the
 *  Stackdriver Error API
 * @param {NormalizedConfigurationVariables} config - the init configuration
 * @returns {process} - returns the process instance
 */
function attachUncaughtExceptionHandler(client, config) {

  return process.on('uncaughtException',
                    uncaughtExceptionHandler.bind(null, client, config));
}

/**
 * The uncaught exception handler setup function will attempt to read the given
 * configuration and determine if the handler has been asked to attach to the
 * `uncaughtException` event on the process. If told to ignore uncaught
 * exceptions then the handler will return early with a value of Null. If the
 * configuration indicates either `report` or `reportAndExit` as its handling
 * values then the handler will attach the `uncaughtExceptionHandler` function
 * as a callback to the `uncaughtException` event on the process.
 * @function handlerSetup
 * @param {AuthClient} client - the API client for communication with the
 *  Stackdriver Error API
 * @param {NormalizedConfigurationVariables} config - the init configuration
 * @returns {Null|process} - Returns null if the config demands ignoring
 * uncaught
 *  exceptions, otherwise return the process instance
 */
function handlerSetup(client, config) {

  if (config.onUncaughtException === uncaughtHandlingOptions.ignore) {
    // Do not attach a listener to the process
    return null;
  }

  return attachUncaughtExceptionHandler(client, config);
}

module.exports = handlerSetup;
