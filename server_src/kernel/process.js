( function( e ) {

    var syscalls = require( '../kernel/syscalls.js' );


    e.error_fd = function( process ) {

        return process.error_fd;

    };

    e.gid = function( process ) {

        return process.gid;

    };

    e.input_fd = function( process ) {

        return process.input_fd;

    };

    e.kernel = function( kernel ) {

        return process.system;

    };

    e.output_fd = function( process ) {

        return process.output_fd;

    };

    e.pid = function( process ) {

        return process.pid;

    };

    e.start_process = function( kernel, cmd_parts, input_fd, output_fd, error_fd ) {

        if ( !kernel.process_list ) {

            kernel.process_list = [];
            kernel.next_pid = 1;

        }

        if ( !input_fd )
            input_fd = file.STDIN;
        if ( !output_fd )
            output_fd = file.STDOUT;
        if ( !error_fd )
            error_fd = file.STDERR;
        
        var prog = kern.os_functions( kernel ).get_program( kernel, cmd_parts[0] );

        var p = {

            pid: system.next_pid,
            program: program,
            kernel: kernel,

            input_fd: input_fd,
            output_fd: output_fd,
            error_fd: error_fd,

        };

        kernel.process_list.push( p );
        kernel.next_pid++;

        prog.EVENTS.emit( 'start', userspace_syscalls( p ) );

        return p;

    };

    e.uid = function( process ) {

        return process.uid;

    };

    /**
    e.block = function( process ) {

        process.blocked = true;

    };

    e.blocked = function( process ) {
        
        return process.blocked;
        
    };
    
    e.delete_process_data = function( process, key ) {

        delete process.process_data[key];

    };

    e.get_process_data = function( process, key ) {

        return process.process_data[key];

    };

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

    e.set_process_data = function( process, key, data ) {

        process.process_data[key] = data;

    };

    e.start_process = function( system, program_cmd, args, inf, outf, errf ) {

        var program = kernel.is_installed( system, program_cmd );

        if ( !program )
            throw new Error( "Program is not installed: " + program_cmd );

        if ( !system.process_list ) {

            system.process_list = [];
            system.next_pid = 1;

        }

        if ( !inf )
            inf = file.STDIN;
        if ( !outf )
            outf = file.STDOUT;
        if ( !errf )
            errf = file.STDERR;
        
        var p = {
            
            pid: system.next_pid,
            program: program,
            system: system,

            blocked: false,

            inf: inf,
            outf: outf,
            errf: errf,

            process_data: {},

        };

        system.process_list.push( p );
        system.next_pid++;

        program.EVENTS.emit( 'start', p, args );

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

            p.program.EVENTS.emit( 'stop', p );

            return p;

        }

        return false;

    };

    e.system = function( process ) {

        return process.system;

    };

    e.unblock = function( process ) {

        process.blocked = false;

    };
*/
}( module.exports ) );
