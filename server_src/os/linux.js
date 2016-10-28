( function( e ) {

    var fs = require( './fs.js' );
    var net = require( './network.js' );
    
    e.add_interface = function( system, name ) {
        
        if ( system.network_interfaces[name] )
            throw new Error( "Interface with this name already exists: " + name );
        
        var int = net.create_interface( system, name );
        
        system.network_interfaces[name] = int;
        
        return int;
        
    };

    e.boot = function( system ) {

        system.is_on = true;

    };

    e.create_system = function() {

        return {

            is_on: false,

            fs: fs.inodes.create_fs( fs.TYPES.MANAGED ),

            installed_programs: [],
            network_interfaces: {},
            process_list: [],
            next_pid: 1,

        };

    };

    e.install = function( system, program ) {

        if ( system.installed_programs[program.CMD] )
            return false;

        system.installed_programs[program.CMD] = program;

        if ( program.on_install )
            program.on_install( system );

        return true;

    };

    e.quit = function( system, pid, exit_callback ) {

        var i, p;
        for ( i = 0; i < system.process_list.length; i++ ) {
            
            p = system.process_list[i];

            if ( p.pid < pid )
                continue;

            if ( p.pid > pid )
                return false;

            break;

        }

        if ( p.pid == pid ) {

            system.process_list.splice( i, 1 );
            p.is_running = false;

            if ( exit_callback )
                exit_callback();

            return p;

        }

        return false;

    };

    e.quit_serivce = function( system, program ) {

        for ( var i in system.process_list ) {
            
            var p = system.process_list[i];
            
            if ( p.is_daemon && p.program == program ) {
                
                system.process_list.splice( i, 1 );
                p.is_running = false;
                
                return p;
                
            }
                
        }
        
        return false;

    };

    e.run = function( system, program, inf, outf, errf, args, exit_callback ) {

        if ( !system.is_on )
            throw new Error( "System is not booted" );

        if ( !program.on_startup ) {
            
            if ( program.on_service_start )
                throw new Error( "Usage: service start " + program.CMD );
        
            throw new Error( "Cannot run program" )
            
        }
        
        var p = {
            pid: system.next_pid,
            is_running: true,
            is_daemon: false,
            program: program,

            inf: inf,
            outf: outf,
            errf: errf
        };
        system.process_list.push( p );

        system.next_pid++;

        program.on_startup( system, p, args, exit_callback );

        return p;

    };

    e.run_service = function( system, program ) {

        if ( !system.is_on )
            throw new Error( "System is not booted" );

        if ( !program.on_service_start )
            throw new Error( "Cannot be run as a service: " + program.CMD );
        
        for ( var i in system.process_list ) {
            
            var p = system.process_list[i];
            if ( p.is_daemon && p.program == program )
                throw new Error( "Service is already running: " + program.CMD );
            
        }
        
        var p = {
            pid: system.next_pid,
            is_running: true,
            is_daemon: true,
            program: program,

            inf: {},
            outf: {},
            errf: {}
        };
        system.process_list.push( p );

        system.next_pid++;

        program.on_service_start( system, p );

        return p;

    };

    e.shutdown = function( system ) {

        system.is_on = false;

    };

}( module.exports ) );
