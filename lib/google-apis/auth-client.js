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
var isString = lodash.isString;
var GoogleAuth = require('google-auth-library');
var RetryTracker = require('../classes/retry-tracker.js');

/**
 * The AuthClient constructor intializes several properties on the AuthClient
 * instance, creates a new GoogleAuth authorization factory to facilitate
 * communication with the Google error reporting API and then initializes the
 * GoogleAuth client.
 * @param {String} projectId - the project id of the application
 * @param {Boolean} shouldReportErrors - whether or not the client should
 *  attempt to post errors to the API, optioanl -- used for simple API key
 *  authentication
 * @param {String} key - the API key to use to authenticate against the service
 * @class AuthClient
 * @classdesc The AuthClient class provides an abstraction layer for posting
 *  errors to the Google Error Reporting API. The AuthClient class interfaces
 *  with the RetryTracker class to provide automatic request-retry, queueing and
 *  exponential retry backoff.
 * @property {GoogleAuthClient} _authClient - an authorized GoogleAuth client
 *  instance
 * @property {Boolean} _hasInited - Indicator denoting whether or not the
 *  underlying GoogleAuth client has been authorized and is ready to interact
 *  with the service
 * @property {Boolean} _isRequesting - Indicator denoting whether or not the
 *  client is currently making a request against the service
 * @property {Array} _requestQueue - The pending request queue, requests that
 *  will be executed against the service
 * @property {GoogleAuth} _authFactory - The GoogleAuth factory for creating
 *  authorized clients
 * @property {String} _key - An optional key used for simple authentication
 * @property {String} _projectId - The project Id used to request against the
 *  service
 * @property {Boolean} _shouldReportErrors - Indicator denoting whether or not
 *  the client should actually attempt requests against the service
 */
function AuthClient(projectId, shouldReportErrors, key) {

  this._authClient = null;
  this._hasInited = false;
  this._isRequesting = false;
  this._requestQueue = [];
  this._authFactory = new GoogleAuth();

  this._key = isString(key) ? key : null;
  this._projectId = projectId;
  this._shouldReportErrors = shouldReportErrors;

  this._getApplicationDefaultCredentials();
}

/**
 * Intializes the GoogleAuth client using the default application,
 * credentials method and authorizes it against the service and
 * creates scoped credentials, if necessary, for the client.
 * @function _getApplicationDefaultCredentials
 * @returns {Undefined} - does not return a value
 */
