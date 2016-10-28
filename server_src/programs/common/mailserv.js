( function( e ) {
    
    var net = require( './network.js' );
    
    e.CMD = 'mailserv';
    
    e.on_startup = function( system, proc, args, exit_callback ) {
        
        proc.outf.write( "Usage: service start mailserv" );
        linux.quit( system, proc.pid, exit_callback );
        
        return 1;
        
    };
    
    e.on_service_start = function( system, proc ) {
        
        for ( var i in system.network_interfaces ) {
            
            if ( net.is_reserved( system.network_interfaces[i], 25 ) ) {
                
                proc.outf.write( "Service startup failed: port 25 is already in use" );
                linux.quit_service( system, e );
                
                return 1;
                
            }
                
            try {

                net.listen_port( interface, 80 )
            
        }
        
    };
    
    e.on_service_stop = function( system, proc ) {
        
    };
    
    
    
}( module.exports ) );