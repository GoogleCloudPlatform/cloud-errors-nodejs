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
var RequestInformationContainer = require('../customClasses/RequestInformationContainer.js');
var isObject = require('../typeCheckers/isObject.js');

/**
 * The manualRequestInformationExtractor is meant to take a standard object
 * and extract request information based on the inclusion of several properties.
 * This function will check the presence of properties before attempting to
 * access them on the object but it will not attempt to check for these
 * properties types as this is allocated to the RequestInformationContainer.
 * @function manualRequestInformationExtractor
 * @param {Object} req - the request information object to extract from
 * @param {String} [req.method] - the request method (ex GET, PUT, POST, DELETE)
 * @param {String} [req.url] - the request url
 * @param {String} [req.userAgent] - the requesters user-agent
 * @param {String} [req.referrer] - the requesters referrer
 * @param {Number} [req.statusCode] - the status code given in response to the
 *  request
 * @param {String} [req.remoteAddress] - the remote address of the requester
 * @returns {RequestInformationContainer} - an object containing the request
 *  information in a standardized format
 */
function manualRequestInformationExtractor ( req ) {

  var returnObject = new RequestInformationContainer();

  if ( !isObject(req) ) {

    return returnObject;
  }

  if ( req.hasOwnProperty("method") ) {

    returnObject.setMethod(req.method);
  }

  if ( req.hasOwnProperty("url") ) {

    returnObject.setUrl(req.url);
  }

  if ( req.hasOwnProperty("userAgent") ) {

    returnObject.setUserAgent(req.userAgent);
  }

  if ( req.hasOwnProperty("referrer") ) {

    returnObject.setReferrer(req.referrer);
  }

  if ( req.hasOwnProperty("statusCode") ) {

    returnObject.setUserAgent(req.statusCode);
  }

  if ( req.hasOwnProperty("remoteAddress") ) {

    returnObject.setRemoteAddress(req.remoteAddress);
  }

  return returnObject;
}

module.exports = manualRequestInformationExtractor;
