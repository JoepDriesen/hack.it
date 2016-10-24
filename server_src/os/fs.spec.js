describe( "Filesystem functions", function() {

    var fs = require( './fs.js' );

    describe( "listdir", function() {

        it( "should return a list of child directories of the given directory inode.", function() {

            var root = fs.mkdir( '', null );

            expect( fs.listdir( root ) ).toEqual( [] );

        } );

    } );

    describe( "mkdir", function() {

        it( "should return a new directory", function() {

            expect( fs.mkdir( '', null ) ).not.toEqual( undefined );

        } );

        it ( "should add the new directory to the children of the given parent directory", function() {
           
            var root = fs.mkdir( '', null );
            var subdir = fs.mkdir( 'test', root );

            expect( fs.listdir( root ) ).toContain( subdir );

        } );

    } );

    describe( "rmdir", function() {

        beforeEach( function() {

            this.root = fs.mkdir( '', null );
            this.subdir = fs.mkdir( '', this.root );

        } );

        it( "should return false if the given child inode does not exist", function() {

            var newdir = fs.mkdir( '', null );

            expect( fs.rmdir( newdir, this.root ) ).toBeFalsy();

        } );

        it( "should remove the given inode from the children of the given parent dir", function() {

            expect( fs.rmdir( this.subdir, this.root ) ).toBeTruthy();

            expect( fs.listdir( this.root ) ).not.toContain( this.subdir );

        } );

    } );

} );
