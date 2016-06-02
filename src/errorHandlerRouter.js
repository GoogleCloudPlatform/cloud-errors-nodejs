var handleErrorClassError = require('./errorHandlers/handleErrorClassError');
var handleObjectAsError = require('./errorHandlers/handleObjectAsError');
var handleStringAsError = require('./errorHandlers/handleStringAsError');
var handleNumberAsError = require('./errorHandlers/handleNumberAsError');
var handleUnknownAsError = require('./errorHandlers/handleUnknownAsError');

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
