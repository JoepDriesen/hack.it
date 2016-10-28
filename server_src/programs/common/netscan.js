( function( e ) {
    
    var linux = require( '../../os/linux.js' ),
        net = require( '../../os/network.js' ),
        ip = require( 'ip' );
    
    e.CMD = 'netscan';
    
    e.on_startup = function( system, proc, args, exit_callback ) {
        
        if ( args.length <= 1 ) {
            
            proc.outf.write( "Usage: netscan <network_cidr>\n" );
            linux.quit( system, proc.pid, exit_callback );
            
            return 1;
            
        }
        
        try {
        
            var subnet = ip.cidrSubnet( args[1] );
            
        } catch ( err ) {
            
            proc.outf.write( "Error: " + err.message + '\n' );
            linux.quit( system, proc.pid, exit_callback );
            
            return 1;
            
        }
        
        proc.outf.write( "Starting netscan: \n\n" );
        
        var first = ip.toLong( subnet.firstAddress ),
            interfaces = Object.keys( system.network_interfaces ).map( function( iname ) {
            return system.network_interfaces[iname];
        } ).sort( function( iface ) { return iface.name; } ),
            scanned = 0,
            found = 0;
        
        var i = 0;
        var interval = setInterval( function() {
            
            if ( i >= subnet.numHosts ) {
                
                clearInterval( interval );
        
                proc.outf.write( "\nNetscan done: " + scanned + " IP addresses (" + found + " hosts up) scanned.\n" );
                linux.quit( system, proc.pid, exit_callback );
                
                return 0;
                
            }
            
            var addr = ip.fromLong( first + i );
            
            try {
                var conn = net.ip_connect( interfaces, addr );
            } catch ( err ) {}
            
            scanned++;
            
            if ( conn ) {
                
                found++;
                proc.outf.write( "Host is up: " + addr + '\n' );
                
            }
            
            i++;
            
        }, 30);
        
    };
    
}( module.exports ) );