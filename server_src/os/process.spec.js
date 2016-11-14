describe( "Process Management", function() {

    var kernel = require( './kernel.js' ),
        process = require( './process.js' );

    describe( "start_process", function() {

        beforeEach( function() {

            this.system = {};
            this.program = {};

        } );

        it( "should throw an error if the system is not on", function() {




        } );

        it( "should throw an error if the program is not installed on the system", function() {

        } );

        it( "should add a new process to the process list and return this process", function() {

            var proc = process.start_process( this.system, this.program );

            expect( process.process_list( this.system ) ).toContain( proc );

        } );

        it( "should give each process an always increasing pid number", function() {

            var p1 = process.start_process( this.system, this.program );
            var p2 = process.start_process( this.system, this.program );

            expect( process.pid( p1 ) ).toBeLessThan( process.pid( p2 ) );

        } );

    } );

    describe( "stop_process", function() {

        beforeEach( function() {

            this.system = {};
            this.program = {};

            this.proc = process.start_process( this.system, this.program );

        } );

        it( "should throw an error if the system is not on", function() {

        } );

        it( "should remove a process from the process list and return this process", function() {

            expect( process.stop_process( this.system, process.pid( this.proc ) ) ).toEqual( this.proc );
            expect( process.process_list( this.system ) ).not.toContain( this.proc );

        } );

        it( "should return false if the given pid was not found", function() {

            expect( process.stop_process( this.system, process.pid( this.proc ) + 1 ) ).toBeFalsy();

        } );

        it( "should remember a process id was assigned after a process has been stopped", function() {

            process.stop_process( this.system, process.pid( this.proc ) );
            var p2 = process.start_process( this.system, this.program );

            expect( process.pid( p2 ) ).toBeGreaterThan( process.pid( this.proc ) );

        } );

    } );

    describe( "is_running", function() {

        beforeEach( function() {

            this.system = {};
            this.program = {};

            this.proc = process.start_process( this.system, this.program );

        } );

        it( "should return true if the process is running", function() {

            expect( process.is_running( this.system, process.pid( this.proc ) ) ).toBeTruthy();

        } );

        it( "should return false if the process has been stopped", function() {

            process.stop_process( this.system, process.pid( this.proc ) );

            expect( process.is_running( this.system, process.pid( this.proc ) ) ).toBeFalsy();

        } );

    } );

} );
