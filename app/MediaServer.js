var MediaServer = function (){

	player_type = null,
	player_process = null,
	player_paused = true,


	commandManager = null,

	// contadores de tiempo de reproduccion transcurrido
	INTERVALO_TIMER = 1,
	timer_sec = null;
	tmp_total = 0, tmp_transcurrido = 0,

	stop = function(){
		if( player_process ){
			console.log("Parando playerr");
			if( player_type === 'video' ) 
				player_process.stdin.write('q');	// stops video
			else
				player_process.stdin.write('quit\n');	// stops mp3

			if( timer_sec ){
				clearInterval(timer_sec);
				timer_sec = null;
			}
			tmp_transcurrido = 0;
			inc_timer(0);
			player_process = null;
			player_type = null;
		}
		else
			console.log("No hay proceso de video que parar!");
	},

	start_video = function ( param ) {

		if( !player_process ){

			var aParams,
			spawn, player,
			video = param['video'],
			subtitles = param['subtitles'];

			console.log("Iniciando video " + param['video']);
			get_video_duration( param['video'], function(seg){ tmp_total = seg; } );

			if( subtitles && subtitles != "null" && subtitles != "")
				aParams = ['-o','both','--subtitles', subtitles, video];
			else
				aParams = ['-b','-o','both', video];

			spawn = require('child_process').spawn;
			player = spawn('/usr/bin/omxplayer', aParams );

			player.stdout.on('data', function (data) {
			  console.log('stdout: ' + data);
			});

			player.stderr.on('data', function (data) {
			  player = null;
			  console.log('stderr: ' + data);
			  return null;
			});

			player.on('close', function (code) {
			  console.log('child process exited with code ' + code);
			  player_process = null;
			});

			player_type = 'video';
			player_process = player;

			player_paused = false;

			tmp_transcurrido = 0;
			clearInterval(timer_sec);
			timer_sec = setInterval( inc_timer, INTERVALO_TIMER * 1000, INTERVALO_TIMER);

		}
		else{
			console.log('Ya se está reproduciendo un video o mp3!');
		}

	},

	/*
	Performs de shell instrucction
	 ffmpeg -i <video_file> 2>&1 |grep Duration  | cut -c 13-20
	and returns video duration in seconds or null on error.
	*/

	get_video_duration = function( video , callback)
	{
		var exec = require('child_process').exec,
			child;

		child = exec('ffmpeg -i 2>&1 "' + video + '"|grep Duration | cut -c 13-20',
		  function (error, stdout, stderr) {
		    if( stdout != null ){
			var str_seconds = stdout;
			var int_hours = parseInt( str_seconds.substring(0,2) );
			var int_minutes = parseInt( str_seconds.substring(3,5) );
			var int_seconds = parseInt( str_seconds.substring(6,8) );

			int_seconds = int_seconds + ( int_minutes * 60 ) + ( int_hours * 3600 );

			console.log("Video duration calculated: " + str_seconds);
			callback( int_seconds );
		    }
		    if( stderr != null ){
		      //console.log('stderr: ' + stderr);
		    }
		    if (error !== null) {
		      console.log('exec error: ' + error);
		      callback(null);
		    }
		});


	},	// end function get_video_duration

	start_mp3 = function ( mp3 ) {

		if( !player_process ){
			console.log("Iniciando MP3 " + mp3);
			get_mp3_duration( mp3, function(seg){ tmp_total = seg; } );

			var spawn, mp3Player;
			var aParams = ['-R'];

			spawn = require('child_process').spawn;
			mp3Player = spawn('/usr/bin/mpg123', aParams);


			mp3Player.stdout.on('data', function (data) {
			  //console.log('stdout: ' + data);
			});

			mp3Player.stderr.on('data', function (data) {
			  console.log('stderr: ' + data);
			});

			mp3Player.stdin.on('data', function (data) {
			  console.log('stdin: ' + data);
			});

			mp3Player.on('close', function (code) {
			  console.log('child process exited with code ' + code);
			  player_process = null;
			});

			mp3Player.stdin.write("load " + mp3 + '\n');

			player_type = 'mp3';
			player_process = mp3Player;

			player_paused = false;

			tmp_transcurrido = 0;
			clearInterval(timer_sec);
			timer_sec = setInterval( inc_timer, INTERVALO_TIMER * 1000, INTERVALO_TIMER);


		}
		else{
			console.log('Ya existe un proceso MP3 en ejecución!');
		}

	},

	get_mp3_duration = function( mp3 , callback){
		var exec = require('child_process').exec,
			child;
		child = exec('mp3info -x -p "%S" ' + mp3,
		  function (error, stdout, stderr) {
		    if( stdout != null ){
			var segundos = stdout;
			//console.log("Encontrados segundos: " + segundos);
			callback( parseInt(segundos) );
		    }
		    if( stderr != null ){
		      //console.log('stderr: ' + stderr);
		    }
		    if (error !== null) {
		      console.log('exec error: ' + error);
		      callback(null);
		    }
		});

	},	// end function get_mp3_duration

	notification_clients = function( msg ){
		console.log( msg );
   		commandManager.broadcastMessage('news', msg  );
	},

	inc_timer = function( intervalo ){
		tmp_transcurrido += intervalo;
		notification_clients( "Transcurrido: " + int2time( tmp_transcurrido ) + " de " + int2time(tmp_total) );
	},

	int2time = function( secs ){
		var time="",  minutes = 0,hours = 0;

		if( secs >= 60 ){
			minutes =  Math.floor( secs / 60 );
			secs -= (minutes*60) ;
		}
		if( minutes >= 60 ){
			hours = Math.floor(minutes / 60 );
			minutes -= (hours * 60);
		}

		if( hours > 0 ){
			if( hours < 10 )
				time += "0";
			time += hours.toString() + ":";
		}
		if( minutes > 0 ){
			if( minutes < 10 )
				time += "0";
			time += minutes.toString() + ":";
		}
		if( secs > 0 ){
			if( secs < 10 )
				time += "0";
			time += secs.toString();
		}
		else{
			time += "00";
		}

		return time;
	},


	pause = function(){
		if( !player_process )
			return;

		if ( player_type === 'video' )
			player_process.stdin.write('p');
		else
			player_process.stdin.write('PAUSE\n');

		// shift paused state
		player_paused = player_paused ? false: true;

		if( timer_sec )
			clearInterval(timer_sec);

		if( !player_paused ){
			timer_sec = setInterval( inc_timer, INTERVALO_TIMER * 1000, INTERVALO_TIMER);

		}
	}

	video_command = function( command ){
		if( !player_process )
			return;

		switch ( command ){
			case 'video_vol+':
				player_process.stdin.write('+');
				break;
			case 'video_vol-':
				player_process.stdin.write('-');
				break;
			case 'rw':
				player_process.stdin.write('<');
				break;
			case 'ff':
				player_process.stdin.write('>');
				break;
			case 'left600':
				tmp_transcurrido = Math.min(tmp_transcurrido-600, tmp_total);
				player_process.stdin.write('\x1B\x5B\x42');
				inc_timer(0);
				break;
			case 'left30':
				tmp_transcurrido = Math.min(tmp_transcurrido-30, tmp_total);
				player_process.stdin.write('\x1B\x5B\x44');
				inc_timer(0);
				break;
			case 'right600':
				tmp_transcurrido = Math.min(tmp_transcurrido+600, tmp_total);
				player_process.stdin.write('\x1B\x5B\x41');
				inc_timer(0);
				break;
			case 'right30':
				tmp_transcurrido = Math.min(tmp_transcurrido+30, tmp_total);
				player_process.stdin.write('\x1B\x5B\x43');
				inc_timer(0);
				break;
			case 'subtitles':
				player_process.stdin.write('s');

				break;
			default:
				console.log("recibido comando de video " + command + " que no se cómo gestionar");		}
	},

	mp3_command = function( command ){
		if( !player_process )
			return;

		switch ( command ){
			case 'skip+':
				tmp_transcurrido = Math.min(tmp_transcurrido+10, tmp_total);
				player_process.stdin.write('JUMP +10s\n');
				inc_timer(0);
				break;
			case 'skip++':
				tmp_transcurrido = Math.min(tmp_transcurrido+60, tmp_total);
				player_process.stdin.write('JUMP +60s\n');
				inc_timer(0);
				break;
			case 'skip-':
				tmp_transcurrido = Math.min(tmp_transcurrido-10, tmp_total);
				player_process.stdin.write('JUMP -10s\n');
				inc_timer(0);
				break;
			case 'skip--':
				tmp_transcurrido = Math.min(tmp_transcurrido-60, tmp_total);
				player_process.stdin.write('JUMP -60s\n');
				inc_timer(0);
				break;
			default:
				console.log("recibido comando de MP3 " + command + " que no se cómo gestionar");		}
	},

	getPid = function(){
		if( ! player_process )
			return -1;
		else
			return player_process.pid;
	},

	init = function( _commandManager ) {
		commandManager = _commandManager;
		console.log("En init de Mp3Server " );
	};

	return {
	    getPid: getPid,
	    init: init
	};
}();

module.exports = MediaServer;
