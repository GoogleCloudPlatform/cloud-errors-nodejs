var handleUnknownAsError = require('./handleUnknownAsError.js');
var extractFromErrorClass = require('../errorInformationExtractors/extractFromErrorClass');
var isObject = require('../typeCheckers/isObject.js');
var isFunction = require('../typeCheckers/isFunction.js');

/**
 * Handles routing and validation for parsing an errorMessage that was
 * flagged as an instance of the Error class. This function does not
 * discriminate against regular objects, checking only to see if the err
 * parameter is itself a basic object and has the function property
 * hasOwnProperty. Given that the input passes this basic test the input
 * will undergo extraction by the extractFromErrorClass function, otherwise
 * it will be treated and processed as an unknown.
 * @function handleErrorClassError
 * @param {Error} err - the error instance to extract information from
 * @param {ErrorMessage} errorMessage - the error message to marshal error
 *  information into.
 */
function handleErrorClassError ( err, errorMessage ) {

  if ( !isObject(err.stack) || !isFunction(err.hasOwnProperty) ) {

    handleUnknownAsError(err, errorMessage);
  } else {

    extractFromErrorClass(err, errorMessage);
  }
}

module.exports = handleErrorClassError;
