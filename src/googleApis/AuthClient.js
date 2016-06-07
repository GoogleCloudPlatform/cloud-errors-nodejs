var GoogleAuth = require('google-auth-library');
var fs = require('fs');

function RetryTracker ( ) {

  this._retries = 0;
  this._maxRetries = 4;
  this._currentTimeout = 0;
  this._minTimeout = 1000;
}

RetryTracker.prototype.increaseRetryCount = function ( ) {

  this._retries += 1;
  this._recalculateRetryTimeout();
}

RetryTracker.prototype._recalculateRetryTimeout = function ( ) {

  this._currentTimeout = this._minTimeout * Math.pow(2, (this._retries-1));
}

RetryTracker.prototype.shouldRetry = function ( ) {

  return this._retries < this._maxRetries;
}

RetryTracker.prototype.notifyOfWhenToRetry = function ( cb ) {

  setTimeout(
    cb
    , this._currentTimeout
  );
}

function AuthClient ( projectId, shouldReportErrors ) {

  this._authClient = null;
  this._hasInited = false;
  this._isRequesting = false;
  this._sourceContext = null;
  this._requestQueue = [];
  this._authFactory = new GoogleAuth();
  // this._stubAPIKey = "AIzaSyBW3u3MqCvPeyvbtM-xvEu6d3MVYz2KUGI";

  this._projectId = projectId;
  this._shouldReportErrors = (shouldReportErrors === true) ? true : false;

  this._getApplicationDefaultCredentials();
}

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

AuthClient.prototype._generateErrorCreationUrl ( ) {

  return [
    "https://clouderrorreporting.googleapis.com/v1beta/projects/grimm-git/events?key"
    , this._stubAPIKey
  ].join("=");
}

AuthClient.prototype._generateErrorCreationRequestOptions ( ) {

  return {
    url: this._generateErrorCreationUrl()
    , method: "POST"
  };
}

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
  thisRequestsOptions = this._generateErrorCreationRequestOptions();

  this._authClient.request(
    thisRequestsOptions
    , ( err, result, response ) => {

      if ( err ) {
        thisRequestsRetryTracker.increaseRetryCount();

        if ( thisRequestsRetryTracker.shouldRetry() ) {

          thisRequestsRetryTracker.notifyOfWhenToRetry(this._makeRequest);
        } else {

          callback(err);
        }
      } else {
        callback(result);
      }

      this._requestQueue.shift();
      this._isRequesting = false;
      this._attemptToMakeRequest();
    }
  );
}

AuthClient.prototype._areRequestsStillInQueue = function ( ) {

  return this._requestQueue.length > 0;
}

AuthClient.prototype._pauseForClientInitialization = function ( ) {

  setTimeout(
    ( ) => {

      this._attemptToMakeRequest();
    }
    , 1500
  );
}

AuthClient.prototype._attemptToMakeRequest = function ( ) {

  if ( this._isRequesting === true ) {

    return ;
  } else if ( this._hasInited !== true ) {

    this._pauseForClientInitialization();
  } else {

    this._isRequesting = true;
    this._makeRequest();
  }
}

AuthClient.prototype._pushErrorOntoRequestQueue = function ( err ) {

  this._requestQueue.push(err);
}

AuthClient.prototype.sendError = function ( err, callback ) {

  if ( !this._shouldReportErrors ) {

    return ;
  }

  this._pushErrorOntoRequestQueue([
    JSON.stringify(err)
    , callback
    , new RetryTracker()
  ]);
  this._attemptToMakeRequest();
}

module.exports = AuthClient;
