var isObject = require('../typeCheckers/isObject.js');

/**
 * Attempts to extract error information given an object as the input for the
 * error. This function will check presence of each property before attempting
 * to access the given property on the object but will not check for type
 * compliance as that is allocated to the instance of the error message itself.
 * @function extractFromObject
 * @param {Object} err - the Object given as the content of the error
 * @param {ErrorMessage} errorMessage - the error message instance to marshal
 *  error information into.
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
