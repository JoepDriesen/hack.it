( function( e ) {

    var link = require( './link.js' ),
        ip = require( 'ip' );



    e.DEFAULT_GATEWAY = 'default_gw';

    e.ARP_CACHE_TIMEOUT = '10000';



    e.add_address = function( iface, cidr_ip_address ) {   

        if ( !iface.ip_addresses )
            iface.ip_addresses = [];

        if ( ip.isV4Format( cidr_ip_address ) )
            cidr_ip_address += '/32';

        if ( iface.ip_addresses.indexOf( cidr_ip_address ) >= 0 )
            return false;

        iface.ip_addresses.push( cidr_ip_address );
        
        return true;

    };

    // Keep routes ordered ( default gateways last )
    e.add_route = function( iface, to_subnet, via_ip_address ) {

        var system = link.system( iface );

        if ( !system.network_routes )
            system.network_routes = {};

        if ( system.network_routes[to_subnet] )
            throw new Error( "Route already exists." );

        if ( via_ip_address ) {

            var ip_ok = false;
            for ( var i = 0; i < e.addresses( iface ).length; i++ ) {

                if ( !ip.cidrSubnet( iface.ip_addresses[i] ).contains( via_ip_address ) )
                    continue;

                ip_ok = true;
                break;

            }

            if ( !ip_ok )
                throw new Error( "Network is unreachable." );

        }

        if ( to_subnet == e.DEFAULT_GATEWAY )
            system.network_routes[to_subnet] = {
                iface: iface,
                to: e.DEFAULT_GATEWAY,
                via: via_ip_address,
            };

        else
            system.network_routes[to_subnet] = {
                iface: iface,
                to: ip.cidrSubnet( to_subnet ),
                via: via_ip_address,
            };

        return true;

    };

    e.addresses = function( iface ) {

        if ( !iface.ip_addresses )
            return [];

        return iface.ip_addresses;

    };

    e.arp_resolve = function( iface, ip_address ) {

        if ( !iface.arp_cache )
            iface.arp_cache = {};

        if ( iface.arp_cache[ip_address] && ( ( new Date() ).getTime() - iface.arp_cache[ip_address].time ) <= e.ARP_CACHE_TIMEOUT )
            return iface.arp_cache[ip_address];
        
        for ( var physical_address in link.network_interfaces( link.network( iface ) ) ) {

            var target_iface = link.network_interface( link.network( iface ), physical_address );

            for ( var i = 0; i < e.addresses( target_iface ).length; i++ ) {

                if ( target_iface.ip_addresses[i].split( '/' )[0] != ip_address )
                    continue;

                iface.arp_cache[ip_address] = physical_address;

                return target_iface;

            }

        }

        return null;

    };

    e.delete_address = function( iface, cidr_ip_address ) {

        if ( !iface.ip_addresses )
            return false;

        try {
            ip.cidrSubnet( cidr_ip_address );

        } catch ( e ) {

            for ( var i = 0; i < iface.ip_addresses.length; i++ ) {

                if ( iface.ip_addresses[i].split( '/' )[0] == cidr_ip_address ) {
                    
                    iface.ip_addresses.splice( i, 1 );

                    return true;

                }

            }

            return false;

        }

        var i = iface.ip_addresses.indexOf( cidr_ip_address );

        if ( i == -1 )
            return false;

        iface.ip_addresses.splice( i, 1 );

        return true;

    };

    e.delete_route = function( system, to_subnet ) {

        if ( !e.routes( system )[to_subnet] )
            throw new Error( "No such route." );

        delete system.network_routes[to_subnet];

    };

    e.has_address = function( system, ip_address ) {

        if ( ip_address == '0.0.0.0' )
           return true;

        for ( var iface_name in link.system_interfaces( system ) ) {

            var iface = link.system_interface( system, iface_name );

            if ( !link.is_up( iface ) )
               continue;

            for ( var i = 0; i < iface.ip_addresses.length; i++ ) {

                if ( iface.ip_addresses[i].split( '/' )[0] == ip_address )
                    return true;

            }

        }

    };

    e.ip_routing = function( source_system, target_ip_address ) {

        var hops = e.__next_hop( source_system, target_ip_address );

        if ( hops == null )
            throw new Error( "Network is unreachable." );

        var latency = 0;
        for ( var i = 0; i < hops.length; i++ ) 
            latency += link.network_latency( link.network( hops[i][0] ) );


        return {

            hops: hops,
            latency: function() {
                return latency + ( 0.1 * latency * ( Math.random() - 0.5 ) );
            },
            terminal: hops[hops.length - 1][0],

        };

    };

    /*
     * return [
     *      [ source_iface, hop_iface ],
     *      ...
     *      iface_with_target_ip_in_subnet
     * ];
     */
    // TODO: check for infinite recursion
    e.__next_hop = function( source_system, target_ip_address ) {

        var ifaces = [];

        // Check all local ips
        for ( var iface_name in link.system_interfaces( source_system ) ) {

            var iface = link.system_interface( source_system, iface_name );

            if ( !link.is_up( iface ) )
               continue; 

            ifaces.push( iface );

            for ( var i in e.addresses( iface ) ) {

                var subnet = ip.cidrSubnet( iface.ip_addresses[i] );

                if ( subnet.contains( target_ip_address ) )
                    return [ [iface] ];

            }

        }

        // Check all routes
        for ( var subnet in e.routes( source_system ) ) {

            var route = source_system.network_routes[subnet];

            if ( route.to != e.DEFAULT_GATEWAY && !route.to.contains( target_ip_address ) )
                continue;

            if ( !route.via )
                return [ [route.iface] ];

            var via_iface = e.arp_resolve( route.iface, route.via );

            // TODO: check behaviour if via ip is not found on the network
            if ( !via_iface )
                continue;

            var next_hop = e.__next_hop( link.system( via_iface ), target_ip_address );
            
            var hops = [ [route.iface, via_iface] ];

            for ( var i = 0; i < next_hop.length; i++ )
                hops.push( next_hop[i] );

            return hops;

        }

        return null;
    
    };

    e.route_iface = function( route ) {

        return route.iface;

    };

    e.route_to = function( route ) {

        return route.to;

    };

    e.route_via = function( route ) {

        return route.via;

    };

    e.route = function( system, to_subnet ) {

        return e.routes( system )[to_subnet];

    };

    /*
     * return {
     *      to_subnet: route,
     *      ...
     * };
     */
    e.routes = function( system ) {

        if ( !system.network_routes )
            return [];

        return system.network_routes;

    };

    e.routing_hops = function( routing ) {

        return routing.hops;

    };

    e.routing_latency = function( routing ) {

        return routing.latency();

    };

    e.routing_terminal = function( routing ) {

        return routing.terminal;

    };

    e.system = function( iface ) {

        return link.system( iface );

    };

}( module.exports ) );
