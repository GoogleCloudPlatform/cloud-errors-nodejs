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
/* eslint-env node */
'use strict';

/**
 * Checks the type of input and returns true if the input is of type function
 * or false if the input is not of type function.
 * @function isFunction
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - true if the input is of type function, otherwise false
 */
function isFunction ( varToCheck ) {

  return typeof varToCheck === 'function';
}

module.exports = isFunction;
