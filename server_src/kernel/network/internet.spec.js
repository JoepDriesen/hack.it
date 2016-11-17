describe( "Network Internet Layer:", function() {
    
    var internet = require( './internet.js' ),
        mock_link = require( './link.js' );

    beforeEach( function() {

        this.network = {};
        this.iface = {
            network: this.network,
        };
        this.system = {
            network_interfaces: { '1': this.iface }
        };
        this.iface.system = this.system;
        this.network[1] = this.iface;

        spyOn( mock_link, 'network' ).and.callFake( function( iface ) {
            return iface.network;
        } );

        spyOn( mock_link, 'network_interfaces' ).and.callFake( function( network ) {
            return network;
        } );

        spyOn( mock_link, 'network_interface' ).and.callFake( function( network, address ) {
            return network[address];
        } );

        spyOn( mock_link, 'system' ).and.callFake( function( iface ) {
            return iface.system;
        } );

        spyOn( mock_link, 'system_interfaces' ).and.callFake( function( system ) {
            return system.network_interfaces;
        } );

        spyOn( mock_link, 'system_interface' ).and.callFake( function( system, iface_name ) {
            return system.network_interfaces[iface_name];
        } );

        this.is_up_mock = spyOn( mock_link, 'is_up' ).and.returnValue( true );

    } );

    describe( "add_address", function() {

        it( "should add the given address to the interface", function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

            expect( internet.addresses( this.iface ) ).toContain( '1.0.0.1/24' );

        } );

        it( "should give a default subnet mask", function() {

            internet.add_address( this.iface, '1.0.0.1' );

            expect( internet.addresses( this.iface )[0] ).toEqual( '1.0.0.1/32' );

        } );

        it( "should not add the same address twice", function() {

            expect( internet.add_address( this.iface, '1.0.0.1' ) ).toBeTruthy();
            expect( internet.add_address( this.iface, '1.0.0.1' ) ).toBeFalsy();

            expect( internet.addresses( this.iface ).length ).toEqual( 1 );

        } );

    } );

    describe( "delete_address", function() {

        beforeEach( function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

        } );

        it( "should remove the given address from the interface", function() {

            internet.delete_address( this.iface, '1.0.0.1/24' );

            expect( internet.addresses( this.iface ) ).not.toContain( '1.0.0.1/24' );

        } );

        it( "should not do anything if the address is not assigned to the interface", function() {

            internet.delete_address( this.iface, '1.0.0.1/24' );
            internet.delete_address( this.iface, '1.0.0.1/24' );

            expect( internet.addresses( this.iface ) ).not.toContain( '1.0.0.1/24' );

        } );

        it( "should remove the first address with the given ip if no subnet is given", function() {

            internet.add_address( this.iface, '1.0.0.1/32' );

            internet.delete_address( this.iface, '1.0.0.1' );

            expect( internet.addresses( this.iface ).length ).toEqual( 1 );
            expect( internet.addresses( this.iface )[0] ).toEqual( '1.0.0.1/32' );

        } );

    } );

    describe( "has_address", function() {

        it( "should return false if the interface with the address is down", function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

            this.is_up_mock.and.returnValue( false );

            expect( internet.has_address( '1.0.0.1/24' ) ).toBeFalsy();

        } );

        it( "should return true if the interface has the given address assigned", function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

            expect( internet.has_address( this.system, '1.0.0.1' ) ).toBeTruthy();

        } );

    } );

    describe( "add_route", function() {

        beforeEach( function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

        } );

        it( "should add a route", function() {

            internet.add_route( this.iface, '10.0.0.0/24', null );

            var route = internet.route( this.system, '10.0.0.0/24' );

            expect( internet.route_iface( route ) ).toEqual( this.iface );
            expect( internet.route_to( route ).networkAddress ).toEqual( '10.0.0.0' );
            expect( internet.route_to( route ).subnetMaskLength ).toEqual( 24 );
            expect( internet.route_via( route ) ).toEqual( null );

        } );

        it( "should throw an error if a route to the given subnet already exists", function() {

            internet.add_route( this.iface, '10.0.0.0/24', null );

            expect( function() {
                internet.add_route( this.iface, '10.0.0.0/24', null );
            }.bind( this ) ).toThrowError( "Route already exists." );

        } );

        it( "should throw an error if the given via ip address is unreachable via the given interface", function() {

            expect( function() {
                internet.add_route( this.iface, '10.0.0.0/24', '2.0.0.0' );
            }.bind( this ) ).toThrowError( "Network is unreachable." );

        } );

        it( "should be able to add a default gateway route", function() {

            internet.add_route( this.iface, internet.DEFAULT_GATEWAY, '1.0.0.2' );

        } );

    } );

    describe( "delete_route", function() {

        beforeEach( function() {

            internet.add_address( this.iface, '1.0.0.1/24' );
            internet.add_route( this.iface, '1.0.0.0/24', null );

        } );

        it( "should delete a route with the given subnet", function() {

            internet.delete_route( this.system, '1.0.0.0/24' );

            expect( internet.route( this.system, '1.0.0.0/24' ) ).toBeUndefined();

        } );

        it( "should throw an error if a route with the given subnet was not found", function() {

            expect( function() {
                internet.delete_route( this.system, '2.0.0.0/24' );
            }.bind( this ) ).toThrowError( "No such route." );

        } );

    } );

    describe( "arp_resolve", function() {

        beforeEach( function() {

            this.iface2 = {
                network: this.network,
            };
            var sys2 = {
                network_interfaces: { '1': this.iface2 }
            };
            
            this.iface2.system = sys2;
            this.network[2] = this.iface2;

            internet.add_address( this.iface, '1.0.0.1/24' );
            internet.add_address( this.iface2, '1.0.0.2/24' );

        } );

        it( "should return the physical address of the interface on the network with the given ip", function() {

            expect( internet.arp_resolve( this.iface, '1.0.0.2' ) ).toEqual( this.iface2 );

        } );

        it( "should return null if no device was found with the given ip", function() {

            expect( internet.arp_resolve( this.iface, '1.0.0.3' ) ).toEqual( null );

        } );

    } );

    describe( "__next_hop", function() {

        beforeEach( function() {

            internet.add_address( this.iface, '1.0.0.1/24' );

        } );

        it( "should find a route to it's own interfaces", function() {

            expect( internet.__next_hop( this.system, '1.0.0.1' ) ).toEqual( [ [ this.iface ] ] );

        } );

        it( "should find a route to any addresses in the subnet of any interface", function() {

            expect( internet.__next_hop( this.system, '1.0.0.2' ) ).toEqual( [ [ this.iface ] ] );

        } );

        it( "should return null if the given ip address could not be reached by any route", function() {

            expect(internet.__next_hop( this.system, '2.0.0.1' ) ).toEqual( null );

        } );

        it( "should route along networks", function() {

            var sys2 = {},
                iface2 = { 
                    system: sys2,
                    network: this.network,
                },
                iface3 = {
                    system: sys2,
                    network: {},
                };
            sys2.network_interfaces = {
                '1': iface2,
                '2': iface3,
            };

            this.network[2] = iface2;
            iface3.network[1] = iface3

            internet.add_address( iface2, '1.0.0.2/24' );
            internet.add_address( iface3, '2.0.0.1/24' );

            internet.add_route( this.iface, '2.0.0.0/24', '1.0.0.2' );

            expect( internet.__next_hop( this.system, '2.0.0.1' ) ).toEqual( [ [ this.iface, iface2 ], [ iface3 ] ] );

        } );

    } );

    describe( "ip_routing", function() {

        it( "should throw an error if the network is not reachable", function() {

            spyOn( internet, '__next_hop' ).and.returnValue( null );

            expect( function() {
                internet.ip_routing( {}, '1.0.0.0' );
            }.bind( this ) ).toThrowError( "Network is unreachable." );

        } );

    } );

} );
