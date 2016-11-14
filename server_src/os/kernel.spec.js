describe( "Kernel functions", function() {

    var kernel = require( './kernel.js' );

    describe( "create_system", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should not be turned on.", function() {

            expect( kernel.is_on( this.system ) ).toBeFalsy();

        } );

        it( "should not have any programs installed.", function() {

            expect( kernel.installed_programs( this.system ) ).toEqual( [] );

        } );

    } );

    describe( "boot", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should initialize the given system.", function() {

            kernel.boot( this.system );

            expect( kernel.is_on( this.system ) ).toBeTruthy();

        } );

    } );

    describe( "shutdown", function() {

        it( "should turn the system off.", function() {

            var system = kernel.create_system();
            kernel.boot( system );
            kernel.shutdown( system );

            expect( kernel.is_on( system ) ).toBeFalsy();

        } );

    } );

    describe( "install", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should return true if the installation was successfull, false if the program was already installed", function() {
            expect( kernel.install( this.system, "Test Program", {} ) ).toBeTruthy();
            expect( kernel.install( this.system, "Test Program", {} ) ).toBeFalsy();

        } );

        it( "should add the program to the list of installed programs, if it is not yet installed.", function() {

            kernel.install( this.system, "Test Program", {} );

            expect( kernel.installed_programs( this.system ) ).toContain( "Test Program" );

        } );

    } );

    describe( "uninstall", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

            kernel.install( this.system, "test", {} );

        } );

        it( "should return true if the installation was successful, false if the program was not installed", function() {

            expect( kernel.uninstall( this.system, "test" ) ).toBeTruthy();
            expect( kernel.uninstall( this.system, "test" ) ).toBeFalsy();

        } );

        it( "should remove the program with the given name from the list of installed programs", function() {

            kernel.uninstall( this.system, "test" );

            expect( kernel.installed_programs( this.system ) ).not.toContain( "test" );

        } );

    } );

    describe( "is_installed", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should return true if a program with the given name is installed on the given system", function() {

            kernel.install( this.system, "test", {} );

            expect( kernel.is_installed( this.system, "test" ) ).toBeTruthy();

            kernel.uninstall( this.system, "test" );

            expect( kernel.is_installed( this.system, "test" ) ).toBeFalsy();

        } );

        it( "should return the program if a program with the given name is installed", function() {

            var prog = {
                name: "test",
            };

            kernel.install( this.system, "test", prog );

            expect( kernel.is_installed( this.system, "test" ) ).toEqual( prog );

        } );

    } );
/**
    describe( "run", function() {

        beforeEach( function() {

            this.system = linux.create_system();

            this.program = {

                on_startup: function() {}

            };

            linux.install( this.system, this.program );
            linux.boot( this.system );

        } );

        it( "should throw an error if the system is not on", function() {

            linux.shutdown( this.system );

            expect( function() {
                linux.run( this.system, this.program );
            }.bind( this ) ).toThrowError( "System is not booted" );

        } );

        it( "should return the process structure.", function() {

            expect( linux.run( this.system, this.program ).program ).toEqual( this.program );

        } );


        it( "should add a new process to the process list", function() {

            var process = linux.run( this.system, this.program );

            expect( this.system.process_list.length ).toEqual( 1 );
            expect( this.system.process_list[0] ).toEqual( process );

        } );

        it( "should give each process an always increasing pid number.", function() {

            var p1 = linux.run( this.system, this.program );
            linux.run( this.system, this.program );
            var p3 = linux.run( this.system, this.program );

            expect( this.system.process_list.length ).toEqual( 3 );
            expect( p1.pid ).toEqual( 1 );
            expect( p3.pid ).toEqual( 3 );

        } );

        it( "should run the startup script when a program is started.", function() {

            var inf = {},
                outf = {},
                errf = {};

            spyOn( this.program, 'on_startup' );

            var p = linux.run( this.system, this.program, inf, outf, errf );

            expect( this.program.on_startup ).toHaveBeenCalledWith( this.system, p, undefined, undefined );
            expect( p.inf ).toEqual( inf );
            expect( p.outf ).toEqual( outf );
            expect( p.errf ).toEqual( errf );

        } );

        it( "should pass the arguments for the program to the startup script.", function() {

            var inf = {},
                outf = {},
                errf = {},
                args = [ "1", "2" ];

            spyOn( this.program, 'on_startup' );
            var exit_callback = function() {};

            var p = linux.run( this.system, this.program, inf, outf, errf, args, exit_callback );

            expect( this.program.on_startup ).toHaveBeenCalledWith( this.system, p, args, exit_callback );

        } );

    } );

    describe( "quit", function() {

        beforeEach( function() {

            this.system = linux.create_system();

            this.program = {};

            linux.install( this.system, this.program );
            linux.boot( this.system );
            this.process = linux.run( this.system, this.program );

        } );

        it( "should remove a process from the process list", function() {

            expect( linux.quit( this.system, this.process.pid ) ).toEqual( this.process );

            expect( this.system.process_list ).not.toContain( this.process );

        } );

        it( "should remember a process id was assigned after a process is quit.", function() {

            linux.quit( this.system, this.process.pid );
            var p2 = linux.run( this.system, this.program );

            expect( p2.pid ).toEqual( 2 );

        } );

        it( "should return false if the process id was not found.", function() {

            expect( linux.quit( this.system, 1000 ) ).toBeFalsy();

        } );

        it( "should call the given callback", function() {

            this.exit = function() {};
            spyOn( this, 'exit' );

            linux.quit( this.system, this.process.pid, this.exit );

            expect( this.exit ).toHaveBeenCalledWith();

        } );

    } );
    
    describe( "add_interface", function() {

        beforeEach( function() {

            this.system = linux.create_system();
            this.int = net.create_interface();

        } );
        
        it( "should add an interface to the systems network interfaces", function() {
            
            var int = linux.add_interface( this.system, 'eth0' );
            
            expect( this.system.network_interfaces['eth0'] ).toEqual( int );
            expect( int.system ).toEqual( this.system );
            
        } );
        
        it( "should raise an error if the given interface name is already taken", function() {
            
            linux.add_interface( this.system, 'eth0' );
            
            expect( function() {
                linux.add_interface( this.system, 'eth0' );
            }.bind( this ) ).toThrowError( "Interface with this name already exists: eth0" );
            
        } );
        
    } );
**/
} );
