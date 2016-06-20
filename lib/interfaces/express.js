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
var isFunction = lodash.isFunction;
var isObject = lodash.isObject;
var isPlainObject = lodash.isPlainObject;
var ErrorMessage = require('../classes/error-message.js');
var expressRequestInformationExtractor =
    require('../request-extractors/express.js');
var errorHandlerRouter = require('../error-router.js');

/**
 * The Express Error Handler function is an interface for the error handler
 * stack into the Express architecture. This function accepts four arguments:
 * a bound reference to a client which should be given by the proceeding
 * handlerSetup function, an error argument which can be of any type, an
 * express request object, an express response object and the express next
 * function for passing input up the plugin chain.
 * @function expressErrorHandler
 * @param {AuthClient} client - a bound and inited Auth Client instance
 * @param {NormalizedConfigurationVariables} config - the environmental
 *  configuration
 * @param {Any} err - a error of some type propagated by the express plugin
 *  stack
 * @param {Object} req - an Express request object
 * @param {Object} res - an Express response object
 * @param {Function} next - an Express continuation callback
 * @returns {ErrorMessage} - Returns the ErrorMessage instance
 */
function expressErrorHandler(client, config, err, req, res, next) {
  var ctxService = '';
  var ctxVersion = '';

  if (isPlainObject(config) && isPlainObject(config.serviceContext)) {

    ctxService = config.serviceContext.service;
    ctxVersion = config.serviceContext.version;
  }

  var em = new ErrorMessage()
               .consumeRequestInformation(
                   expressRequestInformationExtractor(req, res))
               .setServiceContext(ctxService, ctxVersion);

  errorHandlerRouter(err, em);

  if (isObject(client) && isFunction(client.sendError)) {
    client.sendError(em);
  }

  if (isFunction(next)) {
    next(err);
  }

  return em;
}

/**
 * The handler setup function simply provides a bound reference to the express
 * error handler function with the first argument as a bound reference to an
 * inited API client for sending information back to the Google Error Reporting
 * API and the second argument as the gathered environmental configuration.
 * @function handlerSetup
 * @param {AuthClient} client - an inited Auth Client instance
 * @param {NormalizedConfigurationVariables} config  - the environmental
 *  configuration
 * @returns {expressErrorHandler} - a bound instance of the handler function
 *  with no bound context but one bound argument which is the client instance.
 */
function handlerSetup(client, config) {

  return expressErrorHandler.bind(null, client, config);
}

module.exports = handlerSetup;
