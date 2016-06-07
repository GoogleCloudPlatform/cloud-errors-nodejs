var errorClassParsingUtils = require('../errorClassParsingUtils.js');
var ErrorMessage = require('../customClasses/ErrorMessage.js');
var hapiRequestInformationExtractor = require('../requestInformationExtractors/hapiRequestInformationExtractor.js');
var errorHandlerRouter = require('../errorHandlerRouter.js');

Error.prepareStackTrace = errorClassParsingUtils.prepareStackTraceError;

function noOp ( ) {

  return ;
}

function hapiErrorHandler ( req, err ) {

  var em = new ErrorMessage().consumeRequestInformation(
    hapiRequestInformationExtractor(req)
  );

  errorHandlerRouter(err, em);

  return em;
}

function hapiRegisterFunction ( client, server, options, next ) {
  var listener = noOp;

  server.on(
    'request-error'
    , ( req, err ) => {

      var em = hapiErrorHandler(req, err);
      client.sendError(em);
    }
  );

  server.ext(
    "onPreResponse"
    , function ( request, reply ) {

      var em = null;
      if ( request.response.isBoom ) {
        em = hapiErrorHandler(request, new Error(request.response.message));
        client.sendError(em);
      }

      reply.continue();
    }
  );

  return next();
}

function handlerSetup ( client ) {
  var hapiPlugin = {
    register: hapiRegisterFunction.bind(null, client)
  };

  hapiPlugin.register.attributes = {
    name: 'stackdriverErrorReportingPlugin'
    , version: '0.0.1'
  };

  return hapiPlugin;
}

module.exports = handlerSetup;
