describe( "Network Transport Layer:", function() {
    
    var transport = require( './transport.js' ),
        internet_mock = require( './internet.js' );

    beforeEach( function() {

        this.system = {};
        this.iface = {};

        this.has_address_mock = spyOn( internet_mock, 'has_address' ).and.returnValue( true );

    } );

    describe( "listen", function() {

        beforeEach( function() {

        } );

        it( "should add the given address and port to the listen addresses of the system", function() {

            transport.listen( this.system, '127.0.0.1', 1 );

            expect( transport.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeTruthy();

            transport.listen( this.system, '0.0.0.0', 2 );

            expect( transport.is_listening_on( this.system, '0.0.0.0', 2 ) ).toBeTruthy();
            expect( transport.is_listening_on( this.system, '127.0.0.1', 2 ) ).toBeTruthy();

        } );

        it( "should throw an error if the address is not used by the system", function() {

            this.has_address_mock.and.returnValue( false );

            expect( function() {
                transport.listen( this.system, "127.0.0.1", 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Cannot assign requested address." );

        } );

        it( "should throw an error if a listening socket is already opened on this interface and port", function() {

            transport.listen( this.system, '127.0.0.1', 1 );

            expect( function() {
                transport.listen( this.system, '127.0.0.1', 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Address already in use." );

            transport.listen( this.system, '127.0.0.2', 1 );

        } );

        it( "should have the same behaviour for 0.0.0.0 as for an undefined listen address", function() {

            transport.listen( this.system, null, 1 );

            expect( transport.is_listening_on( this.system, '0.0.0.0', 1 ) ).toBeTruthy();

        } );

        it( "should listen to all available addresses if listening on the generic interface", function() {

            transport.listen( this.system, null, 1 );

            expect( transport.is_listening_on( this.system, '127.0.0.1', 1 ) );

        } );



        it( "should throw an error if a listening socket is arleady opened on the generic interface", function() {

            transport.listen( this.system, null, 1 );

            expect( function() {
                transport.listen( this.system, '127.0.0.1', 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Address already in use." );

        } );

        it( "should throw an error if trying to listen on the generic interface and a listen socket is already opened on another address", function() {

            transport.listen( this.system, '127.0.0.1', 1 );

            expect( function() {
                transport.listen( this.system, '0.0.0.0', 1 );
            }.bind( this ) ).toThrowError( "bind to 0.0.0.0:1: Address already in use." );

        } );

        it( "should return the connection socket", function() {

            expect( transport.listen( this.system, null, 1 ) ).not.toEqual( undefined );

        } );

        it( "should listen on addresses that were made available after the listen call, if the listen address was generic", function() {

            this.has_address_mock.and.callFake( function( system, address ) {
                
                return address == '0.0.0.0';

            } );

            transport.listen( this.system, null, 1 );

            expect( transport.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeFalsy();

            this.has_address_mock.and.returnValue( true );

            expect( transport.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeTruthy();

        } );

    } );

    describe( "is_listening_on", function() {

        it( "should return true if listening on an address while listening on the generic face for another port", function() {

            transport.listen( this.system, null, 1 );
            transport.listen( this.system, '127.0.0.1', 2 );

            expect( transport.is_listening_on( this.system, '127.0.0.1', 2 ) ).toBeTruthy();

        } );

    } );

    describe( "connect", function() {

        beforeEach( function() {

            this.iface = {1:1}
            this.iface2 = {2:2};

            spyOn( internet_mock, 'routing_latency' ).and.returnValue( 1 );
            spyOn( internet_mock, 'routing_hops' ).and.returnValue( [] );
            spyOn( internet_mock, 'routing_terminal' ).and.callFake( function( routing ) {
                return routing.terminal;
            } );
            this.ip_routing_mock = spyOn( internet_mock, 'ip_routing' ).and.returnValue( {
                terminal: this.iface,
            } );

        } );

        it( "should propagate the error if the network is unreachable", function() {

            this.ip_routing_mock.and.callFake( function() {
                throw new Error( "Network is unreachable." );
            } );

            expect( function() {
                transport.connect( this.system, '192.168.0.1', 80 );
            }.bind( this ) ).toThrowError( "Network is unreachable." );

        } );

        it( "should throw an error if the address is not in the network of the terminal interface", function() {

            spyOn( internet_mock, 'arp_resolve' ).and.callFake( function( iface, ip ) {
                if ( iface == this.iface && ip == '192.168.0.2' )
                    return null;
                throw new Error( "Not implemented" );
            }.bind( this ) );

            expect( function() {
                transport.connect( this.system, '192.168.0.2', 80 );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

        it( "should throw an error if the connection types do not correspond", function() {

            spyOn( internet_mock, 'arp_resolve' ).and.returnValue( this.iface );

            spyOn( transport, 'is_listening_on' ).and.callFake( function( system, ip_address, port ) {
                if ( ip_address == '192.168.0.2' && port == 80 )
                    return {
                        protocol: transport.PROTO_TCP,
                    };
                return false;
            } );

            expect( function() {
                transport.connect( this.system, '192.168.0.2', 80, transport.PROTO_UDP );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

        it( "should return a socket if the connection is successfull", function() {

            spyOn( internet_mock, 'arp_resolve' ).and.returnValue( this.iface2 );

            var sock = transport.listen( {}, '192.168.0.2', 80, transport.PROTO_TCP );

            spyOn( transport, 'is_listening_on' ).and.callFake( function( system, ip_address, port ) {
                if ( ip_address == '192.168.0.2' && port == 80 )
                    return sock;
                return false;
            } );

            expect( transport.connect( this.system, '192.168.0.2', 80, transport.PROTO_TCP ) ).not.toEqual( undefined );

        } );

        it( "should call the accept callback of the listen side, and return a file descriptor for the connecting side", function() {

            spyOn( internet_mock, 'arp_resolve' ).and.returnValue( this.iface2 );

            var listen_sock_fd;
            var sock = transport.listen( {}, '192.168.0.2', 80, transport.PROTO_TCP, function( fd ) {
                listen_sock_fd = fd;
            } );


            spyOn( transport, 'is_listening_on' ).and.callFake( function( system, ip_address, port ) {
                if ( ip_address == '192.168.0.2' && port == 80 )
                    return sock;
                return false;
            } );

            var sock_fd = transport.connect( this.system, '192.168.0.2', 80, transport.PROTO_TCP );

        } );


    } );

} );
