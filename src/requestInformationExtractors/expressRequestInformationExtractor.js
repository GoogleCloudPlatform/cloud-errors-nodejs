var RequestInformationContainer = require('../customClasses/RequestInformationContainer.js');
var isFunction = require('../typeCheckers/isFunction.js');
var isObject = require('../typeCheckers/isObject.js');

/**
 * This function checks for the presence of an `x-forwarded-for` header on the
 * request to check for remote address forwards, if that is header is not
 * present in the request then the function will attempt to extract the remote
 * address from the express request object.
 * @function extractRemoteAddressFromRequest
 * @param {Object} req - the express request object
 * @returns {String} - the remote address or, if one cannot be found, an empty
 *  string
 */
function extractRemoteAddressFromRequest ( req ) {

  if ( req.header('x-forwarded-for') !== undefined ) {

    return req.header('x-forwarded-for');
  } else if ( isObject(req.connection) ) {

    return req.connection.remoteAddress;
  }

  return "";
}

/**
 * The expressRequestInformationExtractor is a function which is made to extract
 * request information from a express request object. This function will do a
 * basic check for type and method presence but will not check for the presence
 * of properties on the request object.
 * @function expressRequestInformationExtractor
 * @param {Object} req - the express request object
 * @returns {RequestInformationContainer} - an object containing the request
 *  information in a standardized format
 */
function expressRequestInformationExtractor ( req ) {

  var returnObject = new RequestInformationContainer();

  if ( !isObject(req) || !isFunction(req.header) ) {

    return returnObject;
  }

  returnObject.setMethod(req.method)
    .setUrl(req.url)
    .setUserAgent(req.header('user-agent'))
    .setReferrer(req.header('referrer'))
    .setStatusCode(req.statusCode)
    .setRemoteAddress(extractRemoteAddressFromRequest(req));

  return returnObject;
}

module.exports = expressRequestInformationExtractor;
