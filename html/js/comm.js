var comm = function() {
    var settings,

    connect = function(_settings) {
        settings = _settings;
        var connection = new WebSocket(settings.host);

        connection.onopen = function () {};

        connection.onmessage = function (message) {
		var data = JSON.parse(message.data);

		// TODO
		switch ( data['cmd_response'] ) {
	    		case 'msg':
				document.getElementById(settings.logID).innerHTML =  data['txt'];
				break;
	    		case 'err':
				document.getElementById(settings.logID).innerHTML = "Recibido error: " + data['txt'];
				break;
	    		case 'usb':
				$.mobile.loading( "hide" );
				$('#btn_read_usb').removeAttr('disabled');
				reload_media();
				break;
			case 'local':
				$.mobile.loading( "hide" );
				$('#btn_read_local').removeAttr('disabled');
				reload_media();
				break;
			case 'lasegonahora':
				$.mobile.loading( "hide" );
				$('#btn_get_segonahora').removeAttr('disabled');
				break;
			case 'lacompetencia':
				$.mobile.loading( "hide" );
				$('#btn_get_lacompetencia').removeAttr('disabled');
				break;
			default:
				console.log( "Reibido comando " + data + " y no se que hacer!" );
		}
		document.getElementById(settings.logID).innerHTML =  data['txt'];

        };

	return connection;
    };

    return {
        connect: connect
    };
}();



var Communicator = function(_settings) {
        this.settings = _settings;

    this.connect = function(_settings) {

        this.connection = new WebSocket(this.settings.host);

        this.connection.onopen = function () {
		console.log("Socket connection open");
	};

        this.connection.onmessage = function (message) {
		var data = JSON.parse(message.data);

		// TODO
		switch ( data['cmd_response'] ) {
	    		case 'msg':
				document.getElementById(this.settings.logID).innerHTML =  data['txt'];
				break;
	    		case 'err':
				document.getElementById(this.settings.logID).innerHTML = "Recibido error: " + data['txt'];
				break;
	    		case 'usb':
				$.mobile.loading( "hide" );
				$('#btn_read_usb').removeAttr('disabled');
				reload_media();
				break;
			case 'local':
				$.mobile.loading( "hide" );
				$('#btn_read_local').removeAttr('disabled');
				reload_media();
				break;
			case 'lasegonahora':
				$.mobile.loading( "hide" );
				$('#btn_get_segonahora').removeAttr('disabled');
				break;
			case 'lacompetencia':
				$.mobile.loading( "hide" );
				$('#btn_get_lacompetencia').removeAttr('disabled');
				break;
			default:
				console.log( "Reibido comando " + data + " y no se que hacer!" );
		}
		document.getElementById(settings.logID).innerHTML =  data['txt'];

        };



    return this.socket;

   };

};

