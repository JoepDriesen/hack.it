( function( e ) {
    
    var fs = require( './fs.js' ),
        proc = require( './process.js' ),
        sys = require( '../hardware/system.js' );

    var os_imports = {};
    os_imports[sys.OS_LINUX] = require( './linux/kernel.js' );
    
    
    e.boot = function( system, root_partition, os ) {
        
        var kernel = {
            
            system: system,
            os: os,
            
            hostname: 'localhost',
            installed_programs: {},
             
        };
        
        fs.mount( kernel, root_partition, '' );

        system.kernel = kernel;

        os_imports[os].boot( kernel, e );
        
        return kernel;
        
    };

    e.hostname = function( kernel ) {

        return kernel.hostname;

    };

    e.install = function( kernel, program ) {

        if ( kernel.installed_programs[program.CMD] || !program )
            return false;

        kernel.installed_programs[program.CMD] = program;

        return true;

    };

    e.installed_programs = function( kernel ) {

        return Object.keys( kernel.installed_programs ).sort();

    };

    e.is_installed = function( kernel, program_or_cmd ) {

        if ( program_or_cmd.CMD )
            return kernel.installed_programs[program_or_cmd.CMD];

        return kernel.installed_programs[program_or_cmd];

    };
    
    e.is_booted = function( system ) {
        
        return system.kernel;
        
    };
    
    e.os = function( kernel ) {
        
        return kernel.os;
        
    };

    e.os_functions = function( kernel ) {

        return os_imports[kernel.os];

    };
    
    e.shutdown = function( system ) {
        
        if ( !system.kernel )
            return false;
        
        delete system.kernel;
        
        return true;
        
    };

    e.system = function( kernel ) {

        return kernel.system;

    };

    e.uninstall = function( kernel, program ) {

        if ( !kernel.installed_programs[program.CMD] )
            return false;

        delete kernel.installed_programs[program.CMD];

        return true;

    };

}( module.exports ) );
