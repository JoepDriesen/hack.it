( function( e ) {

    e.READ_FAST = 0;
    e.READ_SLOW = 1;



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
