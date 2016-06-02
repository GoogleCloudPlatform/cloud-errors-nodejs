var test = require('tape');
var ErrorMessage = require('../../src/ErrorMessage');
var handleUnknownAsError = require('../../src/errorHandlers/handleUnknownAsError.js');
var errorClassParsingUtils = require('../../src/errorClassParsingUtils.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

test(
  'Given variable inputs and input-types in the handleUnknownAsError handler'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(7);

    t.doesNotThrow(
      handleUnknownAsError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, {}, em)
      , undefined
      , "Should not throw when given an object"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, [], em)
      , undefined
      , "Should not throw when given an array"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, new Error("test"), em)
      , undefined
      , "Should not throw when given an error"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, 1.3, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleUnknownAsError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a string"
    );
  }
);
