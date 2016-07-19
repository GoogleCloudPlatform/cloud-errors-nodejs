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
var commonDiag = require('@google/cloud-diagnostics-common');
var lodash = require('lodash');
var isFunction = lodash.isFunction;
var isString = lodash.isString;

/**
 * The RequestHandler constructor initializes several properties on the
 * RequestHandler instance and create a new request factory for requesting
 * against the Error Reporting API. 
 * @param {String} projectId - the project id of the application
 * @param {Boolean} shouldReportErrors - whether or not the client should
 *  attempt to post errors to the API
 * @param {String|Null} [key] - the API key used to authenticate against the
 *  service in place of default application credentials
 * @class AuthClient
 * @classdesc The RequestHandler class provides a centralized way of managing a
 * pool of ongoing requests and routing there callback execution to the right
 * handlers. The RequestHandler relies on the diag-common request factory
 * and therefore only manages the routing of execution to the proper callback
 * and does not do any queueing/batching. The RequestHandler instance has
 * several properties: the projectId property is used to create a correct url 
 * for interacting with the API and key property can be optionally provided a 
 * value which can be used in place of default application authentication. The 
 * shouldReportErrors property will dictate whether or not the handler instance 
 * will attempt to send payloads to the API. If it is false the handler will
 * immediately call back to the completion callback with a constant error value.
 * @property {Function} _requestFactory - a authorized request instance that
 *  provides the transport layer for requesting against the Error Reporting API
 * @property {String} _projectId - the project id used to uniquely identify and
 *  address the correct project in the Error Reporting API
 */
function RequestHandler(projectId, shouldReportErrors, key) {
  
  this._requestFactory = commonDiag.utils.authorizedRequestFactory([
    'https://www.googleapis.com/auth/cloud-platform'
  ]);
  this._projectId = projectId;
  this._shouldReportErrors = shouldReportErrors;
  this._url = [
    'https://clouderrorreporting.googleapis.com/v1beta1/projects',
    this._projectId, 'events:report'
  ].join('/');

  if (isString(key)) {
    this._url += [ '?key', key ].join('=');
  }
}

/**
 * Creates a request options object given the value of the error message and
 * will callback to the user supplied callback if given one. If a callback is
 * not given then the request will execute and silently dissipate.
 * @function sendError
 * @param {ErrorMessage} payload - the ErrorMessage instance to JSON.stringify
 *  for submission to the service
 * @param {RequestHandler~requestCallback} [userCb] - function called when the
 *  request has succeeded or failed.
 * @returns {Undefined} - does not return anything
 */
RequestHandler.prototype.sendError = function(errorMessage, userCb) {

  var cb = isFunction(userCb) ? userCb : function () { return; };

  if (!this._shouldReportErrors) {

    cb(new Error([
        'Client has not been configured to send errors, please check the',
        'NODE_ENV enviorment variable and make sure it is set to production'
      ].join(' ')), null, null);

    return;
  }

  this._requestFactory(
    {
      url : this._url,
      method : 'POST',
      json : errorMessage
    },
    cb
  );
};

/**
 * The requestCallback callback function is called on completion of an API
 * request whether that completion is success or failure. The request can either
 * fail by reaching the max number of retries or encountering an unrecoverable
 * response from the API. The first parameter to any invocation of the
 * requestCallback function type will be the applicable error if one was
 * generated during the request-response transaction. If an error was not
 * generated during the transaction then the first parameter will be of type 
 * Null. The second parameter is the entire response from the transaction, this
 * is an object that as well as containing the body of the response from the
 * transaction will also include transaction information. The third parameter is
 * the body of the response, this can be an object, a string or any type given
 * by the response object.
 * @callback RequestHandler~requestCallback cb - The function that will be
 *  invoked once the transaction has completed
 * @param {Error|Null} err - The error, if applicable, generated during the
 *  transaction
 * @param {Object|Undefined|Null} response - The response, if applicable, received 
 *  during the transaction
 * @param {Any} body - The response body if applicable
 */

module.exports = RequestHandler;
