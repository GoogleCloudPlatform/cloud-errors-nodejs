var test = require('tape');
var ErrorMessage = require('../../src/ErrorMessage');
var handleErrorClassError = require('../../src/errorHandlers/handleErrorClassError.js');
var errorClassParsingUtils = require('../../src/errorClassParsingUtils.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

test(
  'Given variable inputs and input-types in the handleErrorClassError handler'
  , function ( t ) {

    var adversarialObjectInput = {
      stack: {}
    };
    var adversarialObjectInputTwo = {
      stack: []
    };

    var em = new ErrorMessage();

    t.plan(8);

    t.doesNotThrow(
      handleErrorClassError.bind(null, undefined, em)
      , undefined
      , "Should not throw when given undefined"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, null, em)
      , undefined
      , "Should not throw when given null"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, "string_test", em)
      , undefined
      , "Should not throw when given a string"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, 1.2, em)
      , undefined
      , "Should not throw when given a number"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, [], em)
      , undefined
      , "Should not throw when given an array"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, adversarialObjectInput, em)
      , undefined
      , "Should not throw when given a masquerading object"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, adversarialObjectInputTwo, em)
      , undefined
      , "Should not throw when given a masquerading array"
    );

    t.doesNotThrow(
      handleErrorClassError.bind(null, new Error("Test"), em)
      , undefined
      , "Should not throw when given a valid input"
    );
  }
);
