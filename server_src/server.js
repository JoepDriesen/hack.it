'use strict';

global.server_dir = __dirname;

var kernel      = require( global.server_dir + '/os/kernel.js' ),
    shell       = require( global.server_dir + '/programs/linux/shell.js' ),
    mainloop    = require( 'mainloop.js' ); 

var system = kernel.create_system();
kernel.boot( system );
kernel.install( system, shell );

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

var start_shell = function() {

    kernel.run( system, shell, process.stdin, process.stdout, process.stderr, [], start_shell );

};
start_shell();
