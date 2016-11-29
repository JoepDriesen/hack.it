( function( e ) {

    var dev = require( '../../hardware/device.js' ),
        sys = require( '../../hardware/system.js' );

    e.boot = function( kernel, kernel_functions ) {

        kernel.groups = {
            0: [ 'root', null, 0, [ 0 ] ],
        };

        kernel.users = {
            0: [ 'root', null, 0, 0, 'root', '/root', '/bin/bash' ],
        };

        sys.attach_device( 
            kernel_functions.system( kernel ), 
            dev.DEV_NIC, 
            dev.DEV_NIC.create( null, '00:00:00:00:00:00' )
        );

    };

    e.groups = function( kernel ) {

        return kernel.groups;

    };

    e.users = function( kernel ) {

        return kernel.users;

    };

}( module.exports ) )