AuthClient.prototype._getApplicationDefaultCredentials = function() {
  var self = this;

  this._authFactory.getApplicationDefault(function(err, authClient) {
    var scopes = [ 'https://www.googleapis.com/auth/cloud-platform' ];

    if (err) {

      return;
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {

      self._authClient = authClient.createScoped(scopes);
    } else {

      self._authClient = authClient;
    }

    self._hasInited = true;
  });
};

/**
 * Used for temporary interfacing with the Gated Error Creation URL. Will
 * be removed in favor of default auth when the API goes live. Creates the
 * url to create errors in the error API.
 * @function _generateErrorCreationUrl
 * @returns {String} - the url to create errors for the error reporting API
 */
AuthClient.prototype._generateErrorCreationUrl = function() {
  var returnValue = [
    'https://clouderrorreporting.googleapis.com/v1beta1/projects',
    this._projectId, 'events:report'
  ].join('/');

  if (isString(this._key)) {

    returnValue += [ '?key', this._key ].join('=');
  }

  return returnValue;
};

/**
 * Creates the options object for posting erros against the error creation API
 * @function _generateErrorCreationRequestOptions
 * @param {ErrorMessage} payload - the ErrorMessage instance to JSON.stringify
 * for submission
 *  to the service
 * @returns {Object} - The options object for the requesting client
 */
AuthClient.prototype._generateErrorCreationRequestOptions = function(payload) {

  return {
    url : this._generateErrorCreationUrl(),
    method : 'POST',
    json : payload
  };
};

/**
 * Attempts to pull the next request off the queue and execute it. This could be
 * an already previously made request that is being retried or an entirely new
 * request. This function will check for the existence of a request in the queue
 * before attempting to execute that request against the service. If a request
 * is successfully made or has failed the max number of times this function will
 * affect the requestQueue by shifting the first entry off the queue and then
 * attempting to a catalyze the next request by calling the `_queueNextRequest`
 * function.
 * @function _makeRequest
 * @returns {Undefined} - does not return a value
 */
AuthClient.prototype._makeRequest = function() {

  var self = this;
  var requestPayloadSlot = [];
  var thisRequestsPayload = {};
  var thisRequestsCallback = null;
  var thisRequestsRetryTracker = {};
  var thisRequestsOptions = {};

  if (!this._areRequestsStillInQueue()) {
    this._isRequesting = false;

    return;
  }

  requestPayloadSlot = this._requestQueue[0];
  thisRequestsPayload = requestPayloadSlot[0];
  thisRequestsCallback = requestPayloadSlot[1];
  thisRequestsRetryTracker = requestPayloadSlot[2];
  thisRequestsOptions =
      this._generateErrorCreationRequestOptions(thisRequestsPayload);

  this._authClient.request(thisRequestsOptions, function(err, result) {

    thisRequestsRetryTracker.increaseRetryCount();

    if (err && thisRequestsRetryTracker.shouldRetry()) {
      thisRequestsRetryTracker.notifyOfWhenToRetry(
          self._makeRequest.bind(self));
    } else {

      self._isRequesting = false;
      self._requestQueue.shift();
      self._queueNextRequest();

      if (isFunction(thisRequestsCallback)) {

        if (err) {

          thisRequestsCallback(err, null);
        } else {

          thisRequestsCallback(null, result);
        }
      }
    }
  });
};

/**
 * Checks the length of the `_requestQueue` property on the instance, indicating
 * whether or not another request or set of requests is still pending execution.
 * @function _areRequestsStillInQueue
 * @returns {Number} - the length of the `_requestQueue` property
 */
AuthClient.prototype._areRequestsStillInQueue = function() {

  return this._requestQueue.length > 0;
};

/**
 * Creates a timeout to wait for AuthClient init and calls back to the
 * queueNextRequest function to reattempt queueing the next request.
 * @function _pauseForClientInitialization
 * @returns {Undefined} does not return a value
 */
AuthClient.prototype._pauseForClientInitialization = function() {

  setTimeout(this._queueNextRequest.bind(this), 1500);
};

/**
 * Attempts to determine if the next queued request can be executed by checking
 * whether or not the client is already requesting or has initialized. If the
 * client is not requesting and the client has already initialized then the
 * next request in the queue can be executed.
 * @function _queueNextRequest
 * @returns {Undefined} - does not return a value
 */
AuthClient.prototype._queueNextRequest = function() {

  if (this._isRequesting) {
    return;
  } else if (!this._hasInited) {

    this._pauseForClientInitialization();

    return;
  }

  this._isRequesting = true;
  this._makeRequest();
};

/**
 * Takes a request entry and adds it the end of the `_requestQueue` property.
 * @function _pushRequestEntryOntoRequestQueue
 * @param {Array} entry - a request entry
 * @returns {Undefined} - does not return a value
 */
AuthClient.prototype._pushRequestEntryOntoRequestQueue = function(entry) {

  this._requestQueue.push(entry);
};

/**
 * Public function to provide an easily invoked abstraction around sending an
 * error to the Error Reporting API. This function accepts an ErrorMessage
 * instance and a callback. The callback function will be invoked when the
 * request has succeded with the success response from the service or if the
 * request has failed the maximum number of times with the error response from
 * the service.
 * @function sendError
 * @param {ErrorMessage} err - the error message instance to send to the service
 * @param {Function} [callback] - an optional callback to callback on after
 *  success/failure
 * @returns {Undefined} - does not return a value
 */
AuthClient.prototype.sendError = function(err, callback) {

  if (!this._shouldReportErrors) {

    return;
  }

  this._pushRequestEntryOntoRequestQueue([ err, callback, new RetryTracker() ]);
  this._queueNextRequest();
};

module.exports = AuthClient;
