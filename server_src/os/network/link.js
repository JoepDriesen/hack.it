( function( e ) {

    var ip = require( 'ip' ),
        kernel = require( '../kernel.js' ),
        seedrandom = require( 'seedrandom' );
   

  
    e.add_interface = function( system, iface_name, physical_address ) {

        if ( !system.network_interfaces )
            system.network_interfaces = {};

        if ( !iface_name ) {

            var i = 1;
            while ( system.network_interfaces["eth" + i] )
                i++;

            iface_name = "eth" + i;

        } else if ( system.network_interfaces[iface_name] )
            throw new Error( "Interface already exists: " + iface_name );

        if ( !physical_address )
            physical_address = e.__generate_physical_address();

        var iface = {

            name: iface_name,
            physical_address: physical_address,

            system: system,

            is_up: false,

        };

        system.network_interfaces[iface_name] = iface;

        return iface;

    };

    // TODO: Spoofed MAC address can hijack any connection on attach
    e.attach = function( iface, network ) {

        if ( iface.network )
            throw new Error( "Interface is already attached to network." );
        
        iface.network = network;

        network.hosts[iface.physical_address] = iface;
        
    };

    e.create_network = function() {

        return {
        
            latency: 10 + 10 * ( Math.random() - 0.5 ),

            hosts: {},

        };

    };

    e.dettach = function( iface, network ) {
        
        if ( !network )
            network = iface.network;
        
        if ( network )
            delete network.hosts[iface.physical_address];
         
        iface.network = null;
        
    };

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
    
    e.interface_up = function( iface ) {

        if ( !iface.network )
            throw new Error( "Interface is not attached to any network." );

        iface.is_up = true;
        
    };

    e.interface_down = function( iface ) {
        
        iface.is_up = false;
        
    };

    e.is_up = function( iface ) {

        return iface.is_up;

    };

    e.name = function( iface ) {

        return iface.name;

    };

    e.network = function( iface ) {

        if ( !iface.network )
            return null;

        return iface.network;

    }

    e.network_interface = function( network, physical_address ) {

        return network.hosts[physical_address];

    };

    /*
     * returns: {
     *      physical_address: interface,
     *      ...
     * };
     */
    e.network_interfaces = function( network ) {

        return network.hosts;

    };

    e.network_latency = function( network ) {

        if ( !network.latency )
            return 0;

        return network.latency;

    };

    e.physical_address = function( iface ) {

        return iface.physical_address;

    };

    e.system = function( iface ) {

        return iface.system;

    };

    e.system_interface = function( system, iface_name ) {

        if ( !system.network_interfaces )
            throw new Error( "Interface not found: " + iface_name );

        return system.network_interfaces[iface_name];

    };

    /*
     * returns: {
     *      interface_name: interface,
     *      ...
     * };
     */
    e.system_interfaces = function( system ) {

        if ( !system.network_interfaces )
            return {}

        return system.network_interfaces;

    };

}( module.exports ) );
