describe( "A network", function() {
    
    var net = require( './network.js' ),
        ip = require( 'ip' );
    
    describe( "connect", function() {
        
        beforeEach( function() {
            
            this.network = net.create_network();
            this.int = net.create_interface();
            
        })
        
        it( "should add the given interface to the hosts array and set the network of the interface.", function() {
            
            net.connect( this.int, this.network );
            
            expect( this.network.hosts[0] ).toEqual( this.int );
            expect( this.int.network ).toEqual( this.network );
            
        } );
        
        it( "should throw an error if the interface is already connected to a network.", function() {
            
            net.connect( this.int, this.network );
            
            expect( function() {
                net.connect( this.int, this.network );
            }.bind( this ) ).toThrowError( "Interface is already connected to network." );
        })
        
    } );
    
    describe( "disconnect", function() {
        
        beforeEach( function() {
            
            this.network = net.create_network();
            this.int = net.create_interface();
            net.connect( this.int, this.network );
            
        } );
        
        it( "should remove the given interface from the network if it is in it.", function() {
            
            net.disconnect( this.int, this.network );
            
            expect( this.network.hosts.indexOf( this.int ) ).toBeFalsy();
            expect( this.int.network ).toEqual( null );
            
            net.disconnect( this.int, this.network );
            
        } );
        
        it( "should remove the given interface from any network it is in.", function() {
            
            net.disconnect( this.int );
            
            expect( this.network.hosts.indexOf( this.int ) ).toBeFalsy();
            expect( this.int.network ).toEqual( null );
            
            net.disconnect( this.int, this.network );
            
        } );
        
    } );
    
    describe( "interface_up_static", function() {
        
        beforeEach( function() {
            
            this.network = net.create_network();
            this.int = net.create_interface();
            net.connect( this.int, this.network );
            
        } );
        
        it( "should throw an error if the interface is not connected to a network", function() {
            
            net.disconnect( this.int );
            
            expect( function() {
                net.interface_up_static( this.int)
            }.bind( this ) ).toThrowError( "Interface is not connected to any network." );
            
        } );
        
        it( "should throw an error if the given ip is taken in the network", function() {
            
            var int2 = net.create_interface();
            net.connect( int2, this.network );
            net.interface_up_static( int2, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );
            
            expect( function() {
                net.interface_up_static( this.int, '192.168.0.1', '192.168.0.0/24' );
            }.bind( this ) ).toThrowError( "The given IP address is already taken on the given network: 192.168.0.1");
        } );
        
        it( "should throw an error if the given ip is not in the given subnet.", function() {
            
            expect( function() {
                net.interface_up_static( this.int, '1.1.1.1', '192.168.0.0/24', '192.168.0.1' );
            }.bind( this ) ).toThrowError( "The given IP address is not in the given subnet: 1.1.1.1 not in 192.168.0.0/24" );
            
        } );
        
        it( "should throw an error if the given default gateway is not in the given subnet.", function() {
            
            expect( function() {
                net.interface_up_static( this.int, '192.168.0.1', '192.168.0.0/24', '1.1.1.1' );
            }.bind( this ) ).toThrowError( "The given default gateway IP address is not in the given subnet: 1.1.1.1 not in 192.168.0.0/24" );
            
        } );

        it( "should configure the interface if the command is successful", function() {

            net.interface_up_static( this.int, '192.168.0.1', '192.168.0.0/24', '192.168.0.1' );

            expect( this.int.ip ).toEqual( '192.168.0.1' );
            expect( this.int.subnet.networkAddress ).toEqual( '192.168.0.0' );
            expect( this.int.default_gateway ).toEqual( '192.168.0.1' );

        } );
        
    } );

    describe( "interface_down", function() {
        
        beforeEach( function() {

            this.network = net.create_network();
            this.int1 = net.create_interface();
            net.connect( this.int1, this.network );
            net.interface_up_static( this.int1, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );
            
        } );

        it( "should remove the configuration information of the interface", function() {

            net.interface_down( this.int1 );

            expect( this.int1.ip ).toEqual( null );
            expect( this.int1.subnet ).toEqual( null );
            expect( this.int1.default_gateway ).toEqual( null );

        } );
        
        it( "should remove itself from the arp table", function() {
            
            net.interface_down( this.int1 );
            
            expect( this.network.arp_table['192.168.0.1'] ).toEqual( undefined );
            
            net.interface_up_static( this.int1, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );
            
        } );

    } );

    describe( "is_up", function() {

        it( "should check if the interface is fully configured.", function() {

            expect( net.is_up( { ip: null, subnet: null, default_gateway: null } ) ).toBeFalsy();
            expect( net.is_up( { ip: 1, subnet: null, default_gateway: null } ) ).toBeFalsy();
            expect( net.is_up( { ip: null, subnet: 1, default_gateway: null } ) ).toBeFalsy();
            expect( net.is_up( { ip: null, subnet: null, default_gateway: 1 } ) ).toBeFalsy();
            expect( net.is_up( { ip: null, subnet: 1, default_gateway: 1 } ) ).toBeFalsy();
            expect( net.is_up( { ip: 1, subnet: 1, default_gateway: null } ) ).toBeTruthy();
            expect( net.is_up( { ip: 1, subnet: null, default_gateway: 1 } ) ).toBeFalsy();
            expect( net.is_up( { ip: 1, subnet: 1, default_gateway: 1 } ) ).toBeTruthy();

        } );

    } );

    describe( "ip_connect", function() {

        beforeEach( function() {

            this.network = net.create_network();
            this.int1 = net.create_interface();
            net.connect( this.int1, this.network );
            net.interface_up_static( this.int1, '192.168.0.1', '192.168.0.0/24', '192.168.0.3' );
            this.int2 = net.create_interface();
            net.connect( this.int2, this.network );
            net.interface_up_static( this.int2, '192.168.0.2', '192.168.0.0/24', '192.168.0.3' );

        } );

        it( "should return an error if no interfaces are found that have the possibility to reach the given ip", function() {

            net.interface_down( this.int1 );
            expect( function() {
                net.ip_connect( [this.int1], '1.1.1.1' );
            }.bind( this ) ).toThrowError( "Network is unreachable" );

            // No Default Gateway configured
            net.interface_up_static( this.int1, '192.168.0.1', '192.168.0.0/24' );
            expect( function() {
                net.ip_connect( [this.int1], '1.1.1.1' );
            }.bind( this ) ).toThrowError( "Network is unreachable" );

        } );

        it( "should return a direct path between the two interfaces if they are on the same network", function() {

            var conn = net.ip_connect( [this.int1], '192.168.0.2' );

            expect( conn.path[0] ).toEqual( this.int1 );
            expect( conn.path[1] ).toEqual( this.int2 );

        } );

        it( "should return null if no path to the target was found.", function() {

            expect( net.ip_connect( [this.int1], '10.11.0.1' ) ).toEqual( null );

        } );

    } );
    
} );
