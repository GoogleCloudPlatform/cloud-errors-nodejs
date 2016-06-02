var express = require('express');
var app = express();
var errorHandler = require('../../index.js');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post(
  '/hello'
  , function ( req, res, next ) {

    console.log("GOT POST");
    if ( !req.body.hasOwnProperty('test')
      || req.body.test !== true ) {
        console.log("REQUEST IS INVALID");
        var j = {};
        j.hasOwnProperty = null;
        return next(j);
        res.send("Error");
        res.end();
    } else {
      res.send("Success");
      res.end();
    }
  }
);

app.use(errorHandler);



app.listen(
  3000
  , function ( ) {
    console.log('Scaffold Server has been started on port 3000');
  }
);
