# Node.js module for Stackdriver Error Reporting

[![Coverage Status](https://coveralls.io/repos/github/GoogleCloudPlatform/cloud-errors-nodejs/badge.svg?branch=coveralls)](https://coveralls.io/github/GoogleCloudPlatform/cloud-errors-nodejs?branch=coveralls)

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
	var errorHandler = require('@google/cloud-errors')({
		serviceContext: {service: 'my-service'}	// not needed on Google App Engine
	});
	
	// Report an error to the Stackdriver Error Reporting API
	errorHandler.report('Somethign broke!');
	```

1. **View reported errors:**

  Open Stackdriver Error Reporting at https://console.cloud.google.com/errors to view the reported errors. 

## Setup

When initing the Stackdriver Error Reporting library you must specify the following:

* **Authentication**: either using a path to your keyfile in the `GOOGLE_APPLICATION_CREDENTIALS` environment variable, or using a path to your keyfile in the `keyFilename` argument or using an [API key](https://support.google.com/cloud/answer/6158862) string in the `key` argument.
* **projectId**: either using the `GLCOUD_PROJECT` environment variable or the `projectId` argument.
* **service**: either using the `GAE_MODULE_NAME`  environment variable or the `serviceContext.service` argument.

On Google App Engine, these environment variables are already set.

```JS
var errorHandler = require('@google/cloud-errors')({
	projectId: 'my-project-id',
	key: 'my-api-key',
	keyFilename: 'path-to-my-keyfile'
	onUncaughtException: 'report', // or 'ignore' or 'reportAndExit'
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
var errorHandler = require('@google/cloud-errors')();

app.get(
  '/errorRoute',
  function ( req, res, next ) {
    // You can push in errors manually
    res.send("Error");
    res.end();
    next(new Error("Got traffic on the errorRoute"));
  }
);

app.get(
  '/anotherRoute',
  function ( req, res, next ) {
    // It'll even log potentially unexpected errors
    JSON.parse("{\"malformedJson\": true");
  }
)

// Just use the express plugin
app.use(errorHandler.express);

app.listen(
  3000
  , function ( ) {
    console.log('Server has been started on port 3000');
  }
);
```

### Using Hapi

```JS
var hapi = require('hapi');
var errorHandler = require('@google/cloud-errors')();

var server = new hapi.Server();
server.connection({ port: 3000 });

server.start(
  ( err ) => {

    if ( err ) {

      throw err;
    }

    console.log(
      'Server running at',
      server.info.uri
    );
  }
);

server.route({
  method: 'GET',
  path: '/errorRoute',
  handler: function ( request, reply ) {

    throw new Error("an error");
    reply('Error');
  }
});

// Just add in the error handler to your app
server.register(
  { register: errorHandler.hapi },
  ( err ) => {

    if ( err ) {

      console.error("There was an error in registering the plugin", err);
    }
  }
);
```

### Using Koa

```JS
	var errorHandler = require('@google/cloud-errors')();
	var koa = require('koa');
	var app = koa();

	app.use(errorHandler.koa);

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
	var errorHandler = require('@google/cloud-errors')();

	var server = restify.createServer();

	server.use(errorHandler.restify(server));
	server.get('/hello/:name', respond);
	server.head('/hello/:name', respond);

	server.listen(8080, function() {
	  console.log('%s listening at %s', server.name, server.url);
	});
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
