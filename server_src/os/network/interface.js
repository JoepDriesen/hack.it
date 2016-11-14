( function( e ) {

    var ip = require( 'ip' ),
        kernel = require( '../kernel.js' ),
        net = require( './network.js' ),
        socket = require( './socket.js' );
   


    e.add_interface = function( system, iface_name ) {

        if ( !system.network_interfaces )
            system.network_interfaces = {};

        if ( !iface_name ) {

            var i = 1;
            while ( system.network_interfaces["eth" + i] )
                i++;

            iface_name = "eth" + i;

        } else if ( system.network_interfaces[iface_name] )
            throw new Error( "Interface already exists: " + iface_name );

        var iface = {

            name: iface_name,

            listen_ports: {},
        
        };

        system.network_interfaces[iface_name] = iface;
        iface.system = system;

        return iface;

    };

    e.add_route = function( system, to_subnet, via_ip_address ) {

        if ( !system.network_routes )
            system.network_routes = [];

        system.network_routes.push( {
            subnet: to_subnet,
            via: via_ip_address,
        } );

    };

    e.attach = function( iface, network ) {
        
        if ( iface.network )
            throw new Error( "Interface is already attached to network." );
        
        net.add_host( network, iface );
        iface.network = network;
        
    };

    e.connect = function( system, ip_address, port, protocol ) {

        var route = e.ip_route( system, ip_address );

        if ( !route )
            throw new Error( "Network is unreachable." );

        var target_s = e.is_listening_on( route[route.length - 1].system, ip_address, port );

        if ( !target_s || target_s.protocol != protocol )
            throw new Error( "Connection refused." );

        var s = socket.create_socket( protocol );

        socket.connect( target_s, s );

        return s;

    };

    e.default_gateway = function( iface ) {

        return iface.default_gateway;

    };

    e.delete_route = function( system, to_subnet, via_ip_address ) {

        if ( !system.network_routes )
            return false;
        
        var route_i
        for ( route_i in system.network_routes ) {

            var route = system.network_routes[route_i];

            if ( route.subnet == to_subnet && route.via == via_ip_address )
                break;

            route = null;

        }

        if ( !route )
            return false;

        system.network_routes.splice( route_i, 1 );
        
        return true;

    };
 
    e.dettach = function( iface, network ) {
        
        if ( !network )
            network = iface.network;
        
        if ( network )
            net.remove_host( network, iface );
         
        iface.network = null;
        
    };
    
    e.get_interface = function( system, iface_name ) {

        if ( !system.network_interfaces )
            return undefined;

        return system.network_interfaces[iface_name];

    };

    e.interface_up_static = function( iface, ip_address, subnet_cidr, default_gateway ) {
        
        if ( !kernel.is_on( iface.system ) )
            throw new Error( "The system is not turned on." );

        if ( !iface.network )
            throw new Error( "Interface is not attached to any network." );
        
        var subnet = ip.cidrSubnet( subnet_cidr );
        if ( !subnet.contains( ip_address ) )
            throw new Error( "The given IP address is not in the given subnet: " + ip_address + " not in " + subnet_cidr );
        if ( default_gateway && !subnet.contains( default_gateway ) )
            throw new Error( "The given default gateway IP address is not in the given subnet: " + default_gateway + " not in " + subnet_cidr );
        
        net.arp_broadcast( iface.network, iface, ip_address );
        iface.ip = ip_address;
        iface.subnet = subnet;
        
        if ( default_gateway )
            iface.default_gateway = default_gateway;
        else
            iface.default_gateway = null;
        
    };

    e.interface_down = function( iface ) {
        
        if ( !kernel.is_on( iface.system ) )
            throw new Error( "The system is not turned on." );

        iface.ip = null;
        iface.subnet = null;
        iface.default_gateway = null;

    };

    e.ip = function( iface ) {

        return iface.ip;

    };

    // TODO: TEST FOR INFINITE RECURSION BUGS
    e.ip_route = function( system, ip_address ) {

        if ( !system.network_interfaces )
            return null;

        for ( var iface_name in system.network_interfaces ) {

            var iface = system.network_interfaces[iface_name];

            if ( !iface.network )
                continue;

            var target_iface = net.ip_connect( iface.network, ip_address );

            if ( !target_iface || !e.is_up( target_iface ) )
                continue;
                
            return [iface, target_iface];

        }

        if ( system.network_routes ) {

            for ( var route_i in system.network_routes ) {
            
                var routing_info = system.network_routes[i];

                if ( !routing_info.subnet.contains( ip_address ) )
                    continue;

                for ( var iface_name in system.network_interfaces ) {

                    var iface = system.network_interfaces[iface_name];

                    var via_iface = net.ip_connect( iface.network, routing_info.via );

                    if ( !via_iface || !e.is_up( via_iface ) )
                        continue;

                    var next_route = e.ip_route( via_iface.system, ip_address );

                    if ( !next_route )
                        continue;

                    var route = [iface, [via_iface, next_route[0]]];

                    for ( var i = 1; i < next_route.length; i++ )
                        route.push( next_route[i] );

                    return route;

                }

            }

        }

        for ( var iface_name in system.network_interfaces ) {

            var iface = system.network_interfaces[iface_name];

            if ( !iface.network || !iface.default_gateway )
                continue;

            var default_gw_iface = net.ip_connect( iface.network, iface.default_gateway );

            if ( !default_gw_iface || !e.is_up( default_gw_iface ) )
                continue;

            var next_route = e.ip_route( default_gw_iface.system, ip_address );

            if ( !next_route )
                continue;

            var route = [iface, [default_gw_iface, next_route[0]]];

            for ( var i = 1; i < next_route.length; i++ )
                route.push( next_route[i] );

            return route;

        }

        return null;

    };


    e.is_listening_on = function( system, ip_address, port ) {

        if ( !system.listen_addresses || !system.network_interfaces )
            return false;

        if ( ip_address != '0.0.0.0' ) {

            var iface;
            for ( var iface_name in system.network_interfaces ) {

                iface = system.network_interfaces[iface_name];

                if ( iface.ip == ip_address && e.is_up( iface ) )
                    break;

                iface = null;

            }

            if ( !iface )
                return false;

        }

        if ( ip_address != '0.0.0.0' ) {

            if ( system.listen_addresses[ip_address] && system.listen_addresses[ip_address][port] )
                return system.listen_addresses[ip_address][port];

        }

        if ( system.listen_addresses['0.0.0.0'] )
            return system.listen_addresses['0.0.0.0'][port];

        return false;

    };
    
    e.is_up = function( iface ) {

        return ( iface.ip != null && iface.subnet != null );

    };

    e.listen = function( system, ip_address, port, protocol ) {

        if ( !protocol )
            protocol = socket.PROTO_TCP;

        if ( protocol != socket.PROTO_TCP && protocol != socket.PROTO_UDP )
            throw new Error( "Unknown connection protocol: " + protocol );

        var s = socket.create_socket( protocol );

        if ( !system.listen_addresses )
            system.listen_addresses = {};

        if ( ( !ip_address || ip_address == '0.0.0.0' ) && system.network_interfaces ) {

            if ( system.listen_addresses['0.0.0.0'] && system.listen_addresses['0.0.0.0'][port] )
                throw new Error( "bind to 0.0.0.0:" + port + ": Address already in use." );

            for ( var iface_name in system.network_interfaces ) {

                var iface = system.network_interfaces[iface_name];

                if ( system.listen_addresses[iface.ip] && system.listen_addresses[iface.ip][port] )
                    throw new Error( "bind to 0.0.0.0:" + port + ": Address already in use." );

            }

            if ( !system.listen_addresses['0.0.0.0'] )
                system.listen_addresses['0.0.0.0'] = {};

            system.listen_addresses['0.0.0.0'][port] = s;

        } else if ( system.network_interfaces ) {

            var iface;
            for ( var iface_name in system.network_interfaces ) {

                iface = system.network_interfaces[iface_name];

                if ( iface.ip == ip_address )
                    break;

                iface = undefined;

            }

            if ( !iface )
                throw new Error( "bind to " + ip_address + ":" + port + ": Cannot assign requested address." );

            if ( ( system.listen_addresses[iface.ip] && system.listen_addresses[iface.ip][port] ) || ( system.listen_addresses['0.0.0.0'] && system.listen_addresses['0.0.0.0'][port] ) )
                throw new Error( "bind to " + ip_address + ":" + port + ": Address already in use." );

            if ( !system.listen_addresses[iface.ip] )
                system.listen_addresses[iface.ip] = {};
            
            system.listen_addresses[ip_address][port] = s;

        } else
            throw new Error( "bind to " + ip_address + ":" + port + ": Cannot assign requested address." );

        return s;

    };

    e.network = function( iface ) {

        return iface.network;

    };

    e.network_interfaces = function( system ) {

        if ( !system.network_interfaces )
            return [];
        
        return Object.keys( system.network_interfaces );

    };

    e.subnet = function( iface ) {

        return iface.subnet;

    };

    e.system = function( iface ) {

        return iface.system;

    };

}( module.exports ) );
