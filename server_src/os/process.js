( function( e ) {

    var kernel = require( './kernel.js' );

    e.is_running = function( system, pid ) {
        
        if ( !system.process_list )
            return false;

        var i, p;
        for( i = 0; i < system.process_list.length; i++ ) {

            p = system.process_list[i];

            if ( p.pid < pid )
                continue;

            if ( p.pid > pid )
                return false;

            break;

        }

        if ( p && p.pid == pid )
            return p;

        return false;

    };

    e.pid = function( process ) {

        return process.pid;

    };
    
    e.process_list = function( system ) {

        if ( !system.process_list )
            return [];

        return system.process_list;

    };

    e.start_process = function( system, program, is_daemon ) {

        if ( !system.process_list ) {

            system.process_list = [];
            system.next_pid = 1;

        }
        
        var p = {
            pid: system.next_pid,
        };

        system.process_list.push( p );
        system.next_pid++;

        return p;

    };

    e.stop_process = function( system, pid ) {

        if ( !system.process_list )
            return false;

        var i, p;
        for( i = 0; i < system.process_list.length; i++ ) {

            p = system.process_list[i];

            if ( p.pid < pid )
                continue;

            if ( p.pid > pid )
                return false;

            break;

        }

        if ( p.pid == pid ) {

            system.process_list.splice( i, 1 );

            return p;

        }

        return false;

    };


}( module.exports ) );
