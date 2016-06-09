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

/**
 * Enum for uncaught handling options set on the process. Given `ignore` library
 * will not attempt to handle or log uncaught errors, given `report` the library
 * will capture and attempt to report these errors to the Error Reporting API
 * and will attempt to prevent the error from closing the process. Given
 * `reportAndExit` the library will report an uncaught error to the Error
 * Reporting API and then attempt to close the process.
 * @name uncaughtHandlingEnum
 * @readonly
 * @enum {String}
 */
var uncaughtHandlingEnum = {
  ignore: 'ignore'
  , report: 'report'
  , reportAndExit: 'reportAndExit'
};

module.exports = uncaughtHandlingEnum;
