describe( "File functions:", function() {

    var file = require( './file.js' ),
        fs = require( './fs.js' ),
        EventEmitter = require( 'events' );

    describe( "read/write", function() {
        
        describe( "directory file", function() {

            beforeEach( function() {

                this.fd = file._create_file_descriptor( fs.FT_DIRECTORY );

            } );
            
            it( "should throw an error if a directory is read", function() {
                
                expect( function() {
                    file.read( this.fd );
                }.bind( this ) ).toThrowError( "Cannot read from directory." );

            })
            
            it( "should throw an error if a directory is written to", function() {
                
                expect( function() {
                    file.write( this.fd );
                }.bind( this ) ).toThrowError( "Cannot write to directory." );
            })
            
        } );

        describe( "character stream file", function() {

            beforeEach( function() {

                this.fd = file._create_file_descriptor( fs.FT_CHARACTER );

            } );

            it( "should call the callback function when data available from the character stream", function() {

                var read = "";
                file.read( this.fd, function( data ) {
                    read = data;
                } );

                expect( read ).toEqual( "" );

                this.fd.emit( 'data', "test" );

                expect( read ).toEqual( "test" );

            } );

            it( "should throw an error when writing to the character stream", function() {

                expect( function() {
                    file.write( this.fd, "" );
                }.bind( this ) ).toThrowError( "Cannot write to character device." );

            } );

        } );

        describe( "pipe file", function() {

            beforeEach( function() {

                this.fd = file._create_file_descriptor( fs.FT_PIPE );

            } );

            it( "should call the callback function when data is written to the pipe", function() {

                var read = "";
                file.read( this.fd, function( data ) {
                    read = data;
                } );
    
                expect( read ).toEqual( "" );
    
                file.write( this.fd, "test2" );
    
                expect( read ).toEqual( "test2" );
    
            } );

            it( "should only call the callback once", function() {
    
                var read = "";
                file.read( this.fd, function( data ) {
                    read = data;
                } );
    
                file.write( this.fd, "test2" );
                file.write( this.fd, "test3" );
    
                expect( read ).toEqual( "test2" );
    
            } );

        } );

    } );

} );
