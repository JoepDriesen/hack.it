( function( e ) {

    var kernel = require( '../kernel.js' ),
        linux_link = require( '../linux/network/link.js' );
   

  
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

    e.dettach = function( iface ) {
        
        if ( !iface.network )
            return false;
        
        delete iface.network.hosts[iface.physical_address];
         
        iface.network = null;
        
    };
    
    e.interface_up = function( iface ) {

        if ( !iface.network )
            throw new Error( "Interface is not attached to any network." );

        iface.is_up = true;
        
    };

    e.interface_down = function( iface ) {
        
        iface.is_up = false;
        
    };
    
    e.is_up = function( nic, is_up ) {

        return iface.is_up;

    };

    e.name = function( nic, name ) {

        return iface.name;

    };

    e.network = function( nic, network ) {

        return nic.network;

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

    e.physical_address = function( nic, physical_address ) {

        return nic.physical_address;

    };

    e.system = function( iface ) {

        return iface.system;

    };

    e.system_interface = function( system, iface_name ) {

        if ( !e._system_link( system ).network_interfaces( system )[iface_name] )
            throw new Error( "Interface not found: " + iface_name );

        return e._system_link( system ).network_interfaces( system )[iface_name];

    };

    /*
     * returns: {
     *      interface_name: interface,
     *      ...
     * };
     */
    e.system_interfaces = function( system ) {

        return e._system_link( system ).network_interfaces( system );

    };

}( module.exports ) )
