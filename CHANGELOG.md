# Node.js Agent for Google Cloud Errors ChangeLog

## 2017-05-12, Version 0.1.2 (Deprecated), @dominickramer

This module has been renamed to [@google-cloud/error-reporting](https://www.npmjs.com/package/@google-cloud/error-reporting).
No more releases will be made with the old module name.

The renamed module contains a number of semver-major and semver-minor changes:
* Semver-major:
  * The `start` method is no longer used when requiring the module.  Instead, the renamed module exports a constructor.  See the
    [Quick Start](https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/packages/error-reporting/README.md#quick-start)
    section of the @google-cloud/error-reporting module's README for more information.
  * `uncaughtExceptions` need to be caught manually.  See the
    [Catching and Reporting Application-wide Uncaught Errors](https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/packages/error-reporting/README.md#catching-and-reporting-application-wide-uncaught-errors) section of the @google-cloud/error-reporting module's README for more information.
* Semver-minor:
  * A new `event` method exists that can be used to build custom error messages using the builder pattern.  See the
    [Reporting Manually](https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/packages/error-reporting/README.md#reporting-manually)
    section of the @google-cloud/error-reporting module's README for more information.
  * If a function is running on [Google Cloud Functions](https://cloud.google.com/functions/), and the `serviceContext.service` has
    not been manually specified, the function's name will be used as the `service` that will be displayed in the Stackdriver Error
    Reporting console.  See the
    [Configuration](https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/packages/error-reporting/README.md#configuration)
    section of the @google-cloud/error-reporting module's README for more information on configuring the module.

## 2016-10-03, Version 0.1.0 (Experimental), @matthewloring

### Notable changes

**configuration**:

  * [[`4d25c759cd`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/4d25c759cd)] - Update uncaught handler to terminate on timeout #35 (#50) (Cristian Cavalli) 
  * [[`82b78614f5`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/82b78614f5)] - Remove anonymous function invocation on import and create start method (#44) (Cristian Cavalli) 

### Commits

* [[`16e15a08bc`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/16e15a08bc)] - Update diagnostics common (#60) (Matthew Loring) [#60](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/pull/60)
* [[`bc03aebd78`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/bc03aebd78)] - Add tests for restify interface (#58) (Cristian Cavalli) 
* [[`22fa09a2e0`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/22fa09a2e0)] - Update testUncaught.js with env detection (#57) (Cristian Cavalli) 
* [[`be4b47b385`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/be4b47b385)] - Add log-level option to runtime configuration #51 (#54) (Cristian Cavalli) 
* [[`6b113f3db7`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/6b113f3db7)] - Update defaults for service context on Error Message #52 (#53) (Cristian Cavalli) 
* [[`4d25c759cd`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/4d25c759cd)] - Update uncaught handler to terminate on timeout #35 (#50) (Cristian Cavalli) 
* [[`e3c527a03c`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/e3c527a03c)] - Add the Common Diagnostics Logger to Errors (#43) (Cristian Cavalli) 
* [[`53b7b5225c`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/53b7b5225c)] - Remove keyfile option from configuration (#49) (Cristian Cavalli) 
* [[`82b78614f5`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/82b78614f5)] - Remove anonymous function invocation on import and create start method (#44) (Cristian Cavalli) 
* [[`31b24f7580`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/31b24f7580)] - New configuration flow (#36) (Cristian Cavalli) 
* [[`04b1c8367a`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/04b1c8367a)] - add tests and fix arguments for manual report (#47) (Ali Ijaz Sheikh) 
* [[`4a3896d05a`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/4a3896d05a)] - Avoid using bind in various handlers (#46) (Ali Ijaz Sheikh) 
* [[`be6576f90d`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/be6576f90d)] - Minor README and package.json fixes (#45) (Ali Ijaz Sheikh) 
* [[`6ae1f38821`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/6ae1f38821)] - Update example text (#42) (Cristian Cavalli) 
* [[`cba91ddea9`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/cba91ddea9)] - Fix test quickstart instructions in README (Steren) 
* [[`404c72bbf4`](https://github.com/GoogleCloudPlatform/cloud-errors-nodejs/commit/404c72bbf4)] - README update reportUncaughtExceptions (Steren) 
