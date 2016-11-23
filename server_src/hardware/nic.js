( function( e ) {
    
    var seedrandom = require( 'seedrandom' );
    
    
    e.__MAC_SYMBOLS = '0123456789ABCDEF';
    e.__generate_physical_address = function( seed ) {

        var rng = new Math.seedrandom( seed );
        var addr = '';

        for ( var i = 0; i < 12; i++ ) {

            if ( i > 0 && i % 2 == 0 )
                addr += ':';

            addr += e.__MAC_SYMBOLS[Math.floor( rng( seed ) * e.__MAC_SYMBOLS.length )];
        
        }

        return addr;

    };
    
    e.create = function( seed ) {
        
        var mac = e.__generate_physical_address( seed );
        
        return {
            
            type: 'nic',
            
            identifier: mac,
            mac: mac,
            
        };
        
    };
    
}( module.exports ) )