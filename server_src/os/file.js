( function( e ) {

    // File Types
    e.FT_REGULAR = 0;
    e.FT_DIRECTORY = 1;
    e.FT_BLOCK = 2;
    e.FT_CHARACTER = 3;
    e.FT_PIPE = 4;
    e.FT_LINK = 5;
    e.FT_SOCKET = 6;



    e.read = function( file_descriptor, callback ) {

        if ( file_descriptor.readtype == e.READ_FAST ) {

            callback( file_descriptor.file.content );

            return true;

        } else if ( file_descriptor.readtype == e.READ_SLOW ) {

            file_descriptor.once( 'data', function( d ) {

                callback( d );

            } );

            return true;

        }

        throw new Error( "Invalid file descriptor" );

    };

    e.write = function( file_descriptor ) {

    };

}( module.exports ) );
