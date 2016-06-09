var isFunction = require('../typeCheckers/isFunction');

/**
 * The constructor for RetryTracker sets four private properties on the
 * instance meant to keep track of request-retry state and whether or not a
 * a specific request should be retries.
 * @class RetryTracker
 * @classdesc The RetryTracker class is made to integrate with the AuthClient
 *  class to keep track of how many time a particular request has been made,
 *  and once a failed request has been made, how long to pause before attempting
 *  to make the request again. The RetryTracker class default to a max of three
 *  retries before indicating to the consuming function not to re-request
 *  anymore and uses exponential backoff to space request retries.
 * @property {Number} _retries - the number of retries made by the specific
 *  request
 * @property {Number} _maxRetries - the max number of request retries to make
 * @property {Number} _currentTimeout - the amount of time to pause before
 *  making the next request
 * @property {Number} _minTimeout - the minimum amount of time to wait between
 *  request retries
 */
function RetryTracker ( ) {

  this._retries = 0;
  this._maxRetries = 4;
  this._currentTimeout = 0;
  this._minTimeout = 1000;
}

/**
 * Increases the `_retries` properties value by one. Invocation of this function
 * will also cause a recalculation of the `_currentTimeout` property.
 * @function increaseRetryCount
 */
RetryTracker.prototype.increaseRetryCount = function ( ) {

  this._retries += 1;
  this._recalculateRetryTimeout();
}

/**
 * Recalculates and reassigns the value of the `_currentTimeout` property by
 * using the `_minTimeout` property and the `_retries` property to calculate an
 * exponentially increasing time to wait before retrying the request.
 * @function _recalculateRetryTimeout
 */
RetryTracker.prototype._recalculateRetryTimeout = function ( ) {

  this._currentTimeout = this._minTimeout * Math.pow(2, (this._retries-1));
}

/**
 * Invoke to determine whether the instance has reached its max number of number
 * of request retries.
 * @function shouldRetry
 * @returns {Boolean} - will return true if the instance has not reached its max
 *  number of retries or false if the instance has
 */
RetryTracker.prototype.shouldRetry = function ( ) {

  return this._retries < this._maxRetries;
}

/**
 * Invoke to have the instance callback to the given function once the number of
 * milliseconds in the `_currentTimeout` property has passed.
 * @function notifyOfWhenToRetry
 * @param {Function} cb - the function to invoke once the timeout has passed
 */
RetryTracker.prototype.notifyOfWhenToRetry = function ( cb ) {

  if ( !isFunction(cb) ) {

    return ;
  }

  setTimeout(
    cb
    , this._currentTimeout
  );
}

module.exports = RetryTracker;
