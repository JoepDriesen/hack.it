( function( e ) {

    e.boot = function( system ) {

        system.is_on = true;

    };

    e.create_system = function() {

        return {

            is_on: false,

            installed_programs: [],

            process_list: [],
            next_pid: 1,

        };

    };

    e.install = function( system, program ) {

        if ( system.installed_programs.indexOf( program ) >= 0 )
            return false;

        system.installed_programs.push( program );

        if ( program.on_install )
            program.on_install( system );

        return true;

    };

    e.quit = function( system, pid ) {

    };

    e.run = function( system, program ) {

        if ( !system.is_on )
            throw new Error( "System is not booted" );

        var p = {
            pid: system.next_pid,
            program: program,
        };
        system.process_list.push( p );

        system.next_pid++;

        if ( program.on_startup )
            program.on_startup( system );

        return p;

    };

    e.shutdown = function( system ) {

        system.is_on = false;

    };

}( module.exports ) );
