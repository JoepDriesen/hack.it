( function( e ) {

    var ip = require( 'ip' ),
        kernel = require( '../../kernel.js' ),
        fs = require( '../../fs.js' ),
        seedrandom = require( 'seedrandom' );
   


    e.__MAC_SYMBOLS = '0123456789ABCDEF';
    e.__generate_physical_address = function( seed ) {

        var rng = new Math.seedrandom( seed );
        var addr = '';

        for ( var i = 0; i < 12; i++ ) {

            if ( i > 0 && i % 2 == 0 )
                addr += ':';

            addr += e.__MAC_SYMBOLS[Math.floor( rng( seed ) * e.__MAC_SYMBOLS.length )];
        
        }

        return addr;

    };
    
    e.add_interface = function( system, iface_name, physical_address ) {

        if ( !system.network_interfaces )
            system.network_interfaces = {};

        if ( !iface_name ) {

            var i = 1;
            while ( system.network_interfaces["eth" + i] )
                i++;

            iface_name = "eth" + i;

        } else if ( system.network_interfaces[iface_name] )
            throw new Error( "Interface already exists: " + iface_name );

        if ( !physical_address )
            physical_address = e.__generate_physical_address();

        var iface = {

            name: iface_name,
            physical_address: physical_address,

            system: system,

            is_up: false,

        };

        system.network_interfaces[iface_name] = iface;
        
        var root = fs.root_directory( fs.filesystem( system, '' ) );
        
        var dev_inode = fs.lookup( root, 'dev' );
        if ( !dev_inode )
            dev_inode = fs.mkdir( root, 'dev', 509 );
        if ( fs.filetype( dev_inode ) != fs.FT_DIRECTORY )
            throw new Error( "/dev is not a directory" );
        
        var net_inode = fs.lookup( dev_inode, 'net' );
        if ( !net_inode )
            net_inode = fs.mkdir( dev_inode, 'net', 509 );
        if ( fs.filetype( net_inode ) != fs.FT_DIRECTORY )
            throw new Error( "/dev/net is not a directory" );
        
        fs.create( net_inode, iface_name, 509, fs.FT_BLOCK );
        
        return iface;

    };

    e.is_up = function( iface, is_up ) {

        if ( is_up === undefined )
            return iface.is_up;
        
        iface.is_up = is_up;

    };

    e.name = function( iface, name ) {

        if ( name === undefined )
            return iface.name;
        
        iface.name = name;

    };

    e.network = function( iface, network ) {

        if ( network === undefined )
            return iface.network;
        
        iface.network = network;

    }

    e.physical_address = function( iface, physical_address ) {

        if ( physical_address === undefined )
            return iface.physical_address;
        
        iface.physical_address = physical_address;

    };

    /*
     * returns: {
     *      interface_name: interface,
     *      ...
     * };
     */
    e.network_interfaces = function( system ) {

        if ( !system.network_interfaces )
            return {}

        return system.network_interfaces;

    };

}( module.exports ) );
