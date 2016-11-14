( function( e ) {
    
    var file = require( './file.js' );
    
    e.create = function( dir, filename, mode, filetype ) {
        
        if ( dir.dentry.children[filename] )
            throw new Error( "File exists: " + filename );
        
        var new_dentry = {
            
            children: {},
            inode: {
                    
                    mode: mode,
                    uid: 0,
                    gid: 0,
                    
                    atime: 0,
                    mtime: 0,
                    ctime: 0,
                    
                    filetype: filetype,
                    
            },
            name: filename,
            parent: dir.dentry,
            
        };
        new_dentry.inode.dentry = new_dentry;
        
        dir.dentry.children[filename] = new_dentry;
        
        return new_dentry.inode;
        
    };
    
    e.create_filesystem = function() {
        
        var fs = {
            
            root: {
            
                children: {},
                inode: {
                    
                    mode: 509,
                    uid: 0,
                    gid: 0,
                    
                    atime: 0,
                    mtime: 0,
                    ctime: 0,
                    
                    filetype: file.FT_DIRECTORY,
                    
                },
                name: null,
                parent: null,
            
            }
            
        };
        fs.root.inode.dentry = fs.root;
        
        return fs;
        
    };
    
    e.filesystem = function( system, mount_point ) {
        
        if ( !system.fs || !system.fs[mount_point] )
            return null;
        
        return system.fs[mount_point];
        
    };
    
    e.filetype = function( inode ) {
        
        return inode.filetype;
        
    };
    
    e.list = function( dir ) {
        
        return Object.keys( dir.dentry.children ).sort();
        
    };
    
    e.lookup = function( dir, filename ) {
        
        if ( !dir.dentry.children[filename] )
            return null;
        
        return dir.dentry.children[filename].inode;
        
    };
    
    e.mkdir = function( dir, filename, mode ) {
        
        return e.create( dir, filename, mode, file.FT_DIRECTORY );
        
    };
    
    e.mode = function( inode ) {
        
        return inode.mode;
        
    };
    
    e.mount = function( system, filesystem, mount_point ) {
        
        if ( system.fs && system.fs[mount_point])
            throw new Error( "Filesystem present." );
        
        if ( !system.fs )
            system.fs = {};
        
        system.fs[mount_point] = filesystem;
        
    };
    
    e.rename = function( old_dir, old_filename, new_dir, new_filename ) {
        
        if ( !old_dir.dentry.children[old_filename] )
            throw new Error( "No such file or directory: " + old_filename );
        
        if ( new_dir.dentry.children[new_filename] )
            throw new Error( "File exists: " + new_filename );
        
        var new_dentry = {
            
            children: {},
            inode: old_dir.dentry.children[old_filename].inode,
            name: new_filename,
            parent: new_dir.dentry,
            
        };
        new_dentry.inode.dentry = new_dentry;
        
        new_dir.dentry.children[new_filename] = new_dentry;
        delete old_dir.dentry.children[old_filename];
        
    };

    e.rmdir = function( dir, filename ) {
        
        if ( !dir.dentry.children[filename] )
            throw new Error( "No such file or directory: " + filename );
        
        delete dir.dentry.children[filename];
        
    };
    
    e.root_directory = function( filesystem ) {
        
        return filesystem.root.inode;
        
    };
    
    
/**
    e.TYPES = {
        GENERATED: 0,
        MANAGED: 1,
    }

    e.exists = function( fs, abspath ) {

        var path_parts = e.splitall( fs, abspath );
        
        // Check for abs path
        if ( path_parts[0] !== fs.sep )
            return false;
        
        var cur_inode = fs.root;
        for ( var i = 1; i < path_parts.length; i++ ) {
            
            var name = path_parts[i];
            
            // TODO: check if cur_inode is dir?
            if ( name == '' )
                return cur_inode;
            
            var child = e.inodes.get_child_inode( cur_inode, name );
            
            if ( !child )
                return false;
            
            cur_inode = child;
                
        }
        
        return cur_inode;

    };

    e.is_dir = function( fs, abspath ) {
        
        return true;

    };

    e.is_file = function( fs, abspath ) {

    };

    e.is_link = function( fs, abspath ) {

    };

    e.join = function( fs, paths ) {
        
        if ( arguments.length <= 1 )
            return undefined;
        
        full_path = '';
        for ( var i = 1; i < arguments.length; i++ ) {
            
            var path = arguments[i];
            
            if ( path.startsWith( fs.sep ) )
                full_path = path;
            
            else {
                
                if ( !full_path.endsWith( fs.sep ) )
                    full_path += fs.sep;
            
                full_path += path
                
            }
            
        }
        
        return full_path;

    };
    
    e.listdir = function( fs, abspath ) {
        
        var inode = e.exists( fs, abspath );
        
        if ( !inode )
            throw new Error( "File or directory does not exist: " + abspath );
        
        return e.inodes.get_child_inodes( inode ).map( function( i ) {
            return e.inodes.get_inode_name( i );
        } ).sort();
        
    };
    
    e.mkdir = function( fs, abspath ) {
      
        if ( e.exists( fs, abspath ) ) {
            
            throw new Error( "File already exists: " + abspath );
        }
        
        var split = e.split( fs, abspath );
        var parent_node = e.exists( fs, split[0] );
        
        if ( !parent_node )
            throw new Error( "Directory does not exist: " + split[0] );
        
        e.inodes.add_child_inode( split[1], parent_node );
        
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
        
        if ( path.startsWith( fs.sep ) )
            parts[0] = fs.sep;
        
        else if ( parts.length == 1 )
            parts.splice( 0, 0, '' );
        
        return parts;

    };

    
    
    e.inodes = {
        
        add_child_inode: function( name, parent_inode, mode ) {
            
            if ( parent_inode[name] )
                throw new Error( "File or directory already exists: " + name );
            
            parent_inode.child_inodes[name] = {
                name: name,
                parent_inode: parent_inode,
                child_inodes: {},
            }
            
            return parent_inode.child_inodes[name];
            
        },
        
        create_fs: function( type ) {

            return {
                type: type,

                sep: '/',
                drive: '',

                root: {
                    name: '',
                    
                    parent_inode: null,
                    child_inodes: {},
                }
            };
            
        },
        
        get_child_inode: function( parent_inode, name ) {
            
            return parent_inode.child_inodes[name];
            
        },
        
        get_child_inodes: function( parent_inode ) {
            
            return Object.keys( parent_inode.child_inodes ).map( function( name ) {
                return parent_inode.child_inodes[name];
            } );
            
        },
        
        get_inode_name: function( inode ) {
            
            return inode.name;
            
        },
        
        remove_child_inode: function( name, parent_inode ) {
            
            if ( !parent_inode.child_inodes[name] )
                throw new Error( "File or directory does not exist: " + name );
            
            delete parent_inode.child_inodes[name];
            
        },
 
    };
*/
    
}( module.exports ) );
