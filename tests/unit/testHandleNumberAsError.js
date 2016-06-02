var test = require('tape');
var ErrorMessage = require('../../src/ErrorMessage');
var handleNumberAsError = require('../../src/errorHandlers/handleNumberAsError.js');
var errorClassParsingUtils = require('../../src/errorClassParsingUtils.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

test(
  'Given variable inputs and input-types in the handleNumberAsError handler'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(6);

    t.doesNotThrow(
      handleNumberAsError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleNumberAsError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleNumberAsError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a string"
    );

    t.doesNotThrow(
      handleNumberAsError.bind(null, new Error(1.3), em)
      , undefined
      , "Should not throw when given an error"
    );

    t.doesNotThrow(
      handleNumberAsError.bind(null, {}, em)
      , undefined
      , "Should not throw when given an object"
    );

    t.doesNotThrow(
      handleNumberAsError.bind(null, 1.3, em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
