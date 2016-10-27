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

    e.quit = function( system, pid ) {

        for ( var i = 0; i < system.process_list.length; i++ ) {

            var p = system.process_list[i];

            if ( p.pid < pid )
                continue;

            if ( p.pid > pid )
                return false;

            delete system.process_list[i];
            return p;

        }

        return false;

    };

    e.run = function( system, program, inf, outf, errf, args ) {

        if ( !system.is_on )
            throw new Error( "System is not booted" );

        var p = {
            pid: system.next_pid,
            program: program,

            inf: inf,
            outf: outf,
            errf: errf
        };
        system.process_list.push( p );

        system.next_pid++;

        if ( program.on_startup )
            program.on_startup( system, p, args );

        return p;

    };

    e.shutdown = function( system ) {

        system.is_on = false;

    };

}( module.exports ) );
