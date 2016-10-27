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
            
        })
        
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
    
} );
