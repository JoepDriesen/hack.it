describe( "Hardware devices", function() {
    
    var dev = require( './device.js' );
    
    describe( "API:", function() {
        
        var funcs = {},
            dev_types = {};
        
        for ( var key in dev ) {
            
            var field = dev[key];
            
            if ( field instanceof Function )
                funcs[key] = field;
            
            else
                dev_types[key] = field;
            
        }
        
        var seed = 1;
        for ( var dev_type_name in dev_types ) {
            
            describe( "Device " + dev_type_name, function() {
            
                var dev_type = dev_types[dev_type_name];

                it( "should provide a create function, which accepts a seed", function() {
                    
                    expect( function() {
                        dev_type.create( seed );
                    } ).not.toThrowError();
                    
                } );
                var d1 = dev_type.create( seed );
            
                for ( var func_name in funcs ) {

                    describe( "Function " + func_name, function() {
                        
                        var func = funcs[func_name];
                        
                        var r1 = func( d1 );

                        it( "should return something", function() {
                            
                            expect( r1 ).not.toBeUndefined();
                            
                        } );
                        
                        it( "should be equal for devices created with the same seed if no other parameters are given", function() {
                            
                            var d2 = dev_type.create( seed );
                            var r2 = func( d2 );
                            
                            expect( r1 ).toEqual( r2 );
                            
                        } );
                        
                    } );
                    
                }
                
            } );
            
        }
        
    } );
    
} );