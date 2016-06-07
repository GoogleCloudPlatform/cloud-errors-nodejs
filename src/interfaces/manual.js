var errorClassParsingUtils = require('../errorClassParsingUtils.js');
var ErrorMessage = require('../customClasses/ErrorMessage.js');
var manualRequestInformationExtractor = require('../requestInformationExtractors/manualRequestInformationExtractor');
var errorHandlerRouter = require('../errorHandlerRouter.js');
var isString = require('../typeCheckers/isString.js');
var isObject = require('../typeCheckers/isObject.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function reportManualError ( client, err, request, additionalMessage ) {

  var em = new ErrorMessage();

  if ( isObject(request) ) {

    em.consumeRequestInformation(
      manualRequestInformationExtractor(request)
    );
  }

  if ( isString(additionalMessage) ) {

    em.setMessage(additionalMessage);
  }

  client.sendError(em);
}

function handlerSetup ( client ) {

  return reportManualError.bind(null, client);
}

module.exports = handlerSetup;
