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
var isString = lodash.isString;
var isObject = lodash.isObject;
var isFunction = lodash.isFunction;
var slice = lodash.slice;
var find = lodash.find;
var ErrorMessage = require('../classes/error-message.js');
var manualRequestInformationExtractor =
    require('../request-extractors/manual.js');
var errorHandlerRouter = require('../error-router.js');

/**
 * The interface for manually reporting errors to the Google Error API in
 * application code, this interface takes five arguments, three of which can
 * be supplied by application-code invocation and only one of which is required.
 * The first arugment `client` will be bound to an instance of this function so
 * that this handler can send error information back to Error Reporting API. The
 * second argument `err` is the actual error information that the application is
 * attempting to report. This data can be of any type, but better errors will be
 * logged given a valid instance of Error/Exception class, this is the only
 * required argument to be supplied during invocation. The third argument
 * `request` is a optional argument which, if supplied, will augment the error
 * message information with additional request information. This is expected to
 * be an object in similar form to the Express request object. The fourth
 * argument `additionalMessage` which is expected to be a string and may be
 * given to override the produced error messages message field if supplying
 * an Error Instance for `err` which already has a message which is not to
 * suited for reporting. The fifth and final argument `callback` may be supplied
 * so that the application code can be called-back to once the message has been
 * posited in the Error Reporting API.
 * @function reportManualError
 * @param {AuthClient} client - a bound reference to the API client
 * @param {NormalizedConfigurationVariables} config - the environmental
 *  configuration
 * @param {Any} err - error information of any type or content
 * @param {Object} [request] - an object containing request information
 * @param {String} [additionalMessage] - a string containing error message
 *  information to override the builtin message given by an Error/Exception
 * @param {Function} [callback] - a callback to be invoked once the message has
 *  been successfully submitted to the error reporting API or has failed after
 *  four attempts with the success or error response.
 * @returns {ErrorMessage} - returns the error message created through with the
 *  parameters given.
 */
function reportManualError(client, config, err, request, additionalMessage,
                           callback) {

  var em = new ErrorMessage();
  var optArgs = slice(arguments, 3);
  var cb = find(optArgs, isFunction);
  var am = find(optArgs, isString);
  var req =
      find(optArgs, function(o) { return isObject(o) && !isFunction(o); });

  em.setServiceContext(config.serviceContext.service,
                       config.serviceContext.version);

  errorHandlerRouter(err, em);

  if (isObject(req)) {

    em.consumeRequestInformation(manualRequestInformationExtractor(req));
  }

  if (isString(am)) {

    em.setMessage(am);
  }

  client.sendError(em, cb);

  return em;
}

/**
 * The handler setup function serves to produce a bound instance of the
 * reportManualError function with no bound context, a bound first arugment
 * which is intended to be an initialized instance of the API client and a bound
 * second argument which is the environmental configuration.
 * @function handlerSetup
 * @param {AuthClient} client - an initialized API client
 * @param {NormalizedConfigurationVariables} config - the environmental
 *  configuration
 * @returns {reportManualError} - a bound version of the reportManualError
 *  function
 */
function handlerSetup(client, config) {

  return reportManualError.bind(null, client, config);
}

module.exports = handlerSetup;
