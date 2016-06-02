var test = require('tape');
var extractFromObject = require('../../src/errorInformationExtractors/extractFromObject.js');
var ErrorMessage = require('../../src/ErrorMessage.js');

test(
  'Test Object Extraction Message'
  , function ( t ) {

    var MESSAGE = "test";

    var em = new ErrorMessage();
    var err = { message: MESSAGE };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.message === MESSAGE
      , "Given a valid message the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.message === ""
      , "Given that the object does not have a message property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction User'
  , function ( t ) {

    var USER = "test";

    var em = new ErrorMessage();
    var err = { user: USER };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.user === USER
      , "Given a valid user the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.user === ""
      , "Given that the object does not have a user property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction filePath'
  , function ( t ) {

    var PATH = "test";

    var em = new ErrorMessage();
    var err = { filePath: PATH };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.filePath === PATH
      , "Given a valid filePath the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.filePath === ""
      , "Given that the object does not have a filePath property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction lineNumber'
  , function ( t ) {

    var LINE_NUMBER = 10;

    var em = new ErrorMessage();
    var err = { lineNumber: LINE_NUMBER };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.lineNumber === LINE_NUMBER
      , "Given a valid lineNumber the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.lineNumber === -1
      , "Given that the object does not have a lineNumber property the ErrorMessage will retain its default value"
    );
  }
);

test(
  'Test Object Extraction functionName'
  , function ( t ) {

    var FUNCTION_NAME = "test";

    var em = new ErrorMessage();
    var err = { functionName: FUNCTION_NAME };

    t.plan(2);

    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.functionName === FUNCTION_NAME
      , "Given a valid functionName the error message should absorb that value"
    );

    em = new ErrorMessage();
    err = {};
    extractFromObject(err, em);
    t.assert(
      em.context.reportLocation.functionName === ""
      , "Given that the object does not have a functionName property the ErrorMessage will retain its default value"
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
    var err = { serviceContext: TEST_SERVICE_VALID };

    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_VALID
      , "Given a valid service context the value should be set on the error message"
    );

    em = new ErrorMessage();
    err = { serviceContext: TEST_SERVICE_INVALID };
    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given an invalid service context the error message should retain default values on service context"
    );

    em = new ErrorMessage();
    err = {}
    extractFromObject(err, em);
    t.deepEqual(
      em.serviceContext
      , TEST_SERVICE_DEFAULT
      , "Given no service context the error message should retain default values on service context"
    );
  }
);
