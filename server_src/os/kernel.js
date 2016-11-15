( function( e ) {

    e.create_system = function() {

        return {

            installed_programs: [],

        };

    };

    e.install = function( system, program ) {

        if ( system.installed_programs[program.CMD] || !program )
            return false;

        system.installed_programs[program.CMD] = program;

        return true;

    };

    e.installed_programs = function( system ) {

        return Object.keys( system.installed_programs ).sort();

    };

    e.is_installed = function( system, program_or_cmd ) {

        if ( program_or_cmd.CMD )
            return system.installed_programs[program_or_cmd.CMD];

        return system.installed_programs[program_or_cmd];

    };

    e.uninstall = function( system, program ) {

        if ( !system.installed_programs[program.CMD] )
            return false;

        delete system.installed_programs[program.CMD];

        return true;

    };

}( module.exports ) );
