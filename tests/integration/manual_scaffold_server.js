var errors = require('../../index.js')();
var r = errors.report('Sample string', (err, result) => {
  console.log('callback from report', err, result);
});

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
