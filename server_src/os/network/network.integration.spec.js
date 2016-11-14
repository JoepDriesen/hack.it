describe( "Network integration tests:", function() {

    var kernel = require( './../kernel.js' ),
        link = require( './link.js' ),
        internet = require( './internet.js' ),
        transport = require( './transport.js' );

    it( "should be able to simulate a real network connection", function() {

        var sys1 = kernel.create_system(),
            iface1_1 = link.add_interface( sys1 ),

            net1 = link.create_network();

        link.attach( iface1_1, net1 );
        kernel.boot( sys1 );
        link.interface_up( iface1_1 );

        var sys2 = kernel.create_system(),
            iface2_1 = link.add_interface( sys2 ),
            iface2_2 = link.add_interface( sys2 ),

            net2 = link.create_network();

        link.attach( iface2_1, net1 );
        link.attach( iface2_2, net2 );

        kernel.boot( sys2 );
        link.interface_up( iface2_1 );
        link.interface_up( iface2_2 );

        var sys3 = kernel.create_system(),
            iface3_1 = link.add_interface( sys3 );

        link.attach( iface3_1, net2 );
        
        kernel.boot( sys3 );
        link.interface_up( iface3_1 );



        internet.add_address( iface1_1, '192.168.0.2/24' );
        internet.add_address( iface2_1, '192.168.0.1/24' );
        internet.add_address( iface2_2, '192.168.1.1/24' );
        internet.add_address( iface3_1, '192.168.1.2/24' );

        internet.add_route( iface1_1, internet.DEFAULT_GATEWAY, '192.168.0.1' );



        transport.listen( sys3, '192.168.1.2', 80, transport.TCP );

        var sock = transport.connect( sys1, '192.168.1.2', 80, transport.TCP );


    } );

} );