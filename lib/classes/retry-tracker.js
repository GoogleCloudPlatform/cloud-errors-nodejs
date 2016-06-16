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
function RetryTracker() {

  this._retries = 0;
  this._maxRetries = 4;
  this._currentTimeout = 0;
  this._minTimeout = 1000;
}

/**
 * Increases the `_retries` properties value by one. Invocation of this function
 * will also cause a recalculation of the `_currentTimeout` property.
 * @function increaseRetryCount
 * @chainable
 * @returns {this} - Returns the instance for chaining
 */
RetryTracker.prototype.increaseRetryCount = function() {

  this._retries += 1;
  this._recalculateRetryTimeout();
};

/**
 * Recalculates and reassigns the value of the `_currentTimeout` property by
 * using the `_minTimeout` property and the `_retries` property to calculate an
 * exponentially increasing time to wait before retrying the request.
 * @function _recalculateRetryTimeout
 * @returns {Undefined} - Does not return an explicit value
 */
RetryTracker.prototype._recalculateRetryTimeout = function() {

  this._currentTimeout = this._minTimeout * Math.pow(2, this._retries - 1);
};

/**
 * Invoke to determine whether the instance has reached its max number of number
 * of request retries.
 * @function shouldRetry
 * @returns {Boolean} - will return true if the instance has not reached its max
 *  number of retries or false if the instance has
 */
RetryTracker.prototype.shouldRetry = function() {

  return this._retries < this._maxRetries;
};

/**
 * Invoke to have the instance callback to the given function once the number of
 * milliseconds in the `_currentTimeout` property has passed.
 * @function notifyOfWhenToRetry
 * @param {Function} cb - the function to invoke once the timeout has passed
 * @returns {Boolean} - Returns false if the callback given was not a function
 *  otherwise returns true
 */
RetryTracker.prototype.notifyOfWhenToRetry = function(cb) {

  if (!isFunction(cb)) {

    return false;
  }

  setTimeout(cb, this._currentTimeout);

  return true;
};

module.exports = RetryTracker;
