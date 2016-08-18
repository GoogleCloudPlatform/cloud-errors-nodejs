var logger = require('@google/cloud-diagnostics-common').logger;
var logConfig = process.env.GCLOUD_ERRORS_LOGLEVEL;
var logLevel = !isNaN(logConfig) ? logConfig : logger.WARN;
module.exports = logger.create(logLevel, '@google/cloud-errors');
