/**
 * Enum for uncaught handling options set on the process. Given `ignore` library
 * will not attempt to handle or log uncaught errors, given `report` the library
 * will capture and attempt to report these errors to the Error Reporting API
 * and will attempt to prevent the error from closing the process. Given
 * `reportAndExit` the library will report an uncaught error to the Error
 * Reporting API and then attempt to close the process.
 * @name uncaughtHandlingEnum
 * @readonly
 * @enum {String}
 */
var uncaughtHandlingEnum = {
  ignore: 'ignore'
  , report: 'report'
  , reportAndExit: 'reportAndExit'
};

module.exports = uncaughtHandlingEnum;
