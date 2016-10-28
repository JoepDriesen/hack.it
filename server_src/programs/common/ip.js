( function( e ) {

    var linux = require( '../../os/linux.js' );
    
    e.CMD = 'ip';
    
    e.on_startup = function( system, proc, args, exit_callback ) {

        var i = 0;

        proc.outf.write( 'Network Interfaces:\n\n' );
    
        for ( var iname in system.network_interfaces ) {
            
            var int = system.network_interfaces[iname];
            
            proc.outf.write( i + ": " + int.name + ":\n" );
            proc.outf.write( "  ip:               " + int.ip + "\n" );
            proc.outf.write( "  subnet:           " + int.subnet.networkAddress + "/" + int.subnet.subnetMaskLength + "\n" );
            proc.outf.write( "  default gateway:  " + int.default_gateway + "\n" );
            
        }

        proc.outf.write( '\n' );

        linux.quit( system, proc.pid, exit_callback );
    
    };
    
}( module.exports ) );
