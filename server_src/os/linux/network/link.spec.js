describe( "Linux Network Link Layer:", function() {
    
    var link = require( './link.js' ),
        fs = require( '../../fs.js' ),
        kernel = require( '../../kernel.js' );

    beforeEach( function() {

        this.system = {};

    } );

    describe( "__generate_physical_address", function() {

        it( "should generate a MAC address", function() {
        
            expect( link.__generate_physical_address( 1 ) ).toMatch( /([0-9A-F]{2}:){5}[0-9A-F]{2}/ );

        } );

        it( "should generate the same address for the same seed", function() {

            expect( link.__generate_physical_address( 1 ) ).toEqual( link.__generate_physical_address( 1 ) );

        } );

    } );

    describe( "add_interface", function() {
        
        beforeEach( function() {
            
            spyOn( fs, 'root_directory' ).and.returnValue( {} );
            spyOn( fs, 'lookup' ).and.returnValue( {} );
            spyOn( fs, 'filetype' ).and.returnValue( fs.FT_DIRECTORY );
            spyOn( fs, 'create' );
            
        } );

        it( "should add an interface to the given system", function() {

            expect( link.network_interfaces( this.system ) ).toEqual( {} );

            var iface = link.add_interface( this.system );

            expect( link.network_interfaces( this.system )[link.name( iface )] ).toEqual( iface );

        } );

        it( "should use the name provided for the interface, if any", function() {

            var iface = link.add_interface( this.system, "wlan0" );

            expect( link.network_interfaces( this.system )['wlan0'] ).toEqual( iface );
            expect( link.name( iface ) ).toEqual( "wlan0" );

        } );

        it( "should throw an error if the given name is already taken by an interface", function() {

            link.add_interface( this.system, "eth0" );
            
            expect( function() {
                link.add_interface( this.system, "eth0" );
            }.bind( this ) ).toThrowError( "Interface already exists: eth0" );

        } );

        it( "should give random physical addresses to the interfaces", function() {

            var i1 = link.add_interface( this.system ),
                i2 = link.add_interface( this.system );

            expect( link.physical_address( i1 ) ).not.toEqual( link.physical_address( i2 ) );

        } );

        it( "should use the given physical address if any", function() {

            var i = link.add_interface( this.system, null, 'FF:FF:FF:FF:FF:FF' );

            expect( link.physical_address( i ) ).toEqual( 'FF:FF:FF:FF:FF:FF' );

        } );

    } );
    
} );
