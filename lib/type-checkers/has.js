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
var isObject = require('./is-object.js');
var isString = require('./is-string.js');

/**
 * Checks the object input to see if it has the given property. If it does will
 * return true, otherwise will return false.
 * @function has
 * @param {Object} objectToCheck - the object to check the presence of the
 *  property for
 * @param {String} propertyToCheckFor - the property name to check for
 * @returns {Boolean} - Returns false if either argument is not of the correct
 *  type or the property is not found, otherwise will return true
 */
function has ( objectToCheck, propertyToCheckFor ) {

  if ( !isObject(objectToCheck) || !isString(propertyToCheckFor) ) {

    return false;
  }

  return {}.hasOwnProperty.call(objectToCheck, propertyToCheckFor);
}

module.exports = has;
