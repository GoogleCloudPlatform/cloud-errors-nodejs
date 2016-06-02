var errorClassParsingUtils = require('./errorClassParsingUtils.js');
var ErrorMessage = require('./ErrorMessage.js');
var expressRequestInformationExtractor = require('./requestInformationExtractors/expressRequestInformationExtractor.js');
var errorHandlerRouter = require('./errorHandlerRouter.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function expressErrorHandler ( err, req, res, next ) {
  var em = new ErrorMessage().consumeRequestInformation(
    expressRequestInformationExtractor(req)
  );

  errorHandlerRouter(err, em);

  console.log("here is the errorMessage", em);
}

module.exports = expressErrorHandler;
