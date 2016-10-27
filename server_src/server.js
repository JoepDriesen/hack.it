'use strict';

global.server_dir = __dirname;

var linux       = require( global.server_dir + '/os/linux.js' ),
    net          = require( global.server_dir + '/os/network.js' ),
    shell       = require( global.server_dir + '/programs/linux/shell.js' ),
    mainloop    = require( 'mainloop.js' ); 

var network = net.create_network();

var system = linux.create_system();
var int = linux.add_interface( system, 'eth0' );
net.connect( int, network );
net.interface_up_static( int, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );

linux.boot( system );
linux.install( system, shell );

// Setup STDIN
var stdin = process.openStdin();

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

var shell_process = linux.run( system, shell, stdin, process.stdout, process.stderr );

