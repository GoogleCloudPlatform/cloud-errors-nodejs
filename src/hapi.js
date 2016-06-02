var errorClassParsingUtils = require('./errorClassParsingUtils.js');
var ErrorMessage = require('./ErrorMessage.js');
var hapiRequestInformationExtractor = require('./requestInformationExtractors/hapiRequestInformationExtractor.js');
var errorHandlerRouter = require('./errorHandlerRouter.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function noOp ( ) {

  return ;
}

function hapiErrorHandler ( req, err ) {

  var em = new ErrorMessage().consumeRequestInformation(
    hapiRequestInformationExtractor(req)
  );

  errorHandlerRouter(err, em);

  console.log("here is the error message", em);
}

var hapiPlugin = {
  register: function ( server, options, next ) {

    var listener = noOp;

    server.on(
      'request-error'
      , hapiErrorHandler
    );

    server.ext(
      "onPreResponse"
      , function ( request, reply ) {

        if ( request.response.isBoom ) {
          hapiErrorHandler(request, new Error(request.response.message));
        }

        reply.continue();
      }
    );

    return next();
  }
};

hapiPlugin.register.attributes = {
  name: 'stackdriverErrorReportingPlugin'
  , version: '0.0.1'
};

module.exports = hapiPlugin;
