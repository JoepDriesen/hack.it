( function( e ) {

    var internet = require( './internet.js' ),
        fs = require( './../fs.js' ),
        file = require( './../file.js' );



    // Transport Protocols
    e.PROTO_TCP = 'tcp';
    e.PROTO_UDP = 'udp';



    e.connect = function( system, target_ip_address, port, protocol ) {

        var route = internet.ip_routing( system, target_ip_address );

        var target_iface = internet.arp_resolve( route.terminal, target_ip_address );

        if ( !target_iface )
            throw new Error( "Connection refused." );

        var listen_sock = e.is_listening_on( internet.system( target_iface ), target_ip_address, port );

        if ( !listen_sock || listen_sock.protocol != protocol )
            throw new Error( "Connection refused." );

        var connecting_sock_fd = file._create_file_descriptor( fs.FT_SOCKET ),
            listening_sock_fd = file._create_file_descriptor( fs.FT_SOCKET );

        connecting_sock_fd.on( 'data_write', function( d ) {
            listening_sock_fd.emit( 'data_read', d );
        } );
        listening_sock_fd.on( 'data_write', function( d ) {
            connecting_sock_fd.emit( 'data_read', d );
        } );

        if ( listen_sock.accept_callback )
            listen_sock.accept_callback( listening_sock_fd );

        return connecting_sock_fd;

    };

    e.is_listening_on = function( system, ip_address, port ) {
		
        if ( !system.listen_addresses || !internet.has_address( system, ip_address ) )
            return false;

        if ( ip_address == null )
            ip_address = '0.0.0.0';

        if ( system.listen_addresses[port] && system.listen_addresses[port]['0.0.0.0'] )
            return system.listen_addresses[port]['0.0.0.0'];

		if ( system.listen_addresses[port] )
			return system.listen_addresses[port][ip_address];

        return false;

    };

    e.listen = function( system, bind_ip_address, port, protocol, accept_callback ) {

        if ( bind_ip_address === null )
            bind_ip_address = '0.0.0.0';

        if ( !internet.has_address( system, bind_ip_address ) )
            throw new Error( "bind to " + bind_ip_address + ":" + port + ": Cannot assign requested address." );

        if ( !system.listen_addresses )
            system.listen_addresses = {};

        if ( e.is_listening_on( system, bind_ip_address, port ) || ( bind_ip_address == '0.0.0.0' && system.listen_addresses[port] && Object.keys( system.listen_addresses[port] ).length > 0 ) )
            throw new Error( "bind to " + bind_ip_address + ":" + port + ": Address already in use." );

        if ( !system.listen_addresses[port] )
            system.listen_addresses[port] = {};

        var listen_socket = {

            protocol: protocol,

            accept_callback: accept_callback,

        };
        
        system.listen_addresses[port][bind_ip_address] = listen_socket;

        return listen_socket;
    };

}( module.exports ) );
