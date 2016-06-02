var isObject = require('../typeCheckers/isObject.js');

/**
 * Extracts error information from an instance of the Error class and marshals
 * that information into the provided instance of error message. This function
 * will check before accessing any part of the error for propety presence but
 * will not check the types of these property values that is instead work that
 * is allocated to the error message instance itself.
 * @param {Error} err - the error instance
 * @param {ErrorMessage} - the error message instance to have the error
 *  information marshaled into
 */
function extractFromErrorClass ( err, errorMessage ) {

  if ( err.hasOwnProperty('message') ) {

    errorMessage.setMessage(err.message);
  }

  if ( err.hasOwnProperty('user') ) {

    errorMessage.setUser(err.user);
  }

  if ( err.hasOwnProperty('serviceContext') && isObject(err.serviceContext) ) {

    errorMessage.setServiceContext(
      err.serviceContext.service
      , err.serviceContext.version
    );
  }

  if ( err.stack && isObject(err.stack) ) {

    errorMessage.setFilePath(err.stack.filePath)
      .setLineNumber(err.stack.lineNumber)
      .setFunctionName(err.stack.functionName);
  }
}

module.exports = extractFromErrorClass;
