'use strict';

global.server_dir = __dirname;

var linux       = require( global.server_dir + '/os/linux.js' ),
    shell       = require( global.server_dir + '/programs/linux/shell.js' ),
    mainloop    = require( 'mainloop.js' ); 

var system = linux.create_system();
linux.boot( system );
linux.install( system, shell );

// Setup STDIN
var stdin = process.openStdin();

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

var shell_process = linux.run( system, shell, stdin, process.stdout, process.stderr );

