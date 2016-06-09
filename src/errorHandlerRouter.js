var handleErrorClassError = require('./errorHandlers/handleErrorClassError');
var handleObjectAsError = require('./errorHandlers/handleObjectAsError');
var handleStringAsError = require('./errorHandlers/handleStringAsError');
var handleNumberAsError = require('./errorHandlers/handleNumberAsError');
var handleUnknownAsError = require('./errorHandlers/handleUnknownAsError');

/**
 * The Error handler router is responsible for taking an error of some type and
 * and Error message container, analyzing the type of the error and routing it
 * to the proper handler so that the error information can be marshaled into the
 * the error message container.
 * @function errorHandlerRouter
 * @param {Any} err - the error information to extract from
 * @param {ErrorMessage} em - an instance of ErrorMessage to marshal error
 *  information into
 */
function errorHandlerRouter ( err, em ) {

  if ( err instanceof Error ) {

    handleErrorClassError(err, em);

    return ;
  }

  switch (typeof err) {
    case "object":

      handleObjectAsError(err, em);
      break;
    case "string":

      handleStringAsError(err, em);
      break;
    case "number":

      handleNumberAsError(err, em);
      break;
    default:

      handleUnknownAsError(err, em);
  }
}



module.exports = errorHandlerRouter;
