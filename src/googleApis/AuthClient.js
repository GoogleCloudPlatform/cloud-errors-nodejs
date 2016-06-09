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
 
var GoogleAuth = require('google-auth-library');
var isFunction = require('../typeCheckers/isFunction');
var RetryTracker = require('../customClasses/RetryTracker');

/**
 * The AuthClient constructor intializes several properties on the AuthClient
 * instance, creates a new GoogleAuth authorization factory to facilitate
 * communication with the Google error reporting API and then initializes the
 * GoogleAuth client.
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
 * @property {String} _projectId - The project Id used to request against the
 *  service
 * @property {Boolean} _shouldReportErrors - Indicator denoting whether or not
 *  the client should actually attempt requests against the service
 */
function AuthClient ( projectId, shouldReportErrors ) {

  this._authClient = null;
  this._hasInited = false;
  this._isRequesting = false;
  this._requestQueue = [];
  this._authFactory = new GoogleAuth();

  this._projectId = projectId;
  this._shouldReportErrors = (shouldReportErrors === true) ? true : false;

  this._getApplicationDefaultCredentials();
}

/**
 * Intializes the GoogleAuth client, authorizes it against the service and
 * creates scoped credentials, if necessary, for the client.
 * @function _getApplicationDefaultCredentials
 */
AuthClient.prototype._getApplicationDefaultCredentials = function ( ) {

  this._authFactory.getApplicationDefault(
    ( err, authClient ) => {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];

      if ( err ) {
        console.log("Authentication failed because of", err);

        return ;
      }


      if ( authClient.createScopedRequired && authClient.createScopedRequired() ) {

        this._authClient = authClient.createScoped(scopes);
      } else {

        this._authClient = authClient;
      }

      this._hasInited = true;
    }
  );
}

/**
 * Used for temporary interfacing with the Gated Error Creation URL. Will
 * be removed in favor of default auth when the API goes live. Creates the
 * url to create errors in the error API.
 * @function _generateErrorCreationUrl
 * @returns {String} - the url to create errors for the error reporting API
 */
AuthClient.prototype._generateErrorCreationUrl ( ) {

  return [
    "https://clouderrorreporting.googleapis.com/v1beta/projects"
    , this._projectId
    , "events"
  ].join("/");
}

/**
 * Creates the options object for posting erros against the error creation API
 * @function _generateErrorCreationRequestOptions
 * @param payload - the ErrorMessage instance to JSON.stringify for submission
 *  to the service
 * @returns {Object} - The options object for the requesting client
 */
AuthClient.prototype._generateErrorCreationRequestOptions ( payload ) {

  return {
    url: this._generateErrorCreationUrl()
    , method: "POST"
    , json: payload
  };
}

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
 */
AuthClient.prototype._makeRequest = function ( ) {

  var requestPayloadSlot = [];
  var thisRequestsPayload = {};
  var thisRequestsCallback = null;
  var thisRequestsRetryTracker = {};
  var thisRequestsOptions = {};

  if ( !this._areRequestsStillInQueue() ) {

    return ;
  }

  requestPayloadSlot = this._requestQueue[0];
  thisRequestsPayload = requestPayloadSlot[0];
  thisRequestsCallback = requestPayloadSlot[1];
  thisRequestsRetryTracker = requestPayloadSlot[2];
  thisRequestsOptions = this._generateErrorCreationRequestOptions(
    thisRequestsPayload
  );

  this._authClient.request(
    thisRequestsOptions
    , function ( err, result, response ) {

      if ( err ) {
        thisRequestsRetryTracker.increaseRetryCount();

        if ( thisRequestsRetryTracker.shouldRetry() ) {

          thisRequestsRetryTracker.notifyOfWhenToRetry(
            this._makeRequest.bind(this)
          );

          return ;
        } else {

          if ( isFunction(thisRequestsCallback) ) {

            thisRequestsCallback(err);
          }
        }
      } else {

        if ( isFunction(thisRequestsCallback) ) {

          thisRequestsCallback(result);
        }
      }

      this._requestQueue.shift();
      this._isRequesting = false;
      this._queueNextRequest();
    }.bind(this)
  );
}

/**
 * Checks the length of the `_requestQueue` property on the instance, indicating
 * whether or not another request or set of requests is still pending execution.
 * @function _areRequestsStillInQueue
 * @returns {Number} - the length of the `_requestQueue` property
 */
AuthClient.prototype._areRequestsStillInQueue = function ( ) {

  return this._requestQueue.length > 0;
}

/**
 * Creates a timeout to wait for AuthClient init and calls back to the
 * queueNextRequest function to reattempt queueing the next request.
 * @function _pauseForClientInitialization
 */
AuthClient.prototype._pauseForClientInitialization = function ( ) {

  setTimeout(
    function ( ) {

      this._queueNextRequest();
    }.bind(this)
    , 1500
  );
}

/**
 * Attempts to determine if the next queued request can be executed by checking
 * whether or not the client is already requesting or has initialized. If the
 * client is not requesting and the client has already initialized then the
 * next request in the queue can be executed.
 * @function _queueNextRequest
 */
AuthClient.prototype._queueNextRequest = function ( ) {

  if ( this._isRequesting === true ) {

    return ;
  } else if ( this._hasInited !== true ) {

    this._pauseForClientInitialization();

    return ;
  }

  this._isRequesting = true;
  this._makeRequest();
}

/**
 * Takes a request entry and adds it the end of the `_requestQueue` property.
 * @function _pushRequestEntryOntoRequestQueue
 */
AuthClient.prototype._pushRequestEntryOntoRequestQueue = function ( entry ) {

  this._requestQueue.push(entry);
}

/**
 * Public function to provide an easily invoked abstraction around sending an
 * error to the Error Reporting API. This function accepts an ErrorMessage
 * instance and a callback. The callback function will be invoked when the
 * request has succeded with the success response from the service or if the
 * request has failed the maximum number of times with the error response from
 * the service.
 * @function sendError
 */
AuthClient.prototype.sendError = function ( err, callback ) {

  if ( !this._shouldReportErrors ) {

    return ;
  }

  this._pushRequestEntryOntoRequestQueue([
    err
    , callback
    , new RetryTracker()
  ]);
  this._queueNextRequest();
}

module.exports = AuthClient;
