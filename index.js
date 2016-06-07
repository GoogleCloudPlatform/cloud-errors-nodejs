var isObject = require('./src/typeCheckers/isObject.js');
var isString = require('./src/typeCheckers/isString.js');
var isNull = require('./src/typeCheckers/isNull.js');
var uncaughtHandlingOptions = require('./src/constants/uncaughtHandlingOptions.js');
var extractKeyFromKeyfile = require('./src/utils/extractKeyFromKeyfile.js');
var AuthClient = require('./src/googleApis/AuthClient.js');

function attemptToExtractProjectIdFromEnv ( ) {

  if ( isString(process.env.GCLOUD_PROJECT) ) {

    return process.env.GCLOUD_PROJECT;
  }

  console.log("WARNING: Unable to find project id in configuration or env");

  return null;
}

function attemptToExtractServiceContextFromConfiguration ( initConfiguration ) {

  if ( initConfiguration.hasOwnProperty('serviceContext') ) {

    return initConfiguration.serviceContext;
  }

  return {
    service: 'my-service'
    , version: 'alpha1'
  };
}

function attemptToExtractExceptionHandlingFromConfiguration ( initConfiguration ) {

  if ( initConfiguration.hasOwnProperty('onUncaughtException')
    && uncaughtHandlingOptions.hasOwnProperty(initConfiguration.onUncaughtException) ) {

    return initConfiguration.onUncaughtException;
  }

  return uncaughtHandlingOptions.ignore;
}

function attemptToExtractProjectIdFromConfiguration ( initConfiguration ) {

  if ( initConfiguration.hasOwnProperty('projectId') ) {

    return initConfiguration.projectId;
  }

  return attemptToExtractProjectIdFromEnv();
}

function determineReportingEnv ( ) {

  return process.env.NODE_ENV === "production";
}

function gatherConfiguration ( initConfiguration ) {

  var projectId = null;
  var onUncaughtException = null;
  var serviceContext = null;
  var shouldReportErrorsToAPI = determineReportingEnv();

  if ( isObject( initConfiguration ) ) {

    projectId = attemptToExtractProjectIdFromConfiguration(initConfiguration);
    onUncaughtException = attemptToExtractExceptionHandlingFromConfiguration(initConfiguration);
    serviceContext = attemptToExtractServiceContextFromConfiguration(initConfiguration);
  } else {

    projectId = attemptToExtractProjectIdFromEnv();
    onUncaughtException = uncaughtHandlingOptions.ignore;
  }

  return {
    projectId: projectId
    , onUncaughtException: onUncaughtException
    , serviceContext: serviceContext
    , shouldReportErrorsToAPI: shouldReportErrorsToAPI
  };
}

module.exports = function ( initConfiguration ) {

  var config = gatherConfiguration(initConfiguration);
  var client = new AuthClient(
    initConfiguration.projectId
    , initConfiguration.shouldReportErrorsToAPI
  );


  return ({
    hapi: require('./src/interfaces/hapi.js')(client)
    , express: require('./src/interfaces/express.js')(client)
    , report: require('./src/interfaces/manual.js')(client)
  });
};
