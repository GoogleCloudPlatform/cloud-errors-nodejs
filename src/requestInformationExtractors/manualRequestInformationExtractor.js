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
