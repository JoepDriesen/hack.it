( function( e ) {

    var kernel = require( '../kernel.js' ),
        linux_link = require( '../linux/network/link.js' );
   

  
    e._system_link = function( system ) {

        switch ( kernel.os( system ) ) {
                
            case kernel.OS_LINUX:
                return linux_link;
                
            default:
                throw new Error( "Unknown OS" );
                
        }
        
    };
    
    e._iface_link = function( iface ) {
        
        return e._system_link( e.system( iface ) );
        
    };
    
    e.add_interface = function( system, iface_name, physical_address ) {
        
        var iface = e._system_link( system ).add_interface( system, iface_name, physical_address );
        iface.system = system;
        
        return iface;

    };

    // TODO: Spoofed MAC address can hijack any connection on attach
    e.attach = function( iface, network ) {

        if ( e._iface_link( iface ).network( iface ) )
            throw new Error( "Interface is already attached to network." );
        
        e._iface_link( iface ).network( iface, network );

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
            e._iface_link( iface ).network( iface, network );
        
        if ( network )
            delete network.hosts[iface.physical_address];
         
        e._iface_link( iface ).network( iface, null );
        
    };
    
    e.interface_up = function( iface ) {

        if ( !e._iface_link( iface ).network( iface ) )
            throw new Error( "Interface is not attached to any network." );

        e._iface_link( iface ).is_up( iface, true );
        
    };

    e.interface_down = function( iface ) {
        
        e._iface_link( iface ).is_up( iface, false );
        
    };

    e.is_up = function( iface ) {

        return e._iface_link( iface ).is_up( iface );

    };

    e.name = function( iface ) {

        return e._iface_link( iface ).name( iface );

    };

    e.network = function( iface ) {

        return e._iface_link( iface ).network( iface );

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

        return e._iface_link( iface ).physical_address( iface );

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
