( function( e ) {
    
    e.CMD = 'ip';
    
    e.on_startup = function( system, proc, args ) {
    
        for ( var iname in system.network_interfaces ) {
            
            var int = system.network_interfaces[iname];
            
            proc.outf.write( int.name );
            
        }
    
    };
    
}( module.exports ) );