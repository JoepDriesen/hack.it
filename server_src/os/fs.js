( function( e ) {

    e.mkdir = function( name, parent_dir, mode ) {

        var inode = {
            child_inodes: []
        };

        if ( parent_dir )
            parent_dir.child_inodes.push( inode );

        return inode;

    };

    e.listdir = function( dir_inode ) {

        return dir_inode.child_inodes;

    };

    e.rmdir = function( dir_inode, parent_dir ) {

        var i = parent_dir.child_inodes.indexOf( dir_inode );

        if ( i < 0 )
            return false;

        delete parent_dir.child_inodes[i];

        return true;

    };

}( exports ) );
