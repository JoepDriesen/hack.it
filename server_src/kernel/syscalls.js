( function( e ) {

    var world_globals = require( '../world_globals.js' ),
        kernel = require( '../kernel/kernel.js' ),
        proc = require( '../kernel/process.js' );
    
    // COMMUNICATION
    
    /*
     * Accept a connection on a socket
     * http://man7.org/linux/man-pages/man2/accept.2.html
     */
    e.accept = function( process, socketfd ) {
        
    };
    
    /*
     * bind a name to a socket
     * http://man7.org/linux/man-pages/man2/bind.2.html
     */
    e.bind = function( process, socketfd, address ) {
        
    };
    
    /*
     * initiate a connection on a socket
     * http://man7.org/linux/man-pages/man2/connect.2.html
     */
    e.connect = function( process, socketfd, address ) {
        
    }
    
    /*
     * get name of connected peer socket
     * http://man7.org/linux/man-pages/man2/getpeername.2.html
     */
    e.getpeername = function( process, socketfd ) {
        
    };
    
    /*
     * get socket name
     * http://man7.org/linux/man-pages/man2/getsockname.2.html
     */
    e.getsockname = function( process, socketfd ) {
        
    };
    
    /*
     * listen for connections on a socket
     * http://man7.org/linux/man-pages/man2/listen.2.html
     */
    e.listen = function( process, socketfd ) {
        
    };
    
    /*
     * shut down part of a full-duplex connection
     * http://man7.org/linux/man-pages/man2/shutdown.2.html
     */
    e.shutdown = function( process, socketfd, how ) {
        
    };
    
    /*
     * create a pair of connected sockets
     * http://man7.org/linux/man-pages/man2/socketpair.2.html
     */
    e.socketpair = function( process, domain, type, protocol ) {
        
    };
    
    // DEVICE MANAGEMENT
    
    /*
     * control device
     * http://man7.org/linux/man-pages/man2/ioctl.2.html
     */
    e.ioctl = function( process, fd, request ) {
        
    };
    
    // FILE MANAGEMENT
    
    /*
     * change working directory
     * http://man7.org/linux/man-pages/man2/chdir.2.html
     */
    e.chdir = function( process, pathname ) {
        
    };
    e.fchdir = function( process, fd ) {
        
    };
    
    /*
     * change permissions of a file
     * http://man7.org/linux/man-pages/man2/chmod.2.html
     */
    e.chmod = function( process, pathname, mode ) {
        
    };
    e.fchmod = function( process, fd, mode ) {
        
    };
    
    /*
     * change ownership of a file
     * http://man7.org/linux/man-pages/man2/chown.2.html
     */
    e.chown = function( process, pathname, uid, gid ) {
        
    };
    e.fchown = function( process, fd, uid, guid ) {
        
    };
    
    /*
     * change root directory
     * http://man7.org/linux/man-pages/man2/chroot.2.html
     */
    e.chroot = function( process, pathname ) {
        
    };
    
    /*
     * close a file descriptor
     * http://man7.org/linux/man-pages/man2/close.2.html
     */
    e.close = function( process, fd ) {
        
    };
    
    /*
     * get current working directory
     * http://man7.org/linux/man-pages/man2/getcwd.2.html
     */
    e.getcwd = function( process ) {
        
    };
    
    /*
     * get directory entries
     * http://man7.org/linux/man-pages/man2/getdents.2.html
     */
    e.getdents = function( process, fd ) {
        
    };
    
    /*
     * make a new name for a file
     * http://man7.org/linux/man-pages/man2/link.2.html
     */
    e.link = function( process, oldpath, newpath ) {
        
    };
    
    /*
     * create a directory
     * http://man7.org/linux/man-pages/man2/mkdir.2.html
     */
    e.mkdir = function( process, pathname, mode ) {
        
    };
    
    /*
     * create a special or ordinary file
     * http://man7.org/linux/man-pages/man2/mknod.2.html
     */
    e.mknod = function( process, pathname, mode, dev ) {
        
    };
    
    /*
     * mount filesystem
     * http://man7.org/linux/man-pages/man2/mount.2.html
     */
    e.mount = function( process, sourcepath, targetpath ) {
        
    };
    
    /*
     * open and possibly create a file
     * http://man7.org/linux/man-pages/man2/creat.2.html
     */
    e.open = function( process, pathname, flags, mode ) {
        
    };
    
    /*
     * create pipe
     * http://man7.org/linux/man-pages/man2/pipe2.2.html
     */
    e.pipe = function( process, fd, flags ) {
        
    };
    
    /*
     * read from a file descriptor
     * http://man7.org/linux/man-pages/man2/read.2.html
     */
    e.read = function( process, fd ) {
        
    };
    
    /*
     * read value of a symbolic link
     * http://man7.org/linux/man-pages/man2/readlink.2.html
     */
    e.readlink = function( process, pathname ) {
        
    };
    
    /*
     * change the name or location of a file
     * http://man7.org/linux/man-pages/man2/rename.2.html
     */
    e.rename = function( process, oldpath, newpath ) {
        
    };
    
    /*
     * delete a directory
     * http://man7.org/linux/man-pages/man2/rmdir.2.html
     */
    e.rmdir = function( process, pathname ) {
        
    };
    
    /*
     * transfer data between file descriptors
     * http://man7.org/linux/man-pages/man2/sendfile.2.html
     */
    e.sendfile = function( process, out_fd, in_fd ) {
        
    };
    
    /*
     * get file status
     * http://man7.org/linux/man-pages/man2/fstat.2.html
     */
    e.stat = function( process, pathname ) {
        
    };
    e.fstat = function( process, fd ) {
        
    };
    
    /*
     * make a new name for a file
     * http://man7.org/linux/man-pages/man2/symlink.2.html
     */
    e.symlink = function( process, targetpath, linkpath ) {
        
    };
    
    /*
     * truncate a file to a specified length
     * http://man7.org/linux/man-pages/man2/ftruncate.2.html
     */
    e.truncate = function( process, pathname, length ) {
        
    };
    e.ftruncate = function( process, fd, length ) {
        
    };
    
    /*
     * duplicating pipe content
     * http://man7.org/linux/man-pages/man2/tee.2.html
     */
    e.tee = function( process, fd_in, fd_out ) {
        
    };
    
    /*
     * unmount filesystem
     * http://man7.org/linux/man-pages/man2/umount.2.html
     */
    e.umount = function( process, target ) {
        
    };
    
    /*
     * delete a name and possibly the file it refers to
     * http://man7.org/linux/man-pages/man2/unlink.2.html
     */
    e.unlink = function( process, pathname ) {
        
    };
    
    /*
     * get filesystem statistics
     * http://man7.org/linux/man-pages/man2/ustat.2.html
     */
    e.ustat = function( process, dev ) {
        
    };
    
    /*
     * change file last access and modification times
     * http://man7.org/linux/man-pages/man2/utime.2.html
     */
    e.utime = function( process, actime, modtime ) {
        
    };
    
    /*
     * write to a file descriptor
     * http://man7.org/linux/man-pages/man2/write.2.html
     */
    e.write = function( process, fd, data ) {
        
    };
    
    // INFORMATION MAINTENANCE
    
    /*
     * get/set NIS domain name
     * http://man7.org/linux/man-pages/man2/setdomainname.2.html
     */
    e.getdomainname = function( process ) {
        
    };
    e.setdomainname = function( process, name ) {
        
    };
    
    /*
     * get/set hostname
     * http://man7.org/linux/man-pages/man2/sethostname.2.html
     */
    e.gethostname = function( process ) {

        return kernel.hostname( proc.system( process ) );
        
    };
    e.sethostname = function( process, name ) {
        
    };
    
    /*
     * obtain a series of random bytes
     * http://man7.org/linux/man-pages/man2/getrandom.2.html
     */
    e.getrandom = function( process, len ) {
        
    };
    
    /*
     * get / set time
     * http://man7.org/linux/man-pages/man2/gettimeofday.2.html
     */
    e.gettimeofday = function( process ) {
        
    };
    e.settimeofday = function( process, time, timezone ) {
        
    };
    
    /*
     * read/write system parameters
     * http://man7.org/linux/man-pages/man2/_sysctl.2.html
     */
    e.sysctl = function( process, param_name, param_value ) {
        
    };
    
    /*
     * return system information
     * http://man7.org/linux/man-pages/man2/sysinfo.2.html
     */
    e.sysinfo = function( process ) {
        
    };
    
    /*
     * get time in seconds
     * http://man7.org/linux/man-pages/man2/time.2.html
     */
    e.time = function( process ) {
        
    };
    
    /*
     * get name and information about current kernel
     * http://man7.org/linux/man-pages/man2/uname.2.html
     */
    e.uname = function( process ) {
        
    };
    
    // PROCESS CONTROL
    
    /*
     * execute program
     * http://man7.org/linux/man-pages/man2/execve.2.html
     */
    e.execve = function( process, filepath, args, env ) {
        
    };
    e.fexecve = function( process, fd, args, env ) {
        
    };
    
    /*
     * terminate the calling process
     * http://man7.org/linux/man-pages/man2/exit.2.html
     */
    e.exit = function( process, status ) {
        
    };
    
    /*
     * create a child process
     * http://man7.org/linux/man-pages/man2/fork.2.html
     */
    e.fork = function( process ) {
        
    };
    
    /*
     * get / set group identity
     * http://man7.org/linux/man-pages/man2/getegid.2.html
     * http://man7.org/linux/man-pages/man2/setgid.2.html
     */
    e.getgid = function( process ) {

        return proc.gid( process );
        
    };
    e.setgid = function( process, gid ) {
        
    };
    
    /*
     * get/set list of supplementary group IDs
     * http://man7.org/linux/man-pages/man2/getgroups.2.html
     */
    e.getgroups = function( process ) {
        
    };
    e.setgroups = function( process, gid_list ) {
        
    };
    
    /*
     * set/get process group
     * http://man7.org/linux/man-pages/man2/getpgid.2.html
     */
    e.getpgid = function( process, pid ) {
        
    };
    e.setpgid = function( process, pid, gid ) {
        
    };
    
    /*
     * get process identification
     * man7.org/linux/man-pages/man2/getpid.2.html
     */
    e.getpid = function( process ) {

        return proc.pid( process );
        
    };
    
    /*
     * get resource usage
     * http://man7.org/linux/man-pages/man2/getrusage.2.html
     */
    e.getrusage = function( process, who ) {
        
    };
    
    /*
     * get user identity
     * http://man7.org/linux/man-pages/man2/geteuid.2.html
     */
    e.getuid = function( process ) {

        return proc.uid( process );
        
    };
    e.setuid = function( process, uid ) {
        
    };
    
    /*
     * send signal to a process
     * http://man7.org/linux/man-pages/man2/kill.2.html
     */
    e.kill = function( process, pid, signal ) {
        
    };
    
    /*
     * reboot the system
     * http://man7.org/linux/man-pages/man2/reboot.2.html
     */
    e.reboot = function( process ) {
        
    };
    
    /*
     * get process times
     * http://man7.org/linux/man-pages/man2/times.2.html
     */
    e.times = function( process ) {
        
    };
    
    /*
     * create a child process and block parent
     * http://man7.org/linux/man-pages/man2/vfork.2.html
     */
    e.vfork = function( process ) {
        
    };


    /*
     * returns a function that can be used for syscalls bound
     * to the given process
     */
    e.userspace_syscalls = function( process ) {

        return function() {

            if ( arguments.length <= 0 )
                throw new SyscallError( 'None' );

            var syscall_name = arguments[0];

            arguments[0] = process;

            e[syscall_name].apply( null, arguments )

        };

    };
    
}( module.exports ) )
