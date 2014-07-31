/*
Recursive directory list based on chjj's code
http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search

added regexp filter parameter re

use: walk( directory to search, regexp filter, callback )
*/
var fs = require('fs');
var walk = function(dir, re,  done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, re, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
	  if( file.search(re) != -1 )
          	results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

function start_mp3(mp3) {
	var spawn;
	var aParams = [mp3];

	spawn = require('child_process').spawn,
	 mp3Player = spawn('/home/pi/bin/playMp3', aParams, {  stdio: ['pipe', 'pipe', process.stderr]  });


	mp3Player.stdout.on('data', function (data) {
	  console.log('stdout: ' + data);
	});

	mp3Player.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	mp3Player.stdin.on('data', function (data) {
	  console.log('stdin: ' + data);
	});

	mp3Player.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	});


	return mp3Player;
}

function start_video(video, subtitles) {

	var aParams;
	var spawn;

	if( subtitles != "" )
		aParams = [video,subtitles];
	else
		aParams = [video];

	spawn = require('child_process').spawn, player = spawn('/home/pi/bin/omx', aParams );

	player.stdout.on('data', function (data) {
	  console.log('stdout: ' + data);
	});

	player.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	player.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	});


	return player;
}



/********************************************************************************************
 Mini servidor Web
*********************************************************************************************/
var fs = require('fs');
var PORT=8080;
var http = require('http');


// Manifiesto para controlar la recarga de index.html
//var postManifest = fs.readFileSync( '../html/manifest.webmote', 'UTF8'  );

var postHTML="";

// Contiene el HTML de la pagina index.html
function leeHTML( page ){

/*
  fs.readFile('/home/pi/html/' + page, { encoding: "UTF8" },
    function (err, data) {
      if (err) throw err;
      postHTML= data.toString();
    });
  return postHTML;
*/
  return ( fs.readFileSync( '/home/pi/html/' + page, 'UTF8'  ) );
}

//leeHTML("webmote.html");

var player = null;
var mp3_player = null;
var aVideos; 
var aSubtitles;

walk(process.env.HOME, /.mp4|.mkv|.avi$/i , function(err, results) {
  if (err) throw err;
  aVideos = results.slice();
});

walk(process.env.HOME, /.srt$/i , function(err, results) {
  if (err) throw err;
  aSubtitles = results.sort();
});


var server = http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;	// POST data received
  });
  req.on('end', function () {
    var url = req.url;
    var fecha = new Date().toUTCString();
    var command = "";		// command signal received from webmote client

    console.log(fecha + " Web request received: " + req.socket.remoteAddress + " " + url);
    res.setHeader("Access-Control-Allow-Origin", "*");

    if( url == "/webmote.css" )
   	 res.setHeader("Content-type", "text/css");
    else if( url == "/videos.json" || url == "/subtitles.json" ||  url == "/getMp3Radio.json" )
   	 res.setHeader("Content-type", "application/json");
    else
   	 res.setHeader("Content-type", "text/html");

    res.writeHead(200);

    if( url == "/index.html" || url == "/webmote.html" ){
      // TODO
      var myHTML = leeHTML("webmote.html");  // Va releyendo el fichero esto solo por depuracion
      res.end( myHTML );
    }

    else if( url == "/webmote.css"  ){
      var myHTML = leeHTML("webmote.css");  // Va releyendo el fichero esto solo por depuracion
      res.end( myHTML );
    }

    else if( url == "/webmote_panel.html"  ){
      var myHTML = leeHTML("webmote_panel.html");
      res.end( myHTML );
    }

    else if( url == "/medialist.html"  ){
      var myHTML = leeHTML("medialist.html");  // Va releyendo el fichero esto solo por depuracion
      res.end( myHTML );
    }

    else if( url === "/getMp3Radio.json"  ){
       res.end( JSON.stringify( "OK") );
    }

    else if( url === "/videos.json"  ){
       res.end( JSON.stringify( aVideos) );
    }
    else if( url === "/subtitles.json"  ){
       res.end( JSON.stringify( aSubtitles) );
    }


    else if( url == "/omx_command" ){
	console.log(body);
	var video = "";
	var subtitles = "";
	var arr_commands;
	var arr_params;
	var param;

	/*
	 Process parameters.
	 PRE: body = String containing 1 or more params like "param1=value1&param2=value2.."
	 POST: param[] has as elements as parameters whith a pair of elements each param[n]=[param, value]
	*/
	arr_commands = body.split("&");
	arr_params = arr_commands.map( function(x) { return( x.split("=") )} );
	for( var n = 0; n < arr_params.length; n++ ){
		param = arr_params[n];
		if( param[0] === "c" ){
			command = param[1];
		}
		else if( param[0] === "mp3" ){
			mp3 = param[1];
		}
		else if( param[0] === "video" ){
			video = param[1];
		}
		else if( param[0] === "subtitles" ){
			subtitles = param[1];
		}
	}


	console.log("Command signal received: " + command);

	if ( command === "r600" ){
		command = '\x1B\x5B\x41';
	}
	else if ( command === "l600" ){
		command = '\x1B\x5B\x42';
	}
	else if ( command === "r30" ){
		command = '\x1B\x5B\x43';
	}
	else if ( command === "l30" ){
		command = '\x1B\x5B\x44';
	}

	else if ( command === "start_mp3" && mp3_player == null && player == null){
		console.log("Starting mp3 reproduction.." + mp3 );
		mp3_player = start_mp3(mp3);
	}


	else if ( command === "start" && player == null && mp3_player == null){
		console.log("Starting video play.." + video + " subtitles " + subtitles);
		player = start_video(video, subtitles);
	}
	else if ( command === "usb" ){
		var count_return = 0;
		console.log("Reading usb disks.");
			walk('/media/usb0', /.mp4|.mkv|.avi$/i , function(err, results) {
			  if (err) throw err;
			  aVideos = results.slice();
			  count_return++;
			  console.log("Videos read." + count_return );
			  if ( count_return >1 )
				res.end('');
			});

			walk('/media/usb0', /.srt$/i , function(err, results) {
			  if (err) throw err;
			  aSubtitles = results.sort();
			  count_return++;
			  console.log("Subtitles read." + count_return );
			  if ( count_return >1 )
				res.end('');
			});

	}

	else if ( command === 'lasegonahora' || command === 'lacompetencia' ){
		var mp3 = require('./getMp3Radio.js');
		console.log('Getting ' + command + ' MP3.');

		mp3.getMp3( command, function(err, result){
			if (err) console.log(err);
			res.end( 'Return module getMp3: ' + result );
			//res.end('');
		});

	}

	if( player != null ){
		console.log("Sending signal to player: " + command );
		player.stdin.write(command);
	}
	else if( mp3_player != null ){
		if( command ==="q" ){
			console.log("Sending signal to mp3 player: " + command );
			mp3_player.stdin.write("q");
		}
	}
	else{
		console.log("Player not found.");
	}

	if( command === "q" ){
		console.log("reset player");
		if( mp3_player ){
			mp3_player = null;
                }
		else if( player )
			player = null;
	}

	if( command !== "usb" && command !== "lasegonahora" && command !== "lacompetencia" )
		res.end("");
    }
    // manifiesto para evitar relecturas de paginas estaticas
    else if( url == "/manifest.webmote" ){
	res.end(postManifest);
    }

    else{
      res.end( );
   }

  });

});

server.listen(PORT);

console.log("Webmote server started :)");
