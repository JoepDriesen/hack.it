( function( e ) {

    e.TYPES = {
        GENERATED: 0,
        MANAGED: 1,
    }

    e.abspath = function( basepath, relpath ) {

    };

    e.create_fs = function( type ) {

        return {
            type: type,

            sep: '/',
            drive: '',

            root: {
                parent_inode: null,
                child_inodes: [],
            }
        };
    };

    e.exists = function( fs, abspath ) {

        

    };

    e.is_dir = function( fs, abspath ) {

    };

    e.is_file = function( fs, abspath ) {

    };

    e.is_link = function( fs, abspath ) {

    };

    e.join = function( basepath, relpath ) {

    };

    e.normpath = function( path ) {

    };

    e.split = function( fs, path ) {

        for ( var i = path.length; i >= 0; i-- ) {

            if ( path[i] == fs.sep ) {

                if ( i == 0 )
                    return [fs.sep, path.slice( i+1 )]

                return [path.slice( 0, i ), path.slice( i+1 )];

            }

        }

        return ['', path];

    };

    e.splitall = function( fs, path ) {

        var parts = path.split( fs.sep );

    };


}( module.exports ) );
