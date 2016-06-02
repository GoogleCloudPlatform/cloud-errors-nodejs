var test = require('tape');
var extractFromErrorClass = require('../../src/errorInformationExtractors/extractFromErrorClass.js');
var ErrorMessage = require('../../src/ErrorMessage.js');

test(
  'Test Error Class Extraction Message'
  , function ( t ) {

    var TEST_MESSAGE = "This is a test";

    var em = new ErrorMessage();
    var err = new Error(TEST_MESSAGE);

    t.plan(1);

    extractFromErrorClass(err, em);
    t.assert(
      em.message === TEST_MESSAGE
      , "Given a valid message the error message should absorb that value"
    );
  }
);

test(
  'Test Error Class Extraction User'
  , function ( t ) {

    var TEST_USER_VALID = "TEST_USER";
    var TEST_USER_INVALID = 12;

    t.plan(2);

    var em = new ErrorMessage();
    var err = new Error();
    err.user = TEST_USER_VALID;

    extractFromErrorClass(err, em);
    t.assert(
      em.context.user === TEST_USER_VALID
      , "Given a valid user the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = new Error();
    err.user = TEST_USER_INVALID;

    extractFromErrorClass(err, em);
    t.assert(
      em.context.user === ""
      , "Given an invalid user the error message should set the user property as an empty string"
    );
  }
);

test(
  'Test Error Class Extraction Service'
  , function ( t ) {

    var TEST_SERVICE_VALID = {service: 'test', version: 'test'};
    var TEST_SERVICE_DEFAULT = {service: 'default', version: 'default'};
    var TEST_SERVICE_INVALID = 12;

    t.plan(3);

    var em = new ErrorMessage();
    var err = new Error();
    err.serviceContext = TEST_SERVICE_VALID;

    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_VALID
      , "Given a valid service context the value should be set on the error message"
    );

    em = new ErrorMessage();
    err = new Error();
    err.serviceContext = TEST_SERVICE_INVALID;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given an invalid service context the error message should retain default values on service context"
    );

    em = new ErrorMessage();
    err = new Error();
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given no service context the error message should retain default values on service context"
    );
  }
);

test(
  'Test Error Class Extraction Report Location'
  , function ( t ) {

    var TEST_STACK_DEFAULT = {
      filePath: ""
      , lineNumber: -1
      , functionName: ""
    };
    var TEST_STACK_VALID = {
      filePath: "valid"
      , lineNumber: 2
      , functionName: "value"
    };
    var TEST_STACK_INVALID_CONTENTS = {
      filePath: null
      , lineNumber: "2"
      , functionName: {}
    };
    var TEST_STACK_INVALID_TYPE = [];

    t.plan(3);

    var em = new ErrorMessage();
    var err = new Error();
    err.stack = TEST_STACK_VALID;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.context.reportLocation
      , TEST_STACK_VALID
      , "Given a valid stack the error message should absorb these values"
    );

    var em = new ErrorMessage();
    var err = new Error();
    err.stack = TEST_STACK_INVALID_CONTENTS;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.context.reportLocation
      , TEST_STACK_DEFAULT
      , "Given an invalid stack contents the error message should be the default values"
    );

    var em = new ErrorMessage();
    var err = new Error();
    err.stack = TEST_STACK_INVALID_TYPE;
    extractFromErrorClass(err, em);
    t.deepEqual(
      em.context.reportLocation
      , TEST_STACK_DEFAULT
      , "Given an invalid stack type the error message should be the default values"
    );
  }
)
