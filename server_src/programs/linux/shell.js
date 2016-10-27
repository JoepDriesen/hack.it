( function( e ) {

    var linux = require( '../../os/linux.js' );
    var fs = require( '../../os/fs.js' );

    e.CMD = 'shell';


    e.on_command_input = function( system, proc, command ) {
    
        var command = e.parse_command( command ),
            ret;
    
        if ( command.length <= 0 )
            ret = 1;
    
        else if ( e.builtin[command[0]] )
            ret = e.builtin[command[0]]( system, proc, command );
        
        else if ( e.installed_programs[command[0]] )
            var p = linux.run( system, e.installed_programs[command[0]], proc.inf, proc.outf, proc.errf, command );
    
        e.print_prompt( system, proc );

        return ret;
    
    };
    
    e.on_startup = function( system, proc, args ) {
    
        proc.env_vars = {
            PWD: '/',
        };
    
        e.print_prompt( system, proc );
        
        proc.inf.on( 'data', function( d ) {
    
            e.on_command_input( system, proc, d.toString() );
    
        } );
    
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
