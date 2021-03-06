describe( "The linux shell program", function() {
    
    var shell = require( './shell.js' ),
        proc = require( '../../user/process.js' ),
        syscalls = require( '../../user/syscalls.js' );

    describe( "parse_command", function() {

        it( "should split commands into command and arguments.", function() {

            expect( shell.parse_command( "cmd arg1 arg2=b" ) ).toEqual( [ "cmd", "arg1", "arg2=b" ] );

        } );

        it( "should remove trailing spaces and newlines", function() {

            expect( shell.parse_command( "test \r\n" ) ).toEqual( [ "test" ] );

        } );

        it( "an empty command should return an empty array", function() {

            expect( shell.parse_command( "" ) ).toEqual( [] );

        } );

    } );
    
    describe( "get_var", function() {
        
        it( "should store and retrieve environment variables", function() {
            
            var p = {};
            
            shell.set_var( p, 'test', 1 );
            
            expect( shell.get_var( p, 'test' ) ).toEqual( 1 );
            
        } );
        
    } );

    describe( "print_prompt", function() {

        it( "should write the prompt to the outfile of the process", function() {

            var process = {},
                outf = {},
                write_spy = spyOn( syscalls, 'write' );

            spyOn( proc, 'outf' ).and.returnValue( outf );
            spyOn( syscalls, 'gethostname' ).and.returnValue( 'testhost' );
            spyOn( syscalls, 'getcwd' ).and.returnValue( '/test' );

            shell.print_prompt( process );

            expect( write_spy ).toHaveBeenCalledWith( process, '[root@testhost:/test]$ ' );

        } );

    } );

/**
    describe( "on_command_input", function() {

        beforeEach( function() {

            this.proc = {
                inf: {
                    removeListener: function() {},
                },
                outf: {
                    write: function() {},
                },
                errf: {},
                params: {
                    read_callback: function() {},
                },
            };

        } );

        it( "should return exit code 1 (error) for an empty command", function() {

            expect( shell.on_command_input( null, this.proc, "" ) ).toEqual( 1 );

        } );

        it( "should execute the builtin function for the given command if it is available", function() {
            
            shell.builtin.test_unique001 = function() {};
            spyOn( shell.builtin, 'test_unique001' );

            shell.on_command_input( null, this.proc, "test_unique001 1 2" );

            expect( shell.builtin.test_unique001 ).toHaveBeenCalledWith( null, this.proc, [ "test_unique001", "1", "2" ] );

        } );

        it( "should execute the installed program corresponding to the given command", function() {
            
            var prog = {
                    CMD: 'test',
                    on_startup: function() {},
                },
                sys = {
                    is_on: true,
                    installed_programs: {
                        test: prog,
                    },
                    process_list: [],
                };
            
            spyOn( prog, 'on_startup' );

            shell.on_command_input( this.proc, "test 1 2" );

            expect( prog.on_startup ).toHaveBeenCalled();

        } );

    } );
**/
} );
