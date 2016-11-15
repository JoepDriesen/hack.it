'use strict';

global.server_dir = __dirname;

var kernel      = require( global.server_dir + '/os/kernel.js' ),
    fs          = require( global.server_dir + '/os/fs.js' ),
    proc        = require( global.server_dir + '/os/process.js' ),

    link        = require( global.server_dir + '/os/network/link.js' ),
    internet    = require( global.server_dir + '/os/network/internet.js' ),

    shell       = require( global.server_dir + '/programs/linux/shell.js' ),
    ip          = require( global.server_dir + '/programs/common/ip.js' ),
    ping          = require( global.server_dir + '/programs/common/ping.js' ),
    
    mainloop    = require( 'mainloop.js' ); 

var system = kernel.create_system(),
    filesystem = fs.create_filesystem();

fs.mount( system, filesystem, '' );
kernel.install( system, shell );
kernel.install( system, ip );
kernel.install( system, ping );

var net = link.create_network();

var int1 = link.add_interface( system, 'eth0' );
link.attach( int1, net );
link.interface_up( int1 );
internet.add_address( int1, '192.168.0.1/24' );

var system2 = kernel.create_system(),
    filesystem = fs.create_filesystem();

fs.mount( system2, filesystem, '' );
kernel.install( system2, shell );
kernel.install( system2, ip );

var int2 = link.add_interface( system2, 'eth0' );
link.attach( int2, net );
link.interface_up( int2 );
internet.add_address( int2, '192.168.0.2/24' );

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

proc.start_process( system, shell, [ shell.CMD ] );


