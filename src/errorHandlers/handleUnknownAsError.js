/**
 * Handles unknown/unsupported input as the content of the error message. Since
 * the problem-space is not defined for this path the library only attempts to
 * manufacture a stack trace for submission to the API and discards the input
 * that was given as the error content.
 * @param {Any} err - the unknown/unsupported input indicated as the content of
 *  the error.
 * @param {ErrorMessage} errorMessage - the error message instance to marshal
 *  error information into.
 */
function handleUnknownAsError ( err, errorMessage ) {
  var fauxError = new Error("Unknown type was given to error handler");

  errorMessage.setMessage(fauxError.message)
    .setFunctionName(fauxError.stack.functionName)
    .setLineNumber(fauxError.stack.lineNumber)
    .setFilePath(fauxError.stack.stringifyStucturedCallList());
}

module.exports = handleUnknownAsError;
