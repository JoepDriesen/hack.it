describe( "Kernelspace Process Management", function() {

    var kernel_mock = require( './kernel.js' ),
        process = require( './process.js' ),
        EventEmitter = require( 'events' );
/**
    beforeEach( function() {

        this.system = {};
        this.program = {
            EVENTS: new EventEmitter(),
        };

        this.is_installed_mock = spyOn( kernel_mock, 'is_installed' ).and.returnValue( this.program );

    } );

    describe( "start_process", function() {

        it( "should throw an error if the program is not installed on the system", function() {

            this.is_installed_mock.and.returnValue( false );

            expect( function() {
                process.start_process( this.system, 'testname' );
            }.bind( this ) ).toThrowError( "Program is not installed: testname" );

        } );

        it( "should add a new process to the process list and return this process", function() {

            var proc = process.start_process( this.system, 'test' );

            expect( process.process_list( this.system ) ).toContain( proc );

        } );

        it( "should give each process an always increasing pid number", function() {

            var p1 = process.start_process( this.system, 'test' );
            var p2 = process.start_process( this.system, 'test' );

            expect( process.pid( p1 ) ).toBeLessThan( process.pid( p2 ) );

        } );

        it( "should emit a startup event to the programs", function() {

            var called_proc;
            this.program.EVENTS.on( 'start', function( process ) {
                called_proc = process;
            } );

            var p = process.start_process( this.system, 'test' );

            expect( called_proc ).toEqual( p );

        } );         

    } );

    describe( "stop_process", function() {

        beforeEach( function() {

            this.proc = process.start_process( this.system, 'test' );

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

        it( "should emit a stop event to the programs", function() {

            var called_proc;
            this.program.EVENTS.on( 'stop', function( process ) {
                called_proc = process;
            } );

            var p = process.stop_process( this.system, process.pid( this.proc ) );

            expect( called_proc ).toEqual( p );

        } );

    } );

    describe( "is_running", function() {

        beforeEach( function() {

            this.proc = process.start_process( this.system, 'test' );

        } );

        it( "should return true if the process is running", function() {

            expect( process.is_running( this.system, process.pid( this.proc ) ) ).toBeTruthy();

        } );

        it( "should return false if the process has been stopped", function() {

            process.stop_process( this.system, process.pid( this.proc ) );

            expect( process.is_running( this.system, process.pid( this.proc ) ) ).toBeFalsy();

        } );

    } );
*/
} );
