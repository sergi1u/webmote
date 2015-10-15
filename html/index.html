var commandManager = function () {

	var socketServer = null,
	mediaContent = null,
	fs = require('fs'),

	/*
	Recursive directory list based on chjj's code
	http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search

	added regexp filter parameter re

	use: walk( directory to search, regexp filter, callback )
	*/
	walk = function(dir, re,  done){

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
	},

	// Controls volume output on PCM with amixer
	amixer_volume = function( incremento ){

		var spawn = require('child_process').spawn;
		var amixer;
		var mas_menos='dB+';

		if (incremento < 0 ){
			incremento = Math.abs(incremento);
			mas_menos='dB-';
		}

		var decibelios = incremento.toString() + mas_menos;

		var aParams = ['-c','0','set','PCM',decibelios];

		amixer = spawn('/usr/bin/amixer', aParams);

		amixer.stdout.on('data', function (data) {
		  console.log('stdout: ' + data);
		});

		amixer.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		amixer.on('close', function (code) {
		  console.log('child process exited with code ' + code);
		});

	},

	/*
	  PRE:
		dir = string . Directory to search contents 
		mediaContent = {aVideos: , aSubtitles: , aMp3: }  . Media containers
		callback function
	*/
	getMediaContent = function( dir , mediaContent, callback){
		count_return = 0;
		console.log("Reading media content.");
			walk( dir, /.mp4$|.mkv$|.m4v$|.avi$/i , function(err, results) {
			  if (err) throw err;

			  mediaContent.aVideos = results.slice();
			  count_return++;
			  console.log("Videos read." + count_return );
			  if( count_return > 2 )
				callback(null);
			});

			walk( dir, /.srt$/i , function(err, results) {
			  if (err) throw err;
			  mediaContent.aSubtitles = results.sort();
			  count_return++;
			  console.log("Subtitles read." + count_return );
			  if( count_return > 2 )
				callback(null);
			});

			walk( dir, /.mp3$/i , function(err, results) {
			  if (err) throw err;
			  mediaContent.aMp3 = results.sort();
			  count_return++;
			  console.log("MP3 read." + count_return );
			  if( count_return > 2 )
				callback(null);
			});


	},	// fin lee_usb

	broadcastMessage = function (comando, err ){
		socketServer.broadcastMessage(comando,err);
	},

	gestionaComando = function( comando , param ){
		switch (comando){
			case 'usb':
			case 'local':
				var dir = comando === 'usb' ? '/media/usb0' : '/home/pi/multimedia';
				console.log(comando + " " + dir);

	  			getMediaContent( dir , mediaContent, function(err){
					if( err ){
						broadcastMessage(comando, err );
						console.log("Error leyendo " + comando);
					}
					else{
						broadcastMessage(comando, 'Leido datos USB' );
						console.log("Leido " + comando);
					}
				});
				break;

			case 'lasegonahora':
			case 'lacompetencia':
				var mp3 = require('./getMp3Radio.js');
				console.log('Getting ' + comando + ' MP3.');

				mp3.getMp3( comando, function(err, result){
					if (err){
						console.log(err);
						broadcastMessage(comando, err );
					}
					broadcastMessage( comando, 'Terminada descarga de podcast' );
				});
				break;


			case 'vol+':
				amixer_volume(5);
				break;
			case 'vol-':
				amixer_volume(-5);
				break;

			case 'pause':
				pause();
				break;

			case 'timer':
				timer();
				break;

			case 'start_video':
				start_video( param );
				console.log( "Process id: " + mediaServer.getPid() );
				break;

			case 'video_vol+':
			case 'video_vol-':
			case 'rw':
			case 'ff':
			case 'left600':
			case 'left30':
			case 'right600':
			case 'right30':
			case 'subtitles':
			case 'subtitles_d':
			case 'subtitles_f':
				video_command( comando );
				break;

			case 'start_mp3':
				start_mp3( param );
				console.log( "Process id: " + mediaServer.getPid() );
				break;

			case 'skip+':
			case 'skip--':
			case 'skip++':
			case 'skip-':
				mp3_command( comando );
				break;

			case 'stop':
				stop();
				break;

			default:
				console.log("recibido comando que no se cómo gestionar");
		}

	},	// fin commandManager.gestionaComando


	init = function( _socketServer, _mediaContent ) {
		socketServer = _socketServer;
		mediaContent = _mediaContent;
	};

	return {
	    broadcastMessage:broadcastMessage,
	    gestionaComando: gestionaComando,
	    init: init
	};

}();

module.exports = commandManager;
