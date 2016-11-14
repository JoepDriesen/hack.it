( function( e ) {

    var ip = require( 'ip' );

    e.arp_broadcast = function( network, interface, ip_address ) {

        network.arp_table[ip_address] = interface;

    };

    e.add_host = function( network, host ) {

        if ( network.hosts.indexOf( host ) >= 0 )
            return false;

        network.hosts.push( host );

        return true;

    };

    e.create_network = function() {

        return {

            arp_table: {},
            hosts: [],

        };

    };

    e.host = function( network, ip_addr ) {

        return network.arp_table[ip_addr];

    };

    e.hosts = function( network ) {

        return network.hosts;

    };

    e.ip_connect = function( network, target_ip ) {

        return network.arp_table[target_ip];

    };

    e.remove_host = function( network, host ) {

        var i = network.hosts.indexOf( host );

        if ( i < 0 )
            return false;
        
        network.hosts.splice( i, 1 );

        return true;

    };

}( module.exports ) );
