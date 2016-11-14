( function( e ) {

    e.boot = function( system ) {

        system.is_on = true;

    };

    e.create_system = function() {

        return {

            is_on: false,

            installed_programs: [],

        };

    };

    e.install = function( system, program_name, program ) {

        if ( system.installed_programs[program_name] || !program )
            return false;

        system.installed_programs[program_name] = program;

        return true;

    };

    e.installed_programs = function( system ) {

        return Object.keys( system.installed_programs ).sort();

    };

    e.is_installed = function( system, program_name ) {

        return system.installed_programs[program_name];

    };

    e.is_on = function( system ) {

        return system.is_on;

    };
    
    e.shutdown = function( system ) {

        system.is_on = false;

    };

    e.uninstall = function( system, program_name ) {

        if ( !system.installed_programs[program_name] )
            return false;

        delete system.installed_programs[program_name];

        return true;

    };

}( module.exports ) );
