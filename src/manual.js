var errorClassParsingUtils = require('./errorClassParsingUtils.js');
var ErrorMessage = require('./ErrorMessage.js');
var manualRequestInformationExtractor = require('./requestInformationExtractors/manualRequestInformationExtractor');
var errorHandlerRouter = require('./errorHandlerRouter.js');
var isString = require('./typeCheckers/isString.js');
var isObject = require('./typeCheckers/isObject.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function reportManualError ( err, request, additionalMessage ) {

  var em = new ErrorMessage();

  if ( isObject(request) ) {

    em.consumeRequestInformation(
      manualRequestInformationExtractor(request)
    );
  }

  if ( isString(additionalMessage) ) {

    em.setMessage(additionalMessage);
  }

  console.log("here is the error message", em);
}

module.exports = reportManualError;
