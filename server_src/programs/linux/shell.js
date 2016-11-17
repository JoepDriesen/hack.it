( function( e ) {

    var syscalls = require( '../../user/syscalls.js' ),
        proc = require( '../../user/process.js' ),
        EventEmitter = require( 'events' );



    e.CMD = 'shell';
    e.EVENTS = new EventEmitter();

    e.EVENTS.on( 'start', function( process ) {

        proc.set_process_data( process, 'ENVIRONMENT_VARIABLES', {
            PWD: '/',
        } );

        e.print_prompt( process );

        file.read( proc.inf( process ), e.read_command( process ) );
        
    } );

    e.get_var = function( process, var_name ) {

        if ( !proc.get_process_data( process, 'ENVIRONMENT_VARIABLES' ) )
            return undefined;

        return proc.get_process_data( process, 'ENVIRONMENT_VARIABLES' )[var_name];

    };

    e.read_command = function( process ) {

        var read_command = function( data ) {

            e.on_command_input( process, data );

            if ( !proc.is_running( proc.system( process ), proc.pid( process ) ) || proc.blocked( process ) )
                return;
                
            e.print_prompt( process );
            file.read( proc.inf( process ), read_command );

        };

        return read_command;

    };


    e.on_command_input = function( process, command ) {
    
        var command = e.parse_command( command ),
            system = proc.system( process );
        
        if ( command.length <= 0 ) {

            return 1;
        }
    
        else if ( e.builtin[command[0]] ) {

            var ret = e.builtin[command[0]]( process, command );

            return ret;
        }

        var program = kernel.is_installed( system, command[0] );

        if ( program ) {

            var p = proc.start_process( system, program, command, proc.inf( process ), proc.outf( process ), proc.errf( process ) );

            if ( proc.is_running( system, proc.pid( p ) ) ) {

                proc.block( process );

                var stop_listener = function( program_process ) {
    
                    if ( proc.pid( program_process ) != proc.pid( p ) )
                        return;
    
                    program.EVENTS.removeListener( 'stop', stop_listener );
    
                    proc.unblock( process );
    
                    file.read( proc.inf( process ), e.read_command( process ) );
                    e.print_prompt( process );
    
                };
                program.EVENTS.on( 'stop', stop_listener );

            }

        } 
        
        else {

            file.write( proc.outf( process ), "shell: " + command[0] + ": command not found\n" );
            return ret;
        
        }
    
    };
    
    e.parse_command = function( command ) {
   
        command = command.trim();
    
        var parts = command.split( ' ' );
        var cleaned_parts = [];
    
        for ( var i = 0; i < parts.length; i++ ) {
    
            if ( parts[i] != '' )
                cleaned_parts.push( parts[i] );
    
        }
    
        return cleaned_parts;
    
    };
    
    e.print_prompt = function( process ) {

        syscalls.write( proc.outf( process ),
            '[root@' + syscalls.gethostname( process ) + ':' + syscalls.getcwd() + ']$ ' );
    
    };

    e.set_var = function( process, var_name, var_value ) {

        if ( !proc.get_process_data( process, 'ENVIRONMENT_VARIABLES' ) )
            proc.set_process_data( process, 'ENVIRONMENT_VARIABLES', {} );

        proc.get_process_data( process, 'ENVIRONMENT_VARIABLES' )[var_name] = var_value;

    };
    
    
    
    /*
     * BUILTIN COMMANDS
     */

    e.builtin = {

        cd: function( process, args ) {
        
            var path = args[1];

            if ( !path ) {

                file.write( proc.outf( process ), "cd: At least one argument is required\n" );
                return 1;

            }

            if ( !path.startsWith( '/' ) ) {

                abs_path = e.get_var( process, 'PWD' );
                   
                if ( !abs_path.endsWith( '/' ) )
                   abs_path += '/';
                       
                path = abs_path + path;

            }

            if ( !path.endsWith( '/' ) )
                path += '/';

            var path_parts = path.split( '/' ),
                filesystem = fs.filesystem( proc.system( process ), path_parts[0] ),
                inode;

            if ( !filesystem ) {

                file.write( proc.outf( process ), "cd: I/O error\n" );
                return 1;

            }

            path_parts.splice( 0, 1 );

            try {

                inode = fs.lookup_path( filesystem, path_parts );

            } catch ( e ) {

                file.write( proc.outf( process ), "cd: " + path + ': ' + e.message + "\n" );
                return 1;

            }

            e.set_var( process, 'PWD', path.substring( 0, path.length - 1 ) );
            return 0;

        },

        exit: function( process, args ) {

            proc.stop_process( proc.system( process ), proc.pid( process ) );

            return 0;

        },
        
        ls: function( process, args ) {
            
            var abs_path;
            if ( args.length > 1 )
                abs_path = args[1];
                
            else
                abs_path = e.get_var( process, 'PWD' );

            if ( abs_path.endsWith( '/' ) )
                abs_path = abs_path.substring( 0, abs_path.length - 1 );

            var path_parts = abs_path.split( '/' ),
                filesystem = fs.filesystem( proc.system( process ), path_parts[0] ),
                inode;

            if ( !filesystem ) {

                file.write( proc.outf( process ), "ls: I/O error\n" );
                return 1;

            }

            path_parts.splice( 0, 1 );

            try {
                
                inode = fs.lookup_path( filesystem, path_parts );

            } catch ( e ) {

                file.write( proc.outf( process ), "ls: " + e.message + "\n" );
                return 1;

            }

            var list = fs.list( inode );

            for ( var i in list ) {

                var entry = list[i];

                if ( fs.filetype( fs.lookup( inode, list[i] ) ) == fs.FT_DIRECTORY )
                    entry += "/";

                file.write( proc.outf( process ), entry + "  " );

            }
                
            if ( list.length > 0 )
                file.write( proc.outf( process ), '\n' );
                
            return 0;
            
        },
        
        mkdir: function( process, args ) {

            var dirname = args[1];

            if ( !dirname ) {

                file.write( proc.outf( process ), "mkdir: missing operand\n" );
                return 1;

            }
           
            var abs_path = proc.get_process_data( process, 'ENVIRONMENT_VARIABLES' ).PWD;
            
            if ( abs_path.endsWith( '/' ) )
                abs_path = abs_path.substring( 0, abs_path.length - 1 );

            var path_parts = abs_path.split( '/' ),
                filesystem = fs.filesystem( proc.system( process ), path_parts[0] ),
                inode;

            if ( !filesystem ) {

                file.write( proc.outf( process ), "mkdir: I/O error\n" );
                return 1;

            }

            path_parts.splice( 0, 1 );

            try {
                
                inode = fs.lookup_path( filesystem, path_parts );

            } catch ( e ) {

                file.write( proc.outf( process ), "mkdir: " + e.message + "\n" );
                return 1;
            
            }

            if ( fs.filetype( inode ) != fs.FT_DIRECTORY ) {

                proc.outf.write( "mkdir: " + abs_path + ": Not a directory\n" );
                return 1;

            }

            try {

                fs.mkdir( inode, dirname );

            } catch ( e ) {

                return 1;

            }
                
            return 0;
                
        },

        pwd: function( process, args ) {

            file.write( proc.outf( process ), e.get_var( process, 'PWD' ) + '\n' );

        },
            
    };
    
 }( module.exports ) );
