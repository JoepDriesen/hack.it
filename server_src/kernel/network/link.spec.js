describe( "Network Link Layer:", function() {
    
    var link = require( './link.js' ),
        kernel = require( '../kernel.js' ),
        fs = require( '../fs.js' );

    beforeEach( function() {

        this.system = {};
        this.network = link.create_network();
        
        this.system_link = {
            is_up: jasmine.createSpy( 'is_up' ).and.callFake( function( iface, is_up ) {
                if ( is_up === undefined )
                    return iface.is_up;
                iface.is_up = is_up;
            } ),
            network: jasmine.createSpy( 'network' ).and.callFake( function( iface, network ) {
                if ( network === undefined )
                    return iface.network;
                iface.network = network;
            } ),
            physical_address: jasmine.createSpy( 'physical_address' ).and.callFake( function( iface, physical_address ) {
                if ( physical_address === undefined )
                    return iface.physical_address;
                iface.physical_address = physical_address;
            } ),
        };
        
        spyOn( link, '_system_link' ).and.returnValue( this.system_link );
        

    } );
    
    describe( "attach", function() {
        
        beforeEach( function() {
            
            this.iface = {};
            
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
            
            this.iface = {};
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
           
            this.iface = {};
            link.attach( this.iface, this.network );
            
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

            this.iface = {};
            link.attach( this.iface, this.network );
            link.interface_up( this.iface );
            
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
