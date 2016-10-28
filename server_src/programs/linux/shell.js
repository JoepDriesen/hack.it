( function( e ) {

    var linux = require( '../../os/linux.js' );
    var fs = require( '../../os/fs.js' );

    e.CMD = 'shell';


    e.on_command_input = function( system, proc, command ) {
    
        var command = e.parse_command( command );
        
        if ( command.length <= 0 ) {

            e.print_prompt( system, proc );
            return 1;
        }
    
        else if ( e.builtin[command[0]] ) {

            var ret = e.builtin[command[0]]( system, proc, command );
            e.print_prompt( system, proc );

            return ret;
        }

        else if ( system.installed_programs[command[0]] ) {

            proc.inf.removeListener( 'data', proc.params.read_callback );
            proc.is_running = false;

            var p = linux.run( system, system.installed_programs[command[0]], proc.inf, proc.outf, proc.errf, command, function() {

                proc.inf.on( 'data', proc.params.read_callback );
                proc.is_running = true;
                e.print_prompt( system, proc );

            } );
            
        } 
        
        else {

            proc.outf.write( "shell: " + command[0] + ": command not found\n" );
            e.print_prompt( system, proc );
            return ret;
        
        }
    
    };
    
    e.on_startup = function( system, proc, args, exit_callback ) {
    
        proc.env_vars = {
            PWD: '/',
        };

        proc.params = {
            exit_callback: exit_callback,
            read_callback: function( d ) {
                e.on_command_input( system, proc, d.toString() );
            },

        };
    
        e.print_prompt( system, proc );
        
        proc.inf.on( 'data', proc.params.read_callback );
    
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
    
    e.print_prompt = function( system, proc ) {
    
        proc.outf.write( '$ ' );
    
    };

    
    
    
    /*
     * BUILTIN COMMANDS
     */

    e.builtin = {
        cd: function( system, proc, args ) {
        
            var dir = args[1];

            if ( !dir ) {

                proc.outf.write( "cd: At least one argument is required\n");
                return 1;

            }

            var abs_dir = fs.join( system.fs, proc.env_vars.PWD, dir );

            if ( !fs.exists( system.fs, abs_dir ) ) {

                proc.outf.write( "cd: " + dir + ": No such file or directory\n" );
                return 1;

            }

            if ( !fs.is_dir( system.fs, abs_dir ) ) {

                proc.outf.write( "cd: " + dir + ": Not a directory\n" );
                return 1;

            }

            proc.env_vars.PWD = abs_dir;
            return 0;

        },

        exit: function( system, proc, args ) {

            proc.inf.removeListener( 'data', proc.params.read_callback );

            linux.quit( system, proc.pid, proc.params.exit_callback );

            return 0;

        },
        
        ls: function( system, proc, args ) {
            
            var abs_path;
            if ( args.length > 1 )
                abs_path = fs.join( system.fs, proc.env_vars.PWD, args[1] );
                
            else
                abs_path = proc.env_vars.PWD;
            
            try {
                
                var dirs = fs.listdir( system.fs, abs_path );
                
                if ( dirs.length > 0 )
                    proc.outf.write( dirs.join( '\t' ) + '\n' );
                
                return 0;
                
            } catch( err ) {
                
                proc.outf.write( 'ls: ' + err.message + '\n' );
                
            }
            
        },
        
        mkdir: function( system, proc, args ) {
        
            var dir = args[1];

            if ( !dir ) {

                proc.outf.write( "mkdir: At least one argument is required\n");
                return 1;

            }
            
            var abs_path = fs.join( system.fs, proc.env_vars.PWD, dir );
            
            try {
                
                fs.mkdir( system.fs, abs_path );
                
                return 0;
                
            } catch( err ) {
                
                proc.outf.write( 'mkdir: ' + err.message + '\n' );
            }
            
        },

        pwd: function( system, proc, args ) {

            proc.outf.write( proc.env_vars.PWD + '\n' );

        },
        
    };
    
 }( module.exports ) );
