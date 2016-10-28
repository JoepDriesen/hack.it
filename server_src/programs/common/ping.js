( function( e ) {

    var linux = require( '../../os/linux.js' ),
        ip = require( 'ip' );

    e.CMD = 'ping';

    e.on_startup = function( system, proc, args, exit_callback ) {

        if ( args.length <= 1 ) {
            
            proc.outf.write( "Usage: ping <destination_ip>\n" );
            linux.quit( system, proc.pid, exit_callback );

            return 1;

        }

        var target = args[1];

        if ( !ip.isV4Format( target ) ) {

            proc.outf.write( "Not a valid ip address: " + target + '\n' );
            linux.quit( system, proc.pid, exit_callback );

            return 1;

        }

        if ( system.network_interfaces.length <= 0 ) {

            proc.outf.write( "No network interfaces found\n" );
            linux.quit( system, proc.pid, exit_callback );

            return 1;

        };

        var interface;
        for ( var i = ( system.network_interfaces.length - 1 ); i>= 0; i++ ) {

            interface = system.network_interfaces[i];

            if ( !net.is_up( interface ) )
                continue;

            if ( interface.subnet.contains( target ) )
                break;

        }

        if ( !interface || !net.is_up( interface ) )
            throw new Error( "No available interface found\n" );


        var conn = net.ip_connect( interface, target );

        proc.outf.write( 'PING ' + args[1] + ' 56(84) bytes of data.\n' );

        var pings = 3,
            count = 0,
            interval = setInterval( function() {

                proc.outf.write( '64 bytes from ' + args[1] + ': icmp_seq=1 ttl=46 time=24.8 ms\n' );
                count++;

                if ( count >= pings ) {

                    clearInterval( interval );
                    
                    proc.outf.write( '--- 8.8.8.8 ping statistics ---\n' );
                    proc.outf.write( '3 packets transmitted, 2 received, 0% packet loss, time 1001ms\n' );
                    proc.outf.write( 'rtt min/avg/max/mdev = 24.856/24.878/24.900/0.022 ms\n' );

                    linux.quit( system, proc.pid, exit_callback );

                }

            }, 1000 );

    };

}( module.exports ) );
