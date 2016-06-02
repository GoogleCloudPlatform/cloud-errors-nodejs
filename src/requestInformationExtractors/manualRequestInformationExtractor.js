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
 * @returns {RequestInformationContainer} - an object containing the request
 *  information in a standardized format.
 */
function manualRequestInformationExtractor ( req ) {

  var returnObject = new RequestInformationContainer();

  if ( !isObject(req) ) {

    return returnObject;
  }

  if ( req.hasOwnProperty(req, "method") ) {

    returnObject.setMethod(req.method);
  }

  if ( req.hasOwnProperty(req, "url") ) {

    returnObject.setUrl(req.url);
  }

  if ( req.hasOwnProperty(req, "userAgent") ) {

    returnObject.setUserAgent(req.userAgent);
  }

  if ( req.hasOwnProperty(req, "referrer") ) {

    returnObject.setReferrer(req.referrer);
  }

  if ( req.hasOwnProperty(req, "statusCode") ) {

    returnObject.setUserAgent(req.statusCode);
  }

  if ( req.hasOwnProperty(req, "remoteAddress") ) {

    returnObject.setRemoteAddress(req.remoteAddress);
  }

  return returnObject;
}

module.exports = manualRequestInformationExtractor;
