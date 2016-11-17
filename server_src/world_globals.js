( function( e ) {

    var systems = {};
    e.get_system = function( system_uid ) {

        return systems[system_uid];

    };
    e.register_system = function( system_uid, system ) {

        if ( systems[system_uid] )
            throw new Error( "System uid collision" );

        systems[system_uid] = system;

    };

    var current_process = null;
    e.current_process = function() {

        return current_process;

    };
    e.switch_process = function( process ) {

        current_process = process;

    };

}( module.exports ) );
