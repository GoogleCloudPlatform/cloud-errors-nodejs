var errorHandler = require('../../index.js')({
  onUncaughtException: 'report'
});
var koa = require('koa');
var app = koa();

app.use(errorHandler.koa);

app.use(function *(next) {
  //This will set status and message
  this.throw('Error Message', 500);
});


app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
