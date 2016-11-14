( function( e ) {


    e.PROTO_TCP = 'proto_tcp';
    e.PROTO_UDP = 'proto_udp';

    e.create_socket = function( protocol ) {

        return {
            protocol: protocol,
        };

    };

    e.connect = function( listen_socket, connect_socket ) {

    };

}( module.exports ) );
