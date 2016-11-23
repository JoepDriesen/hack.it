( function( e ) {
    
    // Hard Disk Drive device
    e.DEV_HDD = require( './hdd.js' ),
    // Network Interface Card device
    e.DEV_NIC = require( './nic.js' ),
    
    
    e.identifier = function( device ) {
        
        return device.identifier;
        
    };
    
    e.type = function( device ) {
        
        return device.type;
        
    };
    
}( module.exports ) )