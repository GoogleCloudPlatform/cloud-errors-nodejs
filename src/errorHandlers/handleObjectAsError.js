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

var extractFromObject = require('../errorInformationExtractors/extractFromObject.js');
var handleUnknownAsError = require('./handleUnknownAsError.js');
var isObject = require('../typeCheckers/isObject.js');
var isFunction = require('../typeCheckers/isFunction.js');

/**
 * Handles routing and validation for parsing an error that has been indicated
 * to be of type object. If the value submitted for err passes a basic check
 * for being of type Object than the input will extracted as such, otherwise the
 * input will be treated as unknown.
 * @function handleObjectAsError
 * @param {Object} err - the error information object to extract from
 * @param {ErrorMessage} errorMessage - the error message instance to marshal
 *  error information into
 */
function handleObjectAsError ( err, errorMessage ) {

  if ( !isObject(err) || !isFunction(err.hasOwnProperty) ) {

    handleUnknownAsError(err, errorMessage);
  } else {

    extractFromObject(err, errorMessage);
  }
}

module.exports = handleObjectAsError;
