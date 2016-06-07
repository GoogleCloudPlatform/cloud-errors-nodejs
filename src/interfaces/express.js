var errorClassParsingUtils = require('../errorClassParsingUtils.js');
var ErrorMessage = require('../customClasses/ErrorMessage.js');
var expressRequestInformationExtractor = require('../requestInformationExtractors/expressRequestInformationExtractor.js');
var errorHandlerRouter = require('../errorHandlerRouter.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function expressErrorHandler ( client, err, req, res, next ) {
  var em = new ErrorMessage().consumeRequestInformation(
    expressRequestInformationExtractor(req)
  );

  errorHandlerRouter(err, em);

  client.sendError(em);
}

function handlerSetup ( client ) {

  return expressErrorHandler.bind(null, client);
}

module.exports = handlerSetup;
