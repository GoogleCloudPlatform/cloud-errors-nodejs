var isNumber = require('../typeCheckers/isNumber.js');
var isFunction = require('../typeCheckers/isFunction');

/**
 * Handles routing and validation for parsing an error which has been indicated
 * to be of type Number. This handler will manufacture a new Error to create
 * a stack-trace for submission to the Error API and will attempt to caste the
 * given number to a string for submission to the Error API.
 * @function handleNumberAsError
 * @param {Number} err - the number submitted as content for the error message
 * @param {ErrorMessage} errorMessage - the error messag instance to marshall
 *  error information into.
 */
function handleNumberAsError ( err, errorMessage ) {
  var fauxError = new Error();
  var errChecked = "";

  if ( isNumber(err) && isFunction(err.toString) ) {

    errChecked = err.toString();
  }

  errorMessage.setMessage(errChecked)
    .setFunctionName(fauxError.stack.functionName)
    .setLineNumber(fauxError.stack.lineNumber)
    .setFilePath(fauxError.stack.stringifyStucturedCallList());
}

module.exports = handleNumberAsError;
