( function( e ) {

    var constructor = function( message ) {
        
        this.message = message;
        this.stack = ( new Error() ).stack;

    };

    e.SyscallError = function( syscall_name ) {
        constructor( "Unknown Syscall: " + syscall_name );
    };

}( module.exports ) )
