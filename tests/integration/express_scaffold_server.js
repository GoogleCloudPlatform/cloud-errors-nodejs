/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var express = require('express');
var app = express();
var errorHandler = require('../../index.js')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post(
  '/testErrorHandling'
  , function ( req, res, next ) {

    if ( !req.body.hasOwnProperty('test')
      || req.body.test !== true ) {

        var err = new Error("Error on Express Integration Test Route");
        res.send("Error");
        res.end();
        return next(err);
    } else {
      res.send("Success");
      res.end();
    }
  }
);

app.use(errorHandler.express);

function throwUncaughtError ( ) {
  console.log("Throwing an uncaught error..");
  throw new Error('This is an uncaught error');
}

function reportManualError ( ) {
  console.log("Reporting a manual error..");
  errorHandler.report(
    new Error("This is a manually reported error")
    , null
    , null
    , function ( ) {

      throwUncaughtError();
    }
  );
}

app.listen(
  3000
  , function ( ) {
    console.log('Scaffold Server has been started on port 3000');
    reportManualError();
  }
);
