describe( "kFile", function() {

    var kFile = require( './file.js' );

    beforeEach( function() {

        this.file = new kFile();

    } );

    it( "should return its contents when read, terminated by a null byte.", function() {

        expect( this.file.read() ).toEqual( '\0' );

        this.file.content = '123';

        expect( this.file.read() ).toEqual( '123\0' );

    } );

} );
