( function( e ) {

    var syscalls = require( './syscalls.js' );

    e.block = function( process ) {

        process.blocked = true;

    };

    e.blocked = function( process ) {
        
        return process.blocked;
        
    };
    
    e.delete_process_data = function( process, key ) {

        if ( process.userspace_process_data )
            delete process.userspace_process_data[key];

    };

    e.errf = function( process ) {

        return process.errf;

    };

    e.get_process_data = function( process, key ) {

        if ( !process.userspace_process_data )
            return undefined;

        return process.userspace_process_data[key];

    };

    e.inf = function( process ) {

        return process.inf;

    };

    e.outf = function( process ) {

        return process.outf;

    };

    e.pid = function( process ) {

        return process.pid;

    };
    
    e.set_process_data = function( process, key, data ) {

        if ( !process.userspace_process_data )
            process.userspace_process_data = {};

        process.userspace_process_data[key] = data;

    };

    e.unblock = function( process ) {

        process.blocked = false;

    };

}( module.exports ) );
