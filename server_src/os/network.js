( function( e ) {
    
    var ip = require( 'ip' );
    
    e.create_interface = function( system, name ) {
        
        return {
            system: system,
            name: name,
            
            network: null,
            dhcp: false,
            
            ip: null,
            subnet: null,
            default_gateway: null,
        };
        
    };
    
    e.create_network = function() {
        
        return {
            hosts: [],
            arp_table: {},
        };
        
    };
    
    e.connect = function( interface, network ) {
        
        if ( interface.network )
            throw new Error( "Interface is already connected to network." );
        
        network.hosts.push( interface );
        interface.network = network;
        
    };
    
    e.disconnect = function( interface, network ) {
        
        if ( !network )
            network = interface.network;
        
        if ( network ) {
         
            var i = network.hosts.indexOf( interface );

            if ( i )
                network.hosts.splice( i, 1 );

        }
        
        interface.network = null;
        
    };
    
    e.interface_up_static = function( interface, ip_addr, subnet_cidr, default_gateway ) {
        
        if ( !interface.network )
            throw new Error( "Interface is not connected to any network." );
        
        if ( interface.network.arp_table[ip_addr] )
            throw new Error( "The given IP address is already taken on the given network: " + ip_addr );
        
        var subnet = ip.cidrSubnet( subnet_cidr );
        if ( !subnet.contains( ip_addr ) )
            throw new Error( "The given IP address is not in the given subnet: " + ip_addr + " not in " + subnet_cidr );
        if ( !subnet.contains( default_gateway ) )
            throw new Error( "The given default gateway IP address is not in the given subnet: " + default_gateway + " not in " + subnet_cidr );
        
        interface.network.arp_table[ip_addr] = interface;
        interface.ip = ip_addr;
        interface.subnet = subnet;
        interface.default_gateway = default_gateway;
        
    };
    
}( module.exports ) );
