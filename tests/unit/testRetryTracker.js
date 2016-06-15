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

var test = require('tape');
var RetryTracker = require('../../lib/classes/retry-tracker.js');

test(
  'Testing retry trackers basic functions'
  , function ( t ) {

    var rt = new RetryTracker();
    var oldRetries = rt._retries;
    var oldTimeout = rt._currentTimeout;
    var MAX_RETRIES = 4;
    var MIN_TIMEOUT = 1000;

    t.assert(
      (rt instanceof RetryTracker)
      , "Creating an instance of retry tracker should be an instance of retry tracker"
    );

    t.deepEqual(
      rt._retries
      , 0
      , "A newly inited version of retry tracker should have the _retries property set to 0"
    );

    t.deepEqual(
      rt._maxRetries
      , MAX_RETRIES
      , "A newly inited version of retry tracker should have the _maxRetries property set to 4"
    );

    t.deepEqual(
      rt._currentTimeout
      , 0
      , "A newly inited version of retry tracker should have the _currentTimeout property set to 0"
    );

    t.deepEqual(
      rt._minTimeout
      , MIN_TIMEOUT
      , "A newly inited version of retry tracker should have the _minTimeout property set to 1000"
    );

    t.assert(
      rt.shouldRetry() === true
      , "Calling shouldRetry on a new instance should return true"
    );

    rt.increaseRetryCount();
    t.deepEqual(
      rt._retries
      , oldRetries+1
      , 'Calling increaseRetryCount should cause retries to increase by one'
    );

    t.assert(
      rt.shouldRetry() === true
      , "Calling increaseRetryCount once then calling shouldRetry should still return true"
    );

    t.assert(
      (rt._currentTimeout > oldTimeout)
      , "Calling increaseRetryCount should cause the currentTimeout to increase"
    );
    oldTimeout = rt._minTimeout;

    rt.increaseRetryCount();
    t.deepEqual(
      rt._currentTimeout
      , oldTimeout*2
      , "Calling increaseRetryCount again should cause the _currentTimeout to double"
    );

    t.assert(
      rt.shouldRetry() === true
      , "Calling increaseRetryCount twice then calling shouldRetry should still return true"
    );

    rt.increaseRetryCount();
    t.assert(
      rt.shouldRetry() === true
      , "Calling increaseRetryCount three times then calling shouldRetry should still return true"
    );

    rt.increaseRetryCount();
    t.assert(
      rt.shouldRetry() === false
      , "Calling increaseRetryCount four times then calling shouldRetry should return false"
    );
    oldTimeout = rt._currentTimeout;

    rt._recalculateRetryTimeout();
    t.deepEqual(
      rt._currentTimeout
      , oldTimeout
      , "Directly calling _recalculateRetryTimeout should cause the _currentTimeout property to not double"
    );

    rt = new RetryTracker();
    rt.increaseRetryCount();
    oldTimeout = rt._currentTimeout+1000;
    var failTimeout;
    var failureFn = function ( ) {

      t.fail('Calling notifyOfWhenToRetry should callback to host function before failure timeout');
      rt = null;
      t.end();
    };

    var successFn = function ( ) {

      clearTimeout(failTimeout);
      t.pass('Calling notifyOfWhenToRetry should callback to host function before failure timeout');
      t.end();
    };

    failTimeout = setTimeout(failureFn, oldTimeout);
    var returnAttach = rt.notifyOfWhenToRetry(successFn);
    t.assert(
      returnAttach === true
      , "Calling notifyOfWhenToRetry with a valid function should return true"
    );

    returnAttach = rt.notifyOfWhenToRetry(false);
    t.assert(
      returnAttach === false
      , "Calling notifyOfWhenToRetry with an invalid function should return false"
    );
  }
);
