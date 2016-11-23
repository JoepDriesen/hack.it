'use strict';

global.server_dir = __dirname;

var dev         = require( global.server_dir + '/hardware/device.js' ),
    sys         = require( global.server_dir + '/hardware/system.js' ),
    kern        = require( global.server_dir + '/kernel/kernel.js' ),
    fs          = require( global.server_dir + '/kernel/fs.js' ),
    proc        = require( global.server_dir + '/kernel/process.js' ),

    link        = require( global.server_dir + '/kernel/network/link.js' ),
    internet    = require( global.server_dir + '/kernel/network/internet.js' ),

    shell       = require( global.server_dir + '/programs/linux/shell.js' ),
    
    mainloop    = require( 'mainloop.js' );

function system_config( num, os, hdd_size, nic_count ) {
   
    var system = sys.create_system( num );
    
    var root_partition = dev.DEV_HDD.create( hdd_size );
    sys.attach_device( system, dev.DEV_HDD, root_partition );
        
    for ( var i = 0; i < nic_count; i++ )
        sys.attach_device( system, dev.DEV_NIC, dev.DEV_NIC.create( system.uuid + i ) );
    
    var kernel = kern.boot( system, root_partition, os );
    
    return kernel;
    
}


var kernel = system_config( 1, sys.OS_LINUX, 100, 1 );

kern.install( kernel, shell );

//var int_net1 = link.create_network();

/**
var system2 = kernel.create_system( kernel.OS_LINUX, 'hackbox' ),
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
*/

mainloop.start();

console.log( ':: Server\t:: Server startup complete.' );

proc.start_process( kernel, shell, [ shell.CMD ] );


