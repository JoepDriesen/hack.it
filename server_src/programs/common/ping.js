( function( e ) {

    var linux = require( '../../os/linux.js' ),
        net = require( '../../os/network.js' ),
        ip = require( 'ip' );

    e.CMD = 'ping';

    e.on_startup = function( system, proc, args, exit_callback ) {

        if ( args.length <= 1 ) {
            
            proc.outf.write( "Usage: ping <target_ip>\n" );
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
            
            conn = net.ip_connect( Object.keys( system.network_interfaces ).map( function( iname ) {
                return system.network_interfaces[iname];
            } ).sort( function( iface ) { return iface.name; } ), target );
            
        } catch ( err ) {
            
            proc.outf.write( "connect: " + err.message + '\n' );
            linux.quit( system, proc.pid, exit_callback );
            
            return 1;
            
        }

        proc.outf.write( 'PING ' + target + ' 56(84) bytes of data.\n' );

        var pings = 3,
            count = 0,
            success = 0,
            interval = setInterval( function() {
                
                if ( conn ) {
                    
                    var lat = conn.latency();

                    proc.outf.write( '64 bytes from ' + target + ': time=' + lat.toFixed( 1 ) + ' ms\n' );
                    success++;
                    
                } else
                    proc.outf.write( 'From ' + target + ' Destination Host Unreachable\n' );
                count++;

                if ( count >= pings ) {

                    clearInterval( interval );
                    
                    rate = ( 100 * ( count - success ) / count ).toFixed( 0 );
                    
                    proc.outf.write( '--- ' + target + ' ping statistics ---\n' );
                    proc.outf.write( count + ' packets transmitted, ' + success + ' received, ' + rate + '% packet loss\n' );

                    linux.quit( system, proc.pid, exit_callback );

                }

            }, 1000 );

    };

}( module.exports ) );
