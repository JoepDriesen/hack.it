( function( e ) {

    var linux = require( '../../os/linux.js' ),
        net = require( '../../os/network.js' ),
        ip = require( 'ip' );

    e.CMD = 'rlogin';

    e.on_startup = function( system, proc, args, exit_callback ) {

        if ( args.length <= 1 ) {

            proc.outf.write( "Usage: rlogin <target_ip>\n" );
            linux.quit( system, proc.pid, exit_callback );

            return 1;

        }

        var target = args[1];

        if ( !ip.isV4Format( target ) ) {

            proc.outf.write( "Not a valid ip address: " + target + '\n' );
            linux.quit( system, proc.pid, exit_callback );

            return 1;

        }

        var conn;

        try {

            conn = 



}( module.exports ) );
