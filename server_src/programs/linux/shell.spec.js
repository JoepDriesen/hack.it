describe( "The linux shell program", function() {

    var shell = require( './shell.js' );

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

    describe( "on_command_input", function() {

        beforeEach( function() {

            this.proc = {
                inf: {},
                outf: {
                    write: function() {},
                },
                errf: {},
            };

        } );

        it( "should return exit code 1 (error) for an empty command", function() {

            expect( shell.on_command_input( null, this.proc, "" ) ).toEqual( 1 );

        } );

        it( "should execute the builtin function for the given command if it is available", function() {
            
            shell.test = function() {};
            spyOn( shell, 'test' );
            shell.builtin_commands.push( 'test' );

            shell.on_command_input( null, this.proc, "test 1 2" );

            expect( shell.test ).toHaveBeenCalledWith( null, this.proc, [ "test", "1", "2" ] );

        } );

    } );

} );
