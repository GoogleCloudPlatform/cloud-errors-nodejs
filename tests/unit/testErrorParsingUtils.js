var test = require('tape');
var errorClassParsingUtils = require('../../src/errorClassParsingUtils.js');

test(
  'Test error parsing utils formatting stack traces'
  , function ( t ) {

    // !! THIS IS VERY IMPORTANT !!
    Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;
    // FOR THESE TESTS TO SUCCEED YOU MUST OVERRIDE THE STACK
    // TRACE PREPARER LIKE IN THE ABOVE

    var TEST_MESSAGE = "This is a test.";
    var errorTest = new Error(TEST_MESSAGE);

    t.plan(8);

    t.assert(
      errorTest.message === TEST_MESSAGE
      , "The error should have the test message as its message property"
    );

    t.assert(
      ((typeof errorTest.stack) === 'object')
      , "The error's stack property should be of type object"
    );

    t.assert(
      ((typeof errorTest.stack.filePath) === 'string')
      , "error.stack.filePath should be of type string"
    );

    t.assert(
      ((typeof errorTest.stack.lineNumber) === 'number')
      , "error.stack.lineNumber should be of type number"
    );

    t.assert(
      ((typeof errorTest.stack.functionName) === 'string')
      , "error.stack.functionName should be of type string"
    );

    t.assert(
      ((typeof errorTest.stack.stringifyStucturedCallList) === 'function')
      , "The error's stringifyStucturedCallList property should be of type function"
    );

    t.assert(
      ((typeof errorTest.stack.stringifyStucturedCallList()) === 'string')
      , "stringifyStucturedCallList should return type string"
    );

    t.assert(
      JSON.parse(errorTest.stack.stringifyStucturedCallList())
      , "One should be able to parse the JSON string returned by stringifyStucturedCallList"
    );
  }
);
