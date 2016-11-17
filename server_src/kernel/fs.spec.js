describe( "Filesystem functions", function() {

    var fs = require( './fs.js' );
    
    beforeEach( function() {
        
        this.filesystem = fs.create_filesystem();
        this.root = fs.root_directory( this.filesystem );
        
    } );
    
    describe( "mount_filesystem", function() {
        
        it( "should throw an error if the system has already mounted a filesystem at the given mount point", function() {
            
            var sys = {};
            
            fs.mount( sys, this.filesystem, '' );
            
            expect( function() {
                fs.mount( sys, this.filesystem, '' );
            }.bind( this ) ).toThrowError( "Filesystem present." );
            
        } );
        
    } );
    
    describe( "create", function() {
        
        it( "should add a file with the given name, type and mode to the given directory", function() {
            
            fs.create( this.root, 'test', 10, 11 );
            
            expect( fs.list( this.root ) ).toContain( 'test' );
            
            var f = fs.lookup( this.root, 'test' );
            
            expect( fs.mode( f ) ).toEqual( 10 );
            expect( fs.filetype( f ) ).toEqual( 11 );
            
        } );
        
        it( "should throw an error if a file with the given filename already exists in the directory", function() {
            
            fs.create( this.root, 'test', 10, 11 );
            
            expect( function() {
                fs.create( this.root, 'test', 10, 11 );
            }.bind( this ) ).toThrowError( "File exists: test" );
            
        } );
        
        it( "should return the created file inode", function() {
            
            expect( fs.create( this.root, 'test', 10, 11 ) ).not.toBeUndefined();
            
        } );
        
    } );
    
    describe( "mkdir", function() {
        
        it( "should add a directory with the given name and mode to the given directory", function() {
            
            fs.mkdir( this.root, 'test', 10 );
            
            expect( fs.list( this.root ) ).toContain( 'test' );
            
            var f = fs.lookup( this.root, 'test' );
            
            expect( fs.mode( f ) ).toEqual( 10 );
            expect( fs.filetype( f ) ).toEqual( fs.FT_DIRECTORY );
            
        } );
        
        it( "should return the created directory", function() {
            
            expect( fs.mkdir( this.root, 'test', 10 ) ).not.toBeUndefined();
            
        } );
        
    } );
    
    describe( "rename", function() {
        
        beforeEach( function() {
            
            this.d1 = fs.mkdir( this.root, 'test' );
            this.d2 = fs.mkdir( this.root, 'test1' );
            
            this.f = fs.create( this.d1, 'testfile', 0, 0 );
            
        } );
        
        it( "should move the file between directories and rename it", function() {
            
            expect( fs.list( this.d2 ).length ).toEqual( 0 );
            
            fs.rename( this.d1, 'testfile', this.d2, 'testfile2' );
            
            expect( fs.list( this.d2 ) ).toContain( 'testfile2' );
            expect( fs.list( this.d1 ).length ).toEqual( 0 );
            
        } );
        
        it( "should throw an error if a file with the given filename already exists in the new directory", function() {
            
            fs.create( this.d2, 'testfile2', 10, 11 );
            
            expect( function() {
                fs.rename( this.d1, 'testfile', this.d2, 'testfile2' );
            }.bind( this ) ).toThrowError( "File exists: testfile2" );
            
        } );
        
        it( "should throw an error if a file with the given filename does not exist in the old directory", function() {
            
            expect( function() {
                fs.rename( this.d1, 'testfile3', this.d2, 'testfile2' );
            }.bind( this ) ).toThrowError( "No such file or directory: testfile3" );
            
        } );
        
    } );

    describe( "lookup_path", function() {

        beforeEach( function() {

            this.d1 = fs.mkdir( this.root, 'test' );

        } );

        it( "should throw an error if a component of the path does not exist", function() {

            expect( function() {
                fs.lookup_path( this.filesystem, [ 'test', 'nope' ] );
            } ).toThrowError();

        } );

        it( "should return the inode if the path exists in the filesystem", function() {

            expect( fs.lookup_path( this.filesystem, [ 'test' ] ) ).toEqual( this.d1 );

        } );

    } );

/**
    describe( "split", function() {

        beforeEach( function() {

            this.fs = fs.inodes.create_fs( fs.MANAGED );

        } );

        it( "should follow python behaviour", function() {

            expect( fs.split( this.fs, '/' ) ).toEqual( ['/', ''] );
            expect( fs.split( this.fs, '/test' ) ).toEqual( ['/', 'test'] );
            expect( fs.split( this.fs, '/test/' ) ).toEqual( ['/test', ''] );

            expect( fs.split( this.fs, 'test' ) ).toEqual( ['', 'test'] );
            expect( fs.split( this.fs, 'test/' ) ).toEqual( ['test', ''] );

            expect( fs.split( this.fs, '/test/ok/a.1' ) ).toEqual( ['/test/ok', 'a.1'] );

        } );

    } );
    
    describe( "splitall", function() {
        
        beforeEach( function() {
            
            this.fs = fs.inodes.create_fs( fs.MANAGED );
            
        } );
        
        it( "should follow python behaviour, but split completely", function() {
            
            expect( fs.splitall( this.fs, '/' ) ).toEqual( ['/', ''] );
            expect( fs.splitall( this.fs, '/test' ) ).toEqual( ['/', 'test'] );
            expect( fs.splitall( this.fs, '/test/' ) ).toEqual( ['/', 'test', ''] );
            expect( fs.splitall( this.fs, '/test/1' ) ).toEqual( ['/', 'test', '1'] );
            expect( fs.splitall( this.fs, '/test/1/' ) ).toEqual( ['/', 'test', '1', ''] );
            
            expect( fs.splitall( this.fs, 'test' ) ).toEqual( ['', 'test'] );
            expect( fs.splitall( this.fs, 'test/1/' ) ).toEqual( ['test', '1', ''] );
        } );
        
    } );
    
    describe( "exists", function() {
        
        beforeEach( function() {
            
            this.fs = fs.inodes.create_fs( fs.MANAGED );
            var inode = fs.inodes.add_child_inode( 'exists', this.fs.root )
            fs.inodes.add_child_inode( 'exists2', inode )
            
        } );
        
        it( "should return false if a path does not exist", function() {
            
            expect( fs.exists( this.fs, '/doesntexist' ) ).toBeFalsy();
            
        } );
        
        it( "should return true if the path does exist", function() {
            
            expect( fs.exists( this.fs, '/' ) ).toBeTruthy();
            expect( fs.exists( this.fs, '/exists' ) ).toBeTruthy();
            expect( fs.exists( this.fs, '/exists/exists2/' ) ).toBeTruthy();
            
        } );
        
    } );
    
    describe( "listdir", function() {
        
        beforeEach( function() {
            
            this.fs = fs.inodes.create_fs( fs.MANAGED );
            fs.inodes.add_child_inode( 'exists', this.fs.root )
            fs.inodes.add_child_inode( 'exists2', this.fs.root )
            
        } );
        
        it( "should throw an error if the directory does not exist", function() {
            
            expect( function() {
                fs.listdir( this.fs, '/doesntexist' )
            }.bind( this ) ).toThrowError( "File or directory does not exist: /doesntexist" );
            
        } );
        
        it( "should return a list of inode names", function() {
            
            expect( fs.listdir( this.fs, '/' ) ).toEqual( [ 'exists', 'exists2' ] );
            
        } );
        
    } );
    
    describe( "join", function() {
        
        beforeEach( function() {
            
            this.fs = fs.inodes.create_fs( fs.MANAGED );
            
        } );
        
        it( "should follow python behaviour", function() {
            
            expect( fs.join( this.fs ) ).toEqual( undefined );
            expect( fs.join( this.fs, '/' ) ).toEqual( '/' );
            expect( fs.join( this.fs, '/', 'test' ) ).toEqual( '/test' );
            expect( fs.join( this.fs, '/test', 'ok' ) ).toEqual( '/test/ok' );
            expect( fs.join( this.fs, '/test/1/', '/test2' ) ).toEqual( '/test2' );
            
        } );
        
    } );
    
    describe( "mkdir", function() {
        
        beforeEach( function() {
            
            this.fs = fs.inodes.create_fs( fs.MANAGED );
            
        } );
        
        it( "should throw an error if an intermediate directory does not exist", function() {
            
            expect( function() {
                fs.mkdir( this.fs, '/test/test' );
            }.bind( this ) ).toThrowError( "Directory does not exist: /test" )
            
        } );
        
        it( "should add a directory to the file system if it succeeds", function() {
            
            fs.mkdir( this.fs, '/test' );
            
            expect( fs.listdir( this.fs, '/' ) ).toEqual( ['test'] );
            
        } );
        
        it( "should throw an error if the file already exists", function() {
            
            fs.mkdir( this.fs, '/test' );
            
            expect( function() {
                fs.mkdir( this.fs, '/test' );
            }.bind( this ) ).toThrowError( "File already exists: /test" )
            
        } );
        
    } );

/*    describe( "listdir", function() {

        it( "should return a list of child directories of the given directory inode.", function() {

            var root = fs.mkdir( '', null );

            expect( fs.listdir( root ) ).toEqual( [] );

        } );

    } );

    describe( "mkdir", function() {

        it( "should return a new directory", function() {

            expect( fs.mkdir( '', null ) ).not.toEqual( undefined );

        } );

        it ( "should add the new directory to the children of the given parent directory", function() {
           
            var root = fs.mkdir( '', null );
            var subdir = fs.mkdir( 'test', root );

            expect( fs.listdir( root ) ).toContain( subdir );

        } );

    } );

    describe( "rmdir", function() {

        beforeEach( function() {

            this.root = fs.mkdir( '', null );
            this.subdir = fs.mkdir( '', this.root );

        } );

        it( "should return false if the given child inode does not exist", function() {

            var newdir = fs.mkdir( '', null );

            expect( fs.rmdir( newdir, this.root ) ).toBeFalsy();

        } );

        it( "should remove the given inode from the children of the given parent dir", function() {

            expect( fs.rmdir( this.subdir, this.root ) ).toBeTruthy();

            expect( fs.listdir( this.root ) ).not.toContain( this.subdir );

        } );

    } );
*/
} );
