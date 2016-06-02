var RequestInformationContainer = require('../customClasses/RequestInformationContainer');
var isObject = require('../typeCheckers/isObject.js');

/**
 * This function is used to check for a pending status code on the response
 * or a set status code on the response.output object property. If neither of
 * these properties can be found then -1 will be returned as the output.
 * @function attemptToExtractStatusCode
 * @param {Object} req - the request information object to extract from
 * @returns {Number} - Either an HTTP status code or -1 in absence of an
 *  extractable status code.
 */
function attemptToExtractStatusCode ( req ) {

  if ( req.hasOwnProperty('response') && isObject(req.response)
    && req.response.hasOwnProperty('statusCode') ) {

    return req.response.statusCode;
  } else if ( req.hasOwnProperty('response') && isObject(req.response)
    && isObject(req.response.output) ) {

      return req.response.output.statusCode;
  }

  return -1;
}

/**
 * This function is used to check for the x-forwarded-for header first to
 * identify source IP connnections. If this header is not present, then the
 * function will attempt to extract the remoteAddress from the request.info
 * object property. If neither of these properties can be found then an empty
 * string will be returned.
 * @function extractRemoteAddressFromRequest
 * @param {Object} req - the request information object to extract from
 * @returns {String} - Either an empty string if the IP cannot be extracted or
 *  a string that represents the remote IP address
 */
function extractRemoteAddressFromRequest ( req ) {

  if ( req.headers['x-forwarded-for'] !== undefined ) {

    return req.headers['x-forwarded-for'];
  } else if ( req.info && isObject(req.info) ) {

    return req.info.remoteAddress;
  }

  return "";
}

/**
 * This function is used to extract request information from a hapi request
 * object. This function will not check for the presence of properties on the
 * request class.
 * @function hapiRequestInformationExtractor
 * @param {Object} req - the hapi request object to extract from
 * @returns {RequestInformationContainer} - an object containing the request
 *  information in a standardized format.
 */
function hapiRequestInformationExtractor ( req ) {

  var returnObject = new RequestInformationContainer();

  if ( !req || !isObject(req) || !isObject(req.headers) ) {

    return returnObject;
  }

  returnObject.setMethod(req.method);
  returnObject.setUrl(req.url);
  returnObject.setUserAgent(req.headers['user-agent']);
  returnObject.setReferrer(req.headers['referrer']);
  returnObject.setStatusCode(attemptToExtractStatusCode(req));
  returnObject.setRemoteAddress(extractRemoteAddressFromRequest(req));

  return returnObject;
}

module.exports = hapiRequestInformationExtractor;
