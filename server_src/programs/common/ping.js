( function( e ) {

    var kernel = require( '../../os/kernel.js' ),
        file = require( '../../os/file.js' ),
        proc = require( '../../os/process.js' ),
        internet = require( '../../os/network/internet.js' ),
        ip = require( 'ip' ),
        EventEmitter = require( 'events' );

    e.CMD = 'ping';
    e.EVENTS = new EventEmitter();

    e.EVENTS.on( 'start', function( process, args ) {

        if ( args.length <= 1 ) {
            
            file.write( proc.outf( process), "Usage: ping <target_ip>\n" );

            proc.stop_process( proc.system( process ), proc.pid( process ) );
            return 1;

        }

        var target = args[1];

        if ( !ip.isV4Format( target ) ) {

            proc.outf.write( "Not a valid ip address: " + target + '\n' );

            proc.stop_process( proc.system( process ), proc.pid( process ) );
            return 1;

        }

        var ip_route;
        
        try {
            
           var route = internet.ip_routing( proc.system( process ), target );

        } catch ( err ) {
            
            file.write( proc.outf( process ), "connect: " + err.message + '\n' );
            
            proc.stop_process( proc.system( process ), proc.pid( process ) );
            return 1;
            
        }

        file.write( proc.outf( process ), "PING " + target + " 56(84) bytes of data.\n" );

        var pings = 3,
            count = 0,
            success = 0,
            interval = setInterval( function() {
                
                if ( ip_route ) {


                    
                    var lat = ip_route.latency();

                    file.write( proc.outf( process ), "64 bytes from " + target + ': time=' + lat.toFixed( 1 ) + ' ms\n' );
                    success++;
                    
                } else
                    file.write( proc.outf( process ), "From " + target + " Destination Host Unreachable\n" );
                count++;

                if ( count >= pings ) {

                    clearInterval( interval );
                    
                    rate = ( 100 * ( count - success ) / count ).toFixed( 0 );
                    
                    file.write( proc.outf( process ), "--- " + target + ' ping statistics ---\n' );
                    file.write( proc.outf( process ), count + " packets transmitted, " + success + ' received, ' + rate + '% packet loss\n' );

                    proc.stop_process( proc.system( process ), proc.pid( process ) );

                }

            }, 1000 );

    } );

}( module.exports ) );
