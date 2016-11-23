( function( e ) {

    var kernel = require( '../../kernel.js' ),
        fs = require( '../../fs.js' );

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
