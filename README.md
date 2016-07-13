# Node.JS Error Reporting Agent For Stackdriver

> **This is not an official Google product.** This module is experimental and may not be ready for use.
> This module uses APIs that may be undocumented and are subject to change without notice.

This modules provides Stackdriver Error Reporting support for Node.JS applications.
[Stackdriver Error Reporting](https://cloud.google.com/error-reporting/) is a feature of
Google Cloud Platform that allows in-depth monitoring and viewing of errors reported by
applications running in almost any environment. Here's an introductory video:

[![Learn about Error Reporting in Stackdriver](https://img.youtube.com/vi/AUW4ZEhhk_w/0.jpg)](https://youtu.be/AUW4ZEhhk_w?t=24m26s)

## Prerequisites

* Your application will need to be using Node.JS version 0.12 or greater. Node.JS v5+ is recommended.

## Quickstart (Node.JS v4.x+)

1. **Enable the Error Reporting API for your project:**

  [Enable the Error Reporting API here](https://console.cloud.google.com/apis/api/clouderrorreporting.googleapis.com/overview)

2. **Create an API key:**

  (This authentication step is not needed if you run on Google Cloud Platform)

  Follow [these instructions](https://support.google.com/cloud/answer/6158857) to get an API key for your project.


3. **Install the module:**

  In your project, on the command line:

	```shell
	# Install through npm while saving to the local 'package.json'
	npm install --save @google/cloud-errors
	```

4. **Instrument your application:**

	```JS
	// Require the library and initialize the error handler
	var errorHandler = require('@google/cloud-errors')({
		projectId: 'my-project-id',	// not needed on Google Cloud Platform
		key: 'my-api-key',		// not needed on Google Cloud Platform
		serviceContext: {		// not needed on Google App Engine
			service: 'my-service',
			version: 'alpha1'
		}
	});

	// Report an error to the StackDriver API
	errorHandler.report(new Error('This is a test'));
	```

5. **View reported errors:**

  Open Stackdriver Error Reporting at https://console.cloud.google.com/errors to view the reported errors. 

## Setup

When initing the Stackdriver Error reporting library you can specify several options

	```JS
	var errorHandler = require('@google/cloud-errors')({
		projectId: 'my-project-id',
		key: 'my-optional-api-key',
		onUncaughtException: 'report',
		serviceContext: {
			service: 'my-service',
			version: 'alpha1'
		}
	});
	```

Configure the error handling library to handle uncaught exceptions in serveral different ways:

	```JS
	{  // Ignore all uncaught errors, this is the default behavior
		onUncaughtException: 'ignore'
	}
	
	{ // Report all uncaught errors and do not forcefully exit
		onUncaughtException: 'report'
	}
	
	{ // Report any uncaught error and then attempt to exit after
		onUncaughtException: 'reportAndExit'
	}
	```

> All initialization arguments are optional but please be aware that to report errors to the service
> one must specify a projectId either through the `GLCOUD_PROJECT` environment variable or through the
> Javascript interface while developing locally. One must also specify a key through
> the Javascript interface or through the `GOOGLE_APPLICATION_CREDENTIALS` environment variable which
> should contain a path to the keyfile while developing locally.

### Using Express

	```JS
	var express = require('express');
	var app = express();
	var errorHandler = require('@google/cloud-errors')({
	  projectId: "my-project-id"
	});

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
	var errorHandler = require('@google/cloud-errors')({
	  projectId: 'my-project-id'
	});

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
		var errorHandler = require('@google/cloud-errors')({
			projectId: 'my-project-id'
		});
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
		var errorHandler = require('@google/cloud-errors')({
			projectId: 'my-project-id'
		});

		var server = restify.createServer();

		server.use(errorHandler.restify(server));
		server.get('/hello/:name', respond);
		server.head('/hello/:name', respond);

		server.listen(8080, function() {
		  console.log('%s listening at %s', server.name, server.url);
		});
	```

## Developing Locally

1. Specify you project-id and key either through environment variables or through the application interface:

	* Via environment variables:

		```bash
			> export GLCOUD_PROJECT=<YOUR_PROJECT_ID>

			> export GOOGLE_APPLICATION_CREDENTIALS=<path/to/your/keyfile.json>

			> node myApp.js
		```

	* Via the javascript interface:

		```JS
		var errorHandler = require('@google/cloud-errors')({
			projectId: 'your-project-id',
			key: 'your-api-key'
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
