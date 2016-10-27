( function( e ) {

    var fs = require( '../../os/fs.js' );

    e.builtin_commands = [
        'cd', 'pwd'
    ];



    e.on_command_input = function( system, proc, command ) {
    
        var command = e.parse_command( command ),
            ret;
    
        if ( command.length <= 0 )
            ret = 1;
    
        else if ( e.builtin_commands.indexOf( command[0] ) >= 0 )
             ret = e[command[0]]( system, proc, command );
    
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

    e.cd = function( system, proc, args ) {
        
        var dir = args[1];
        var abs_dir = fs.abspath( proc.env_vars.PWD, dir );

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

    };
    
    e.pwd = function( system, proc, args ) {
    
        proc.outf.write( proc.env_vars.PWD + '\n' );
    
    };
    
 }( module.exports ) );
