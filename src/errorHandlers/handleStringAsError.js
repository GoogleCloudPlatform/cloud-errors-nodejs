var isString = require('../typeCheckers/isString.js');

/**
 * Handles validation of an error which has been indicated to be of type String.
 * This function will create a new instance of the Error class to produce a
 * stack trace for submission to the API and check to confirm that the given
 * value is of type string.
 * @function handleStringAsError
 * @param {String} err - the String indicated as the content of the error
 * @param {ErrorMessage} errorMessage - the error message instance to marshal
 *  error information into.
 */
function handleStringAsError ( err, errorMessage ) {
  var fauxError = new Error();
  var errChecked = "";

  if ( isString(err) ) {

    errChecked = err;
  }

  errorMessage.setMessage(errChecked)
    .setFunctionName(fauxError.stack.functionName)
    .setLineNumber(fauxError.stack.lineNumber)
    .setFilePath(fauxError.stack.stringifyStucturedCallList());
}

module.exports = handleStringAsError;
