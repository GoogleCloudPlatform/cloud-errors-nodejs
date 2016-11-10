# Node.js module for Stackdriver Error Reporting

[![Build Status](https://travis-ci.org/GoogleCloudPlatform/cloud-errors-nodejs.svg?branch=master)](https://travis-ci.org/GoogleCloudPlatform/cloud-errors-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/GoogleCloudPlatform/cloud-errors-nodejs/badge.svg?branch=coveralls)](https://coveralls.io/github/GoogleCloudPlatform/cloud-errors-nodejs?branch=coveralls)
[![Dependencies](https://david-dm.org/GoogleCloudPlatform/cloud-errors-nodejs.svg)](https://david-dm.org/GoogleCloudPlatform/cloud-errors-nodejs)

> **This is not an official Google product.** This module is experimental and may not be ready for use.
> This module uses APIs that may be undocumented and are subject to change without notice.

This modules provides Stackdriver Error Reporting support for Node.js applications.
[Stackdriver Error Reporting](https://cloud.google.com/error-reporting/) is a feature of
Google Cloud Platform that allows in-depth monitoring and viewing of errors reported by
applications running in almost any environment. Here's an introductory video:

[![Learn about Error Reporting in Stackdriver](https://img.youtube.com/vi/cVpWVD75Hs8/0.jpg)](https://www.youtube.com/watch?v=cVpWVD75Hs8)

## Prerequisites

1. Your application needs to use Node.js version 0.12 or greater.
1. You need a [Google Cloud project](https://console.cloud.google.com). Your application can run anywhere, but errors are reported to a particular project.
1. [Enable the Stackdriver Error Reporting API](https://console.cloud.google.com/apis/api/clouderrorreporting.googleapis.com/overview) for your project.
1. The module will only send errors when the `NODE_ENV` environment variable is set to `production`.

## Quickstart on Google Cloud Platform

1. **Install the module:**

  In your project, on the command line:

	```shell
	# Install through npm while saving to the local 'package.json'
	npm install --save @google/cloud-errors
	```
1. **Instrument your application:**

	```JS
	// Require the library and initialize the error handler
	var errors = require('@google/cloud-errors').start({
		serviceContext: {service: 'my-service'} // not needed on Google App Engine
	});

	// Report an error to the Stackdriver Error Reporting API
	errors.report(new Error('Something broke!'));
	```

1. **View reported errors:**

  Open Stackdriver Error Reporting at https://console.cloud.google.com/errors to view the reported errors.

## Setup

When initing the Stackdriver Error Reporting library you must specify the following:

* **Authentication**: Use one of the following:
  * **(recommended)** a path to your keyfile in the `GOOGLE_APPLICATION_CREDENTIALS` environment variable,
  * a path to your keyfile in the `keyFilename` argument,
  * an [API key](https://support.google.com/cloud/answer/6158862) string in the `key` argument.
* **projectId**: either using the `GLCOUD_PROJECT` environment variable or the `projectId` argument.
* **service**: either using the `GAE_MODULE_NAME`  environment variable or the `serviceContext.service` argument.

On Google App Engine, these environment variables are already set.

```JS
var errors = require('@google/cloud-errors').start({
	projectId: 'my-project-id',
	key: 'my-api-key',
	reportUncaughtExceptions: false, // defaults to true.
	logLevel: 0, // defaults to logging warnings (2). Available levels: 0-5
	serviceContext: {
		service: 'my-service',
		version: 'my-service-version'
	}
});
```

### Using Express

```JS
var express = require('express');
var app = express();
// Will create a errors instance based off env variables
var errors = require('@google/cloud-errors').start();

app.get('/error', function ( req, res, next ) {
    res.send('Something broke!');
    next(new Error('Custom error message'));
});

app.get('/exception', function () {
    JSON.parse('{\"malformedJson\": true');
});

app.use(errors.express);

app.listen(3000);
```

### Using Hapi

```JS
var hapi = require('hapi');
var errors = require('@google/cloud-errors').start();

var server = new hapi.Server();
server.connection({ port: 3000 });
server.start();

server.route({
  method: 'GET',
  path: '/error',
  handler: function ( request, reply ) {
    throw new Error('Custom error message');
    reply('Something broke!');
  }
});

server.register({ register: errors.hapi });
```

### Using Koa

**Note**: Koa is not supported in Node.js v0.12 unless the `--harmony` flag is enabled.

```JS
var errors = require('@google/cloud-errors').start();
var koa = require('koa');
var app = koa();

app.use(errors.koa);

app.use(function *(next) {
	//This will set status and message
	this.throw('Error Message', 500);
});

// response
app.use(function *(){
	this.body = 'Hello World';
});

app.listen(3000);
```

### Using Restify

```JS
function respond(req, res, next) {
  next(new Error('this is a restify error'));
}

var restify = require('restify');
var errors = require('@google/cloud-errors').start();

var server = restify.createServer();

server.use(errors.restify(server));
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080);
```

## Developing the library

Install the dependencies:

```bash
npm install
```

Add your unit tests to:

```
tests/unit/
```

Run the test suite:

```bash
npm test
```

Run the coverage suite (will also run the test suite):

```bash
npm run-script coverage
```

Run the style checking suite:

```bash
npm run-script style
```

Pre-commit, run the Pre-commit hook to run Clang Formatter *(Must have Clang
	Formatter installed prior to use)*

```bash
git commit
```

*Then commit your changes and make a pull-request*
