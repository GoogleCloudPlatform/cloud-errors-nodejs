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

var isObject = require('../typeCheckers/isObject.js');

/**
 * Attempts to extract error information given an object as the input for the
 * error. This function will check presence of each property before attempting
 * to access the given property on the object but will not check for type
 * compliance as that is allocated to the instance of the error message itself.
 * @function extractFromObject
 * @param {Object} err - the Object given as the content of the error
 * @param {String} [err.message] - the error message
 * @param {String} [err.user] - the user the error occurred for
 * @param {String} [err.filePath] - the file path and file where the error
 *  occurred at
 * @param {Number} [err.lineNumber] - the line number where the error occurred
 *  at
 * @param {String} [err.functionName] - the function where the error occurred at
 * @param {Object} [err.serviceContext] - the service context object of the
 *  error
 * @param {String} [err.serviceContext.service] - the service the error occurred
 *  on
 * @param {String} [err.serviceContext.version] - the version of the application
 *  that the error occurred on
 * @param {ErrorMessage} errorMessage - the error message instance to marshal
 *  error information into
 */
function extractFromObject ( err, errorMessage ) {

  if ( err.hasOwnProperty('message') ) {

    errorMessage.setMessage(err.message);
  }

  if ( err.hasOwnProperty('user') ) {

    errorMessage.setUser(err.user);
  }

  if ( err.hasOwnProperty('filePath') ) {

    errorMessage.setFilePath(err.filePath);
  }

  if ( err.hasOwnProperty('lineNumber') ) {

    errorMessage.setLineNumber(err.lineNumber);
  }

  if ( err.hasOwnProperty('functionName') ) {

    errorMessage.setFunctionName(err.functionName);
  }

  if ( err.hasOwnProperty('serviceContext') && isObject(err.serviceContext) ) {

    errorMessage.setServiceContext(
      err.serviceContext.service
      , err.serviceContext.version
    );
  }
}

module.exports = extractFromObject;
