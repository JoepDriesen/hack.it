describe( "File functions:", function() {

    var file = require( './file.js' ),
        EventEmitter = require( 'events' );
/**
    describe( "read", function() {
        
        describe( "regular file", function() {

            it( "should immediately return the files content as data in the callback.", function() {

                var fd = {
                    readtype: file.FT_REGULAR,
                    file: {
                        content: "test",
                    },
                };

                var read = "";
                file.read( fd, function( data ) {
                    read = data;
                } );

                expect( read ).toEqual( "test" );

            } );
            
        } );
        
        describe( "directory file", function() {
            
            it( "should throw an error if a directory is read", function() {
                
                var fd = {
                    filetype: file.FT_DIRECTORY;
                };
                
                expect( function() {
                    file.read( fd );
                } ).toThrowError( "\")
            })
            
        } );

        it( "should call the callback function with the read data when data is available to read for a slow file", function() {

            var fd = new EventEmitter();
            fd.readtype = file.READ_SLOW;

            var read = "";
            file.read( fd, function( data ) {
                read = data;
            } );

            expect( read ).toEqual( "" );

            fd.emit( 'data', "test2" );

            expect( read ).toEqual( "test2" );

        } );

        it( "should only call the callback once", function() {

            var fd = new EventEmitter();
            fd.readtype = file.READ_SLOW;

            var read = "";
            file.read( fd, function( data ) {
                read = data;
            } );

            fd.emit( 'data', "test2" );
            fd.emit( 'data', "test3" );

            expect( read ).toEqual( "test2" );

        } );

    } );

    describe( "write", function() {

        it( "should call the write function of the file descriptor with the data to write", function() {

            var written,
                fd = {

                write: function( d ) {
                    written = d;
                },

            };

        } );

    } );
**/
} );
