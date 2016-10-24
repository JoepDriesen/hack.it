'use strict';

global.server_dir = __dirname;

var linux       = require( global.server_dir + '/os/linux.js' ),
    mainloop    = require( 'mainloop.js' ); 

var system = linux.create_system();
linux.boot( system );

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );
