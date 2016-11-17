describe( "Userspace Process Management", function() {

    var proc = require( './process.js' );

    beforeEach( function() {

        this.process = {};

    } );

    describe( "get/set/delete process data", function() {

        it( "should work", function() {

            expect( proc.get_process_data( this.process, 'test' ) ).toBeUndefined();

            proc.set_process_data( this.process, 'test', 1 );

            expect( proc.get_process_data( this.process, 'test' ) ).toEqual( 1 );

            proc.delete_process_data( this.process, 'test' );

            expect( proc.get_process_data( this.process, 'test' ) ).toBeUndefined();

        } );

    } );

} );
