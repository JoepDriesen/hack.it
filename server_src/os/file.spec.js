describe( "File functions:", function() {

    var file = require( './file.js' ),
        EventEmitter = require( 'events' );

    describe( "read", function() {

        it( "should return the files content as data in the callback for a fast file", function() {

            var fd = {
                readtype: file.READ_FAST,
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

} );
