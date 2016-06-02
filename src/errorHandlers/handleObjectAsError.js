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
