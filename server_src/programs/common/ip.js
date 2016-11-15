( function( e ) {

    var kernel = require( '../../os/kernel.js' ),
        file = require( '../../os/file.js' ),
        proc = require( '../../os/process.js' ),
        link = require( '../../os/network/link.js' ),
        internet = require( '../../os/network/internet.js' ),
        EventEmitter = require( 'events' );
    
    e.CMD = 'ip';
    e.EVENTS = new EventEmitter();
    
    e.EVENTS.on( 'start', function( process, args ) {

        var i = 0;

        for ( var iname in link.system_interfaces( proc.system( process ) ) ) {
            
            var iface = link.system_interface( proc.system( process ), iname );
            
            file.write( proc.outf( process), ( i + 1 ) + ": " + iname + ":\n" );
            file.write( proc.outf( process), "    mac " + link.physical_address( iface ) + "\n" );

            for ( var i in internet.addresses( iface ) ) {

                var address = internet.addresses( iface )[i];

                file.write( proc.outf( process ), "    ip " + address + "\n" );

            }

        }

        proc.stop_process( proc.system( process ), proc.pid( process ) );

    } );
    
}( module.exports ) );
