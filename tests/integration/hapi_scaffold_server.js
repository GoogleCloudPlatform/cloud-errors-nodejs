var hapi = require('hapi');
var myPlugin = require('../../src/hapi.js');

var server = new hapi.Server();
server.connection({ port: 3000 });



server.start(
  ( err ) => {

    if ( err ) {

      throw err;
    }

    console.log(
      'Server running at'
      , server.info.uri
    );
  }
);

server.route({
  method: 'GET'
  , path: '/get'
  , handler: function ( request, reply ) {

    console.log("Got a GET");
    throw new Error("an error");
    reply('hello there!');
  }
});

server.route({
  method: 'POST'
  , path: '/post'
  , handler: function ( request, reply ) {

    console.log("Got a POST", request.payload);

    reply('Got your post');
    // throw new Error("an error");
    // reply('hello '+encodeURIComponent(request.params.name)+'!');
  }
});


server.register(
  { register: myPlugin }
  , ( err ) => {

    if ( err ) {

      console.error("There was an error in registering the plugin", err);
    }
  }
);
