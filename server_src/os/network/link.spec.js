describe( "Network Link Layer:", function() {
    
    var link = require( './link.js' ),
        kernel = require( '../kernel.js' );

    beforeEach( function() {

        this.system = {};
        this.network = link.create_network();

        this.system_is_on_spy = spyOn( kernel, 'is_on' ).and.returnValue( true );

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

        it( "should add an interface to the given system", function() {

            expect( link.system_interfaces( this.system ) ).toEqual( {} );

            var iface = link.add_interface( this.system );

            expect( link.system_interface( this.system, link.name( iface ) ) ).not.toBeFalsy();

            expect( link.system_interfaces( this.system )[link.name( iface )] ).toEqual( iface );

        } );

        it( "should use the name provided for the interface, if any", function() {

            var iface = link.add_interface( this.system, "wlan0" );

            expect( link.system_interface( this.system, "wlan0" ) ).toEqual( iface );
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

    } );
    
    describe( "attach", function() {
        
        beforeEach( function() {
            
            this.iface = link.add_interface( this.system );
            
        } );
        
        it( "should add the given interface to the network and set the network of the interface.", function() {
            
            link.attach( this.iface, this.network );
           
             
            expect( link.network_interface( this.network, link.physical_address( this.iface ) ) ).toEqual( this.iface );
            expect( link.network( this.iface ) ).toEqual( this.network );
            
        } );
        
        it( "should throw an error if the interface is already attached to a network.", function() {
            
            link.attach( this.iface, this.network );
            
            expect( function() {
                link.attach( this.iface, this.network );
            }.bind( this ) ).toThrowError( "Interface is already attached to network." );
        } );
        
    } );
    
    describe( "dettach", function() {
        
        beforeEach( function() {
            
            this.iface = link.add_interface( this.system );
            link.attach( this.iface, this.network );

        } );

        it( "should remove the given interface from the network if it is in it.", function() {
            
            link.dettach( this.iface, this.network );

            expect( link.network_interface( this.network, link.physical_address( this.iface ) ) ).toBeUndefined();
            expect( link.network( this.iface ) ).toEqual( null );
            
            expect( link.dettach( this.iface, this.network ) ).toBeFalsy();
            
        } );
        
    } );
   
    describe( "interface_up", function() {
        
        beforeEach( function() {
           
            this.iface = link.add_interface( this.system );
            link.attach( this.iface, this.network );
            
        } );

        it( "should throw an error if the system is not on", function() {

            this.system_is_on_spy.and.returnValue( false );

            expect( function() {
                link.interface_up( this.iface );
            }.bind( this ) ).toThrowError( "The system is not turned on." )

        } );
        
        it( "should throw an error if the interface is not attached to a network", function() {
            
            link.dettach( this.iface );
            
            expect( function() {
                link.interface_up( this.iface );
            }.bind( this ) ).toThrowError( "Interface is not attached to any network." );
            
        } );
        
        it( "should bring the interface up if the command is successfull", function() {

            link.interface_up( this.iface );

            expect( link.is_up( this.iface ) ).toBeTruthy();
        } );
        
    } );

    describe( "interface_down", function() {
        
        beforeEach( function() {

            this.iface = link.add_interface( this.system );
            link.attach( this.iface, this.network );
            link.interface_up( this.iface );
            
        } );


        it( "should throw an error if the system is not on", function() {

            this.system_is_on_spy.and.returnValue( false );

            expect( function() {
                link.interface_down( this.iface );
            }.bind( this ) ).toThrowError( "The system is not turned on." )

        } );

        it( "should remove the configuration information of the interface", function() {

            link.interface_down( this.iface );

            expect( link.is_up( this.iface ) ).toBeFalsy();

        } );
        
        it( "shouldn't remove itself from the arp table", function() {
            
            link.interface_down( this.iface );
            
            expect( link.network_interface( this.network, link.physical_address( this.iface ) ) ).toEqual( this.iface );
            
        } );

    } );

} );
