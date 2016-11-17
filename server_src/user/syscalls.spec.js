describe( "System calls", function() {

    var world_globals = require( '../world_globals.js' ),
        syscalls = require( './syscalls.js' ),
        kernel = require( '../kernel/kernel.js' ),
        proc = require( '../kernel/process.js' );

    beforeEach( function() {

        this.system = {};
        this.process = {};

        spyOn( world_globals, 'current_process' ).and.returnValue( this.process );
        spyOn( proc, 'system' ).and.callFake( function( process ) {
            if ( process === this.process )
                return this.system;
        }.bind( this ) );

    } );

    describe( "getcwd", function() {



    } );

    describe( "gethostname", function() {

        beforeEach( function() {

            spyOn( kernel, 'hostname' ).and.callFake( function( system ) {
                if ( system === this.system )
                   return 'testhost';
            }.bind( this ) );

        } );

        it( "should return the hostname of the system", function() {

            expect( syscalls.gethostname() ).toEqual( 'testhost' );

        } );           

    } );

    describe( "read", function() {

    } );

    describe( "write", function() {

    } );

} );
