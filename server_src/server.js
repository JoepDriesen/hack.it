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

var system = kernel.create_system( 'testbox' ),
    filesystem = fs.create_filesystem();

fs.mount( system, filesystem, '' );
kernel.install( system, shell );
kernel.install( system, ip );
kernel.install( system, ping );

var int_net1 = link.create_network();
var net = link.create_network();

var int1_1 = link.add_interface( system, 'lo', '00:00:00:00:00:00' );
link.attach( int1_1, int_net1 );
link.interface_up( int1_1 );
internet.add_address( int1_1, '127.0.0.1/8' );

var int1_2 = link.add_interface( system, 'eth0' );
link.attach( int1_2, net );
link.interface_up( int1_2 );
internet.add_address( int1_2, '192.168.0.1/24' );

var system2 = kernel.create_system( 'hackbox' ),
    filesystem = fs.create_filesystem();

fs.mount( system2, filesystem, '' );
kernel.install( system2, shell );
kernel.install( system2, ip );

var int_net2 = link.create_network();

var int2_1 = link.add_interface( system2, 'lo', '00:00:00:00:00:00' );
link.attach( int2_1, int_net2 );
link.interface_up( int2_1 );
internet.add_address( int2_1, '127.0.0.1/8' );

var int2_2 = link.add_interface( system2, 'eth0' );
link.attach( int2_2, net );
link.interface_up( int2_2 );
internet.add_address( int2_2, '192.168.0.2/24' );

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

proc.start_process( system, shell, [ shell.CMD ] );


