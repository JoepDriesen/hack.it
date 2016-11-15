describe( "Kernel functions", function() {

    var kernel = require( './kernel.js' );

    beforeEach( function() {

        this.program = {
            CMD: 'test',
        };

    } );

    describe( "create_system", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should not have any programs installed.", function() {

            expect( kernel.installed_programs( this.system ) ).toEqual( [] );

        } );

    } );

    describe( "install", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should return true if the installation was successfull, false if the program was already installed", function() {
            expect( kernel.install( this.system, this.program ) ).toBeTruthy();
            expect( kernel.install( this.system, this.program ) ).toBeFalsy();

        } );

        it( "should add the program to the list of installed programs, if it is not yet installed.", function() {

            kernel.install( this.system, this.program );

            expect( kernel.installed_programs( this.system ) ).toContain( 'test' );

        } );

    } );

    describe( "uninstall", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

            kernel.install( this.system, this.program );

        } );

        it( "should return true if the installation was successful, false if the program was not installed", function() {

            expect( kernel.uninstall( this.system, this.program ) ).toBeTruthy();
            expect( kernel.uninstall( this.system, this.program ) ).toBeFalsy();

        } );

        it( "should remove the program with the given name from the list of installed programs", function() {

            kernel.uninstall( this.system, this.program );

            expect( kernel.installed_programs( this.system ) ).not.toContain( 'test' );

        } );

    } );

    describe( "is_installed", function() {

        beforeEach( function() {

            this.system = kernel.create_system();

        } );

        it( "should return true if a program with the given name is installed on the given system", function() {

            kernel.install( this.system, this.program );

            expect( kernel.is_installed( this.system, 'test' ) ).toBeTruthy();

            kernel.uninstall( this.system, this.program );

            expect( kernel.is_installed( this.system, 'test' ) ).toBeFalsy();

        } );

        it( "should return the program if a program with the given name is installed", function() {

            kernel.install( this.system, this.program );

            expect( kernel.is_installed( this.system, 'test' ) ).toEqual( this.program );

        } );

    } );

} );
