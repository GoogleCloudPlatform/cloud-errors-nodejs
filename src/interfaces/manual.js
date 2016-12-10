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
var ErrorMessage = require('../classes/error-message.js');
var manualRequestInformationExtractor =
    require('../request-extractors/manual.js');
var errorHandlerRouter = require('../error-router.js');

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
  /**
   * The interface for manually reporting errors to the Google Error API in
   * application code.
   * @param {Any} err - error information of any type or content. This can be
   *  of any type but better errors will be logged given a valid instance of
   *  Error class.
   * @param {Object} [request] - an object containing request information. This
   *  is expected to be an object similar to the Node/Express request object.
   * @param {String} [additionalMessage] - a string containing error message
   *  information to override the builtin message given by an Error/Exception
   * @param {Function} [callback] - a callback to be invoked once the message
   *  has been successfully submitted to the error reporting API or has failed
   *  after four attempts with the success or error response.
   * @returns {ErrorMessage} - returns the error message created through with
   * the parameters given.
   */
  function reportManualError(err, request, additionalMessage, callback) {
    if (isString(request)) {
      // no request given
      callback = additionalMessage;
      additionalMessage = request;
      request = undefined;
    } else if (isFunction(request)) {
      // neither request nor additionalMessage given
      callback = request;
      request = undefined;
      additionalMessage = undefined;
    }

    if (isFunction(additionalMessage)) {
      callback = additionalMessage;
      additionalMessage = undefined;
    }

    var em = new ErrorMessage();
    em.setServiceContext(config.getServiceContext().service,
                         config.getServiceContext().version);

    errorHandlerRouter(err, em);

    if (isObject(request)) {
      em.consumeRequestInformation(manualRequestInformationExtractor(request));
    }

    if (isString(additionalMessage)) {
      em.setMessage(additionalMessage);
    }

    client.sendError(em, callback);
    return em;
  }

  return reportManualError;
}

module.exports = handlerSetup;