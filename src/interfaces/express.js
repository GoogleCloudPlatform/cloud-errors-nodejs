var ErrorMessage = require('../customClasses/ErrorMessage.js');
var expressRequestInformationExtractor = require('../requestInformationExtractors/expressRequestInformationExtractor.js');
var errorHandlerRouter = require('../errorHandlerRouter.js');

/**
 * The Express Error Handler function is an interface for the error handler
 * stack into the Express architecture. This function accepts four arguments:
 * a bound reference to a client which should be given by the proceeding
 * handlerSetup function, an error argument which can be of any type, an
 * express request object, an express response object and the express next
 * function for passing input up the plugin chain.
 * @function expressErrorHandler
 * @param {AuthClient} client - a bound and inited Auth Client instance
 * @param {Object} config - the environmental configuration
 * @param {Any} err - a error of some type propagated by the express plugin
 *  stack
 * @param {Object} req - an Express request object
 * @param {Object} res - an Express response object
 * @param {Function} next - an Express continuation callback
 */
function expressErrorHandler ( client, config, err, req, res, next ) {
  var em = new ErrorMessage()
    .consumeRequestInformation(expressRequestInformationExtractor(req))
    .setServiceContext(
      config.serviceContext.service
      , config.serviceContext.version
    );

  errorHandlerRouter(err, em);

  client.sendError(em);
  next(err);
}

/**
 * The handler setup function simply provides a bound reference to the express
 * error handler function with the first argument as a bound reference to an
 * inited API client for sending information back to the Google Error Reporting
 * API and the second argument as the gathered environmental configuration.
 * @function handlerSetup
 * @param {AuthClient} client - an inited Auth Client instance
 * @param {config} Object - the environmental configuration
 * @returns {expressErrorHandler} - a bound instance of the handler function
 *  with no bound context but one bound argument which is the client instance.
 */
function handlerSetup ( client, config ) {

  return expressErrorHandler.bind(null, client, config);
}

module.exports = handlerSetup;
