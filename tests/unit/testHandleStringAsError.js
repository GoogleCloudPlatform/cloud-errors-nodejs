var test = require('tape');
var ErrorMessage = require('../../src/ErrorMessage');
var handleStringAsError = require('../../src/errorHandlers/handleStringAsError.js');
var errorClassParsingUtils = require('../../src/errorClassParsingUtils.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

test(
  'Given variable inputs and input-types in the handleStringAsError handler'
  , function ( t ) {

    var em = new ErrorMessage();

    t.plan(7);

    t.doesNotThrow(
      handleStringAsError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, {}, em)
      , undefined
      , "Should not throw when given an object"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, [], em)
      , undefined
      , "Should not throw when given an array"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, new Error("test"), em)
      , undefined
      , "Should not throw when given an error"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, 1.3, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleStringAsError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
