var socketServer = function () {
    var data = null,
    timerID = null,
    sockets = [],
    socketServer = null,
    commandManager = null,
    mediaContent = null,

    ws = require('websocket.io'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    domain = require('domain'),
    reqDomain = domain.create(),
    socketDomain = domain.create(),
    httpDomain = domain.create(),


	httpListen = function (port) {
	    httpDomain.on('error', function (err) {
		console.log('Error caught in http domain:' + err);
	    });

	    httpDomain.run(function () {
		http.createServer(function (req, res) {
		    var pathname = url.parse(req.url).pathname;
		    console.log(pathname);

		    if( pathname.search(/.json$/i) != -1 ){
			readFileJson( res, pathname );
		    }
		    else if (pathname == '/' || pathname == '/index.html') {
		        readFile(res, 'index.html');
		    }
		    else {
		        readFile(res, '.' + pathname);
		    }
		}).listen(port);
	    });
	},

	readFile = function(res, pathname) {
	    pathname = "/home/pi/html/" + pathname;

	    fs.readFile(pathname, function (err, data) {
		if (err) {
		    console.log(err.message);
		    res.writeHead(404, {'content-type': 'text/html'});
		    res.write('File not found: ' + pathname);
		    res.end();
		}
		else {
		    res.write(data);
		    res.end();
		}
	    });       
	},

	readFileJson = function(res, pathname) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
	 	});

	     	if( pathname === "/getMp3Radio.json"  ){
		      res.end( JSON.stringify( "OK") );
		    }

		else if( pathname === "/videos.json"  ){
			if( mediaContent.aVideos && mediaContent.aVideos.length > 0 )
				res.end( JSON.stringify( mediaContent.aVideos) );
			else
				res.end('[""]');
   		}
		else if( pathname === "/subtitles.json"  ){
			if( mediaContent.aSubtitles && mediaContent.aSubtitles.length > 0 )
				res.end( JSON.stringify( mediaContent.aSubtitles) );
			else
				res.end('[""]');
	    	}
		else if( pathname === "/mp3.json"  ){
		 	if( mediaContent.aMp3 && mediaContent.aMp3.length > 0 )
				res.end( JSON.stringify( mediaContent.aMp3) );
			else
				res.end('[""]');
		}
		else{
		    console.log("Fichero json no encontrado: " + pathname);
		    res.writeHead(404, {'content-type': 'text/html'});
		    res.write('File not found: ' + pathname);
		}

		res.end();

	},

	socketListen = function(port) {


	    socketDomain.on('error', function(err) {
		console.log('Error caught in socket domain:' + err);
	    });

	    socketDomain.run(function() { 
		socketServer = ws.listen(port);

		socketServer.on('listening',function(){
		    console.log('SocketServer is running');
		});

		socketServer.on('connection', function (socket) {

		    console.log('Connected to client');
		    sockets.push(socket);

		    socket.on('message', function (data) { 
		        console.log('Message received:', data);

			var msg = JSON.parse(data);
			if( msg['cmd'] ){
				commandManager.gestionaComando( msg['cmd'] , msg['param'] );
			}
		    });

		    socket.on('close', function () {
		        try {
		            socket.close();
		            socket.destroy();
		            console.log('Socket closed!');                       
		            for (var i = 0; i < sockets.length; i++) {
		                if (sockets[i] == socket) {
		                    sockets.splice(i, 1);
		                    console.log('Removing socket from collection. Collection length: ' + sockets.length);
		                    break;
		                }
		            }
		                
		            if (sockets.length == 0) {
		                clearInterval(timerID);
		                data = null;
		            }
		        }
		        catch (e) {
		            console.log(e);
		        }
		    });	// fin socket.on(close)

                    broadcastMessage( 'msg', 'Bienvenido al socket!');

		});  	// fin socketServer.on(connection)
	    });   	// fin socketDomain.run   
	},		// fin funcion socketListen


	broadcastMessage = function(command, err){
		var response = JSON.stringify( { cmd_response: command, txt: err } );

	    if (sockets.length) {
		//console.log('Sending response to command: ' + response);
		for(i=0;i<sockets.length;i++)
		{
		    try {
		        sockets[i].send( response );
		    }   
		    catch (e)
		    {
		        console.log(e);                
		    }
		}
	    }
	},

	init = function(httpPort, socketPort, _commandManager , _mediaContent) {
	    httpListen(httpPort);
	    socketListen(socketPort);
	    commandManager = _commandManager;
	    mediaContent = _mediaContent;
	};

	return {
	    broadcastMessage: broadcastMessage,
	    init: init
	};
}();

module.exports = socketServer;
