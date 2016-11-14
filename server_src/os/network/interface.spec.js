describe( "Network Interface:", function() {
    
    var intf = require( './interface.js' ),
        net = require( './network.js' ),
        ip = require( 'ip' ),
        kernel = require( '../kernel.js' ),
        socket = require( './socket.js' );

    beforeEach( function() {

        this.system = {};
        this.network = net.create_network();

        this.system_is_on_spy = spyOn( kernel, 'is_on' ).and.returnValue( true );

    } );

    describe( "add_interface", function() {

        it( "should add an interface to the given system", function() {

            expect( intf.network_interfaces( this.system ) ).toEqual( [] );

            expect( intf.add_interface( this.system ) ).not.toEqual( undefined );

            expect( intf.network_interfaces( this.system ).length ).toEqual( 1 );

        } );

        it( "should use the name provided for the interface, if any", function() {

            intf.add_interface( this.system, "wlan0" );

            expect( intf.network_interfaces( this.system ) ).toContain( "wlan0" );

        } );

        it( "should keep a reference to the system it belongs to", function() {

            var iface = intf.add_interface( this.system );

            expect( intf.system( iface ) ).toEqual( this.system );

        } );

        it( "should throw an error if the given name is already taken by an interface", function() {

            intf.add_interface( this.system, "eth0" );
            
            expect( function() {
                intf.add_interface( this.system, "eth0" );
            }.bind( this ) ).toThrowError( "Interface already exists: eth0" );

        } );

    } );
    
    describe( "attach", function() {
        
        beforeEach( function() {
            
            this.iface = intf.add_interface( this.system );
            
        } );
        
        it( "should add the given interface to the hosts array and set the network of the interface.", function() {
            
            intf.attach( this.iface, this.network );
            
            expect( net.hosts( this.network ) ).toContain( this.iface );
            expect( intf.network( this.iface ) ).toEqual( this.network );
            
        } );
        
        it( "should throw an error if the interface is already attached to a network.", function() {
            
            intf.attach( this.iface, this.network );
            
            expect( function() {
                intf.attach( this.iface, this.network );
            }.bind( this ) ).toThrowError( "Interface is already attached to network." );
        } );
        
    } );
    
    describe( "dettach", function() {
        
        beforeEach( function() {
            
            this.iface = intf.add_interface( this.system );
            intf.attach( this.iface, this.network );

        } );

        it( "should remove the given interface from the network if it is in it.", function() {
            
            intf.dettach( this.iface, this.network );
            
            expect( net.hosts( this.network ).indexOf( this.iface ) ).toEqual( -1 );
            expect( intf.network( this.iface ) ).toEqual( null );
            
            expect( intf.dettach( this.iface, this.network ) ).toBeFalsy();
            
        } );
        
        it( "should remove the given interface from any network it is in.", function() {
            
            intf.dettach( this.iface );
            
            expect( net.hosts( this.network ).indexOf( this.iface ) ).toEqual( -1 );
            expect( intf.network( this.iface ) ).toEqual( null );
            
            intf.dettach( this.iface, this.network );
            
        } );
        
    } );
   
    describe( "interface_up_static", function() {
        
        beforeEach( function() {
           
            this.iface = intf.add_interface( this.system );
            intf.attach( this.iface, this.network );
            
        } );

        it( "should throw an error if the system is not on", function() {

            this.system_is_on_spy.and.returnValue( false );

            expect( function() {
                intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );
            }.bind( this ) ).toThrowError( "The system is not turned on." )

        } );
        
        it( "should throw an error if the interface is not attached to a network", function() {
            
            intf.dettach( this.iface );
            
            expect( function() {
                intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' )
            }.bind( this ) ).toThrowError( "Interface is not attached to any network." );
            
        } );
        
        it( "should not throw an error if the given ip is taken in the network", function() {
            
            var int2 = intf.add_interface( this.system );
            intf.attach( int2, this.network );
            intf.interface_up_static( int2, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );
            
            expect( function() {
                intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24' );
            }.bind( this ) ).not.toThrowError( "The given IP address is already taken on the given network: 192.168.0.1");
        } );
        
        it( "should throw an error if the given ip is not in the given subnet.", function() {
            
            expect( function() {
                intf.interface_up_static( this.iface, '1.1.1.1', '192.168.0.0/24', '192.168.0.1' );
            }.bind( this ) ).toThrowError( "The given IP address is not in the given subnet: 1.1.1.1 not in 192.168.0.0/24" );
            
        } );
        
        it( "should throw an error if the given default gateway is not in the given subnet.", function() {
            
            expect( function() {
                intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24', '1.1.1.1' );
            }.bind( this ) ).toThrowError( "The given default gateway IP address is not in the given subnet: 1.1.1.1 not in 192.168.0.0/24" );
            
        } );

        it( "should configure the interface if the command is successful", function() {

            intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );

            expect( intf.ip( this.iface ) ).toEqual( '192.168.0.1' );
            expect( intf.subnet( this.iface ).networkAddress ).toEqual( '192.168.0.0' );
            expect( intf.default_gateway( this.iface ) ).toEqual( '192.168.0.1' );

        } );
        
    } );

    describe( "interface_down", function() {
        
        beforeEach( function() {

            this.iface1 = intf.add_interface( this.system );
            intf.attach( this.iface1, this.network );
            intf.interface_up_static( this.iface1, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );
            
        } );


        it( "should throw an error if the system is not on", function() {

            this.system_is_on_spy.and.returnValue( false );

            expect( function() {
                intf.interface_down( this.iface1 );
            }.bind( this ) ).toThrowError( "The system is not turned on." )

        } );

        it( "should remove the configuration information of the interface", function() {

            intf.interface_down( this.iface1 );

            expect( intf.ip( this.iface1 ) ).toEqual( null );
            expect( intf.subnet( this.iface1 ) ).toEqual( null );
            expect( intf.default_gateway( this.iface1 ) ).toEqual( null );

        } );
        
        it( "shouldn't remove itself from the arp table", function() {
            
            intf.interface_down( this.iface1 );
            
            expect( net.host( this.network, '192.168.0.1' ) ).not.toEqual( undefined );
            
            intf.interface_up_static( this.iface1, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );
            
        } );

    } );

    describe( "is_up", function() {

        it( "should check if the interface is fully configured.", function() {

            expect( intf.is_up( { ip: null, subnet: null, default_gateway: null } ) ).toBeFalsy();
            expect( intf.is_up( { ip: 1, subnet: null, default_gateway: null } ) ).toBeFalsy();
            expect( intf.is_up( { ip: null, subnet: 1, default_gateway: null } ) ).toBeFalsy();
            expect( intf.is_up( { ip: null, subnet: null, default_gateway: 1 } ) ).toBeFalsy();
            expect( intf.is_up( { ip: null, subnet: 1, default_gateway: 1 } ) ).toBeFalsy();
            expect( intf.is_up( { ip: 1, subnet: 1, default_gateway: null } ) ).toBeTruthy();
            expect( intf.is_up( { ip: 1, subnet: null, default_gateway: 1 } ) ).toBeFalsy();
            expect( intf.is_up( { ip: 1, subnet: 1, default_gateway: 1 } ) ).toBeTruthy();

        } );

    } );

    describe( "listen", function() {

        beforeEach( function() {

            this.iface = intf.add_interface( this.system );
            this.iface2 = intf.add_interface( this.system );
            intf.attach( this.iface, this.network );
            intf.attach( this.iface2, this.network );
            intf.interface_up_static( this.iface, '127.0.0.1', '127.0.0.1/32' );
            intf.interface_up_static( this.iface2, '127.0.0.2', '127.0.0.2/32' );

        } );

        it( "should add the given address and port to the listen addresses of the system", function() {

            intf.listen( this.system, '127.0.0.1', 1 );

            expect( intf.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeTruthy();

            intf.listen( this.system, '0.0.0.0', 2 );

            expect( intf.is_listening_on( this.system, '0.0.0.0', 2 ) ).toBeTruthy();
            expect( intf.is_listening_on( this.system, '127.0.0.1', 2 ) ).toBeTruthy();

        } );

        it( "should throw an error if there are no available interfaces", function() {

            intf.interface_down( this.iface );
            intf.interface_down( this.iface2 );

            expect( function() {
                intf.listen( this.system, "127.0.0.1", 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Cannot assign requested address." );

        } );

        it( "should throw an error if a listening socket is already opened on this interface and port", function() {

            intf.listen( this.system, '127.0.0.1', 1 );

            expect( function() {
                intf.listen( this.system, '127.0.0.1', 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Address already in use." );

            intf.listen( this.system, '127.0.0.2', 1 );

        } );

        it( "should throw an error if a listening socket is arleady opened on the generic interface", function() {

            intf.listen( this.system, null, 1 );

            expect( function() {
                intf.listen( this.system, '127.0.0.1', 1 );
            }.bind( this ) ).toThrowError( "bind to 127.0.0.1:1: Address already in use." );

        } );

        it( "should return the connection socket", function() {

            expect( intf.listen( this.system, null, 1 ) ).not.toEqual( undefined );

        } );

        it( "should not listen on interfaces that are down", function() {

            intf.interface_down( this.iface );
            
            intf.listen( this.system, null, 1 );

            expect( intf.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeFalsy();

        } );

        it( "should listen on interfaces that were put up after the listen call, if the listen address was generic", function() {

            intf.interface_down( this.iface );
            
            intf.listen( this.system, null, 1 );

            intf.interface_up_static( this.iface, '127.0.0.1', '127.0.0.1/32' );
            
            expect( intf.is_listening_on( this.system, '127.0.0.1', 1 ) ).toBeTruthy();

        } );

        it( "should have the same behaviour for 0.0.0.0 as for an undefined listen address", function() {

            intf.listen( this.system, null, 1 );

            expect( intf.is_listening_on( this.system, '0.0.0.0', 1 ) ).toBeTruthy();

        } );

    } );

    describe( "connect", function() {

        beforeEach( function() {

            this.iface = intf.add_interface( this.system );
            intf.attach( this.iface, this.network );
            intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24' );

            this.iface1 = intf.add_interface( this.system );
            intf.attach( this.iface1, this.network );
            intf.interface_up_static( this.iface1, '192.168.0.2', '192.168.0.0/24' );

        } );

        it( "should throw an error if no interfaces can reach the given address", function() {

            intf.interface_down( this.iface );
            intf.interface_down( this.iface1 );

            expect( function() {
                intf.connect( this.system, '192.168.0.1', 80 );
            }.bind( this ) ).toThrowError( "Network is unreachable." );

            intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24' );

            expect( function() {
                intf.connect( this.system, '10.0.0.1', 80 );
            }.bind( this ) ).toThrowError( "Network is unreachable." );

        } );

        it( "should throw an error if the address is not responding", function() {

            expect( function() {
                intf.connect( this.system, '192.168.0.2', 80 );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

        it( "should throw an error if the connection types do not correspond", function() {

            intf.listen( this.system, '192.168.0.2', 80, socket.PROTO_TCP );

            expect( function() {
                intf.connect( this.system, '192.168.0.2', 80, socket.PROTO_UDP );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

        it( "should return a socket if the connection is successfull", function() {

            intf.listen( this.system, '192.168.0.2', 80, socket.PROTO_TCP );

            expect( intf.connect( this.system, '192.168.0.2', 80, socket.PROTO_TCP ) ).not.toEqual( undefined );

        } );

        it( "should be able to connect to interfaces on the same network", function() {

            var sys2 = {},
                iface3 = intf.add_interface( sys2 );
            intf.attach( iface3, this.network );
            intf.interface_up_static( iface3, '192.168.0.3', '192.168.0.0/24' );

            expect( function() {
                intf.connect( this.system, '192.168.0.3', 80, socket.PROTO_TCP );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

        it( "should be able to connect to interfaces on different networks", function() {

            var sys2 = {},
                network2 = net.create_network(),
                iface3 = intf.add_interface( sys2 ),
                iface4 = intf.add_interface( sys2 );
            intf.attach( iface3, this.network );
            intf.attach( iface4, network2 );
            intf.interface_up_static( iface3, '192.168.0.3', '192.168.0.0/24' );
            intf.interface_up_static( iface3, '192.168.1.1', '192.168.1.0/24' );

            var sys3 = {},
                iface5 = intf.add_interface( sys3 );
            intf.attach( iface5, network2 );
            intf.interface_up_static( iface5, '192.168.1.2', '192.168.1.0/24' );

            intf.interface_up_static( this.iface, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );

            expect( function() {
                intf.connect( this.system, '192.168.1.2', 1, socket.PROTO_TCP );
            }.bind( this ) ).toThrowError( "Connection refused." );

        } );

    } );

} );
