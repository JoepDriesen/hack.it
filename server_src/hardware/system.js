( function( e ) {

    var dev = require( './device.js' ),
        seedrandom = require( 'seedrandom' ),
        uuid = require( 'uuid' ),
        world_globals = require( '../world_globals.js' );
    
    
    e.OS_LINUX = 'linux';

    
    e.attach_device = function( system, device ) {
        
        var dev_type = dev.type( device );
        
        if ( !system.devices[dev_type] )
            system.devices[dev_type] = [];
        
        if ( system.devices[dev_type][dev.identifier( device )] )
            return false;
        
        system.devices[dev_type][dev.identifier( device )] = device;
        
        return true;
        
    };
    
    e.create_system = function( seed ) {

        var sys = {

            seed: seed,
            uuid: uuid( new Math.seedrandom( seed ) ),
            
            devices: {},

        };

        world_globals.register_system( sys.uuid, sys );

        return sys;

    };
    
    e.devices = function( system, device_type ) {
        
        return system.devices[device_type];
        
    };
    
    e.remove_device = function( system, device ) {
        
        if ( !system.devices[dev.identifier( device )] )
            return false;
        
        delete system.devices[dev.identifier( device )];
        
        return true;
        
    };
    
    e.uuid = function( system ) {
        
        return system.uuid;
        
    };
    
}( module.exports ) )