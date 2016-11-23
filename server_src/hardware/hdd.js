( function ( e ) {
    
    var seedrandom = require( 'seedrandom' ),
        uuid = require( 'uuid' );
    
    e.TYPE = 'hdd';
    
    
    e.create = function( seed, size_gb ) {
        
        return {
            
            type: e,

            identifier: uuid( {
                rng: new Math.seedrandom( seed ),
            } ),
            size: size_gb,
            
        };
        
    };
    
}( module.exports ) );