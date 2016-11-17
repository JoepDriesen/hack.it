( function( e ) {

    var fs = require( './fs.js' ),
        EventEmitter = require( 'events' );


    
    e.STDIN = process.stdin;
    e.STDIN.filetype = fs.FT_CHARACTER;

    e.STDOUT = process.stdout;
    e.STDOUT.filetype = fs.FT_REGULAR;

    e.STDERR = process.stderr;
    e.STDERR.filetype = fs.FT_REGULAR;


    e._create_file_descriptor = function( filetype ) {

        var fd = new EventEmitter();
        fd.filetype = filetype;

        return fd;

    };

    e.open = function( system, path, mode ) {

    };

    e.read = function( file_descriptor, callback ) {

        var filetype = file_descriptor.filetype;

        switch( filetype ) {

            case fs.FT_REGULAR:
                throw new Error( "Not implemented" );

            case fs.FT_DIRECTORY:
                throw new Error( "Cannot read from directory." );

            case fs.FT_CHARACTER:

                file_descriptor.once( 'data', function( d ) {
                    callback( d.toString() );
                } );

                break;

            case fs.FT_PIPE:

                file_descriptor.read_callback = callback;

                break;

            case fs.FT_SOCKET:

                file_descriptor.once( 'data_read', callback );

                break;

            default:
                throw new Error( "Invalid file descriptor." );

        }

    };

    e.write = function( file_descriptor, data ) {

        var filetype = file_descriptor.filetype;

        switch ( filetype ) {

            case fs.FT_REGULAR:

                file_descriptor.write( data );

                break;

            case fs.FT_DIRECTORY:
                throw new Error( "Cannot write to directory." );

            case fs.FT_CHARACTER:
                throw new Error( "Cannot write to character device." );
            
            case fs.FT_PIPE:

                if ( !file_descriptor.read_callback )
                    return;

                file_descriptor.read_callback( data );

                delete file_descriptor.read_callback;

                break;

            case fs.FT_SOCKET:

                file_descriptor.emit( 'data_write', data );

                break;

            default:
                throw new Error( "Invalid file descriptor." );

        }

    };

}( module.exports ) );
