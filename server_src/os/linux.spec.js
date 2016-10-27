describe( "Linux OS functions", function() {

    var linux = require( './linux.js' );

    describe( "create_system", function() {

        beforeEach( function() {

            this.system = linux.create_system();

        } );

        it( "should return a linux system object.", function() {

            expect( this.system ).not.toBeNull();

        } );

        it( "should not be turned on.", function() {

            expect( this.system.is_on ).toBeFalsy();

        } );

        it( "should not have any programs installed.", function() {

            expect( this.system.installed_programs ).toEqual( [] );

        } );

    } );

    describe( "boot", function() {

        beforeEach( function() {

            this.system = linux.create_system();

        } );

        it( "should initialize the given system.", function() {

            expect( this.system.is_on ).toBeFalsy();

            linux.boot( this.system );

            expect( this.system.is_on ).toBeTruthy();

        } );

    } );

    describe( "shutdown", function() {

        it( "should turn the system off.", function() {

            var system = linux.create_system();
            linux.boot( system );
            linux.shutdown( system );

            expect( system.is_on ).toBeFalsy();

        } );

    } );

    describe( "install", function() {

        beforeEach( function() {

            this.system = linux.create_system();

            this.program = {

                on_install: function() {}

            }; 

        } );

        it( "should add the program to the list of installed programs, if it is not yet installed.", function() {

            linux.install( this.system, this.program );

            expect( this.system.installed_programs ).toContain( this.program );
            expect( this.system.installed_programs.length ).toEqual( 1 );

            linux.install( this.system, this.program );

            expect( this.system.installed_programs.length ).toEqual( 1 );

        } );

        it( "should return the install script on installation, if it is not yet installed", function() {

            spyOn( this.program, 'on_install' );

            linux.install( this.system, this.program );

            expect( this.program.on_install ).toHaveBeenCalledWith( this.system );

            linux.install( this.system, this.program );

            expect( this.program.on_install ).toHaveBeenCalledTimes( 1 );

        } );

    } );

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

            expect( this.program.on_startup ).toHaveBeenCalledWith( this.system, p, undefined );
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

            var p = linux.run( this.system, this.program, inf, outf, errf, args );

            expect( this.program.on_startup ).toHaveBeenCalledWith( this.system, p, args );

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

    } );

} );
