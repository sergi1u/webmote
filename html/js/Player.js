"use strict";

var settings = null,
    player = null;

function Player( _settings ){
	this.settings = _settings;
	this.socket = null;
};

Player.prototype.init_socket = function ()
{
	this.socket =  new WebSocket(this.settings.host);

        this.socket.onopen = function ( ) {
		console.log("Socket abierto");
	};

        this.socket.onerror = function ( ) {
		console.log("Socket error");
		alert.log("Socket error");
	};
        this.socket.onclose = function ( ) {
		console.log("Socket cerrado");
	};

        this.socket.onmessage = function (message) {
		var data = JSON.parse(message.data);

		// TODO
		switch ( data['cmd_response'] ) {
	    		case 'msg':
				document.getElementById(settings.logID).innerHTML =  data['txt'];
				break;
	    		case 'err':
				document.getElementById(settings.logID).innerHTML = "Recibido error: " + data['txt'];
				break;
			default:
				console.log( "Reibido comando " + data + " y no se que hacer!" );
		}
		document.getElementById(settings.logID).innerHTML =  data['txt'];

        };
};

Player.prototype.setMedia = function( _media ){
	this.settings['media'] = _media;
};

Player.prototype.getMedia = function(  ){
	return( this.settings['media'] );
};


Player.prototype.sendCommand = function( command ){

		if ( this.socket.readyState === 1 ){
			console.log("Enviando commando " + command);
			this.socket.send(JSON.stringify( {cmd: command} ) );
		}
		else{
			console.log("Error. No hay socket abierto para enviar commando " + command);
			
			// si el socket está cerrado, lo reabro
			if( this.socket.readyState === 3 )
				this.init_socket();
		}
};

Player.prototype.sendCommandParam = function( command , param ){
		if ( this.socket.readyState === 1 ){
			console.log("Enviando commando " + command);
			this.socket.send(JSON.stringify( {cmd: command, param: param} ) );
		}
		else{
			console.log("Error. No hay socket abierto para enviar commando " + command);
		}
};

/*
   Objeto heredado de Player
*/
function VideoPlayer ( _settings ){

	Player.call( this , _settings );

};

VideoPlayer.prototype = new Player();

VideoPlayer.prototype.start = function (){
	if( !settings["media"] ){
		console.log("No media to play.");
		return;
	}

	this.sendCommandParam("start_video", { video: settings["media"], subtitles: settings["subtitles"] } );

};
/*
   Objeto heredado de Player
*/
function Mp3Player ( _settings ){

	Player.call( this , _settings );

	var mp3 = null;	
};

Mp3Player.prototype = new Player();

Mp3Player.prototype.start = function (){
	if( !settings["media"] ){
		console.log("No media to play.");
		return;
	}

	this.sendCommandParam("start_mp3", settings["media"]);

};

function init_video()
{

	 settings = {
		host: 'ws://192.168.1.20:9000',
		logID: 'span_log',
		media: null
	};

	var videoPlayer = null,

	video = localStorage.getItem('video'),
	subtitles = localStorage.getItem('subtitles');

	if( video !== null ){
		document.getElementById("video_title").innerHTML = video.slice( video.lastIndexOf("/") +1 );
		settings['media'] = video;
		player = new VideoPlayer( settings );
		player.init_socket( );

		console.log( player.getMedia( ) );
	}
	if( subtitles !== null && subtitles !== "" ){
		document.getElementById("video_subtitles").innerHTML = subtitles.slice( subtitles.lastIndexOf("/") +1 );
		settings['subtitles'] = subtitles;
	}

	init_buttons('video');

}


function init_mp3m()
{

	 settings = {
		host: 'ws://192.168.1.20:9000',
		logID: 'span_log',
		media: null
	};

	var mp3Player = null,

	mp3 = localStorage.getItem('mp3');

	if( mp3 !== null ){
		document.getElementById("mp3_title").innerHTML = mp3.slice( mp3.lastIndexOf("/") +1 );
		settings['media'] = mp3;
		player = new Mp3Player( settings );
		player.init_socket( );

		console.log( player.getMedia( ) );


	}

	init_buttons( 'mp3' );

}


/*
Asings events to buttons
*/
function init_buttons( media_type ){

	$("#btn_change_media").click( function(){ 
		window.location.assign("/");
	 });

	$("#btn_timer").click( function(){
		if( player )
			player.sendCommand("timer");
	});

	$("#btn_start").click( function(){
		if( player )
			player.start();
	});


	$("#btn_stop").click( function(){
		if( player )
			player.sendCommand("stop");
	});

	$("#btn_pause").click( function(){
		if( player )
			player.sendCommand("pause");
	});


	if( media_type === 'mp3' ){

		// It should be a generic option but calls axmixer that only works on mpg123
		$("#btn_volume_up").click( function(){
			if( player )
				player.sendCommand("vol+");
		});

		$("#btn_volume_down").click( function(){
			if( player )
				player.sendCommand("vol-");
		});

		$("#btn_rw").click( function(){
			if( player )
				player.sendCommand("rw");
		});

		$("#btn_ff").click( function(){

			if( player )
				player.sendCommand("ff");
		});

		$("#btn_left_600").click( function(){
			if( player )
				player.sendCommand("skip--");
		});

		$("#btn_right_600").click( function(){
			if( player )
				player.sendCommand("skip++");
		});

		$("#btn_left_30").click( function(){
			if( player )
				player.sendCommand("skip-");
		});


		$("#btn_right_30").click( function(){
			if( player )
				player.sendCommand("skip+");
		});

	}

	else if ( media_type === 'video' ){

		// It should be a generic option but calls axmixer that doesn't works on omxplayer
		$("#btn_volume_up").click( function(){
			if( player )
				player.sendCommand("video_vol+");
		});

		$("#btn_volume_down").click( function(){
			if( player )
				player.sendCommand("video_vol-");
		});


		$("#btn_subtitle").click( function(){
			if( player )
				player.sendCommand("subtitles");
		});

		$("#btn_subtitle_d").click( function(){
			if( player )
				player.sendCommand("subtitles_d");
		});

		$("#btn_subtitle_f").click( function(){
			if( player )
				player.sendCommand("subtitles_f");
		});

		$("#btn_rw").click( function(){
			if( player )
				player.sendCommand("rw");

		});

		$("#btn_ff").click( function(){
			if( player )
				player.sendCommand("ff");
		});


		$("#btn_left_30").click( function(){
			if( player )
				player.sendCommand("left30");
		});

		$("#btn_right_600").click( function(){
			if( player )
				player.sendCommand("right600");
		});

		$("#btn_left_600").click( function(){
			if( player )
				player.sendCommand("left600");
		});


		$("#btn_right_30").click( function(){
			if( player )
				player.sendCommand("right30");
		});

	}




}


function sendXhr( signal )
{
	var post_data = "";
	var xhr = new XMLHttpRequest();
	var mp3;


	if ( signal == null )
		return;

	post_data = "c=" + signal;

	if( signal === 'start_mp3' ){

		mp3 = localStorage.getItem("mp3");

		post_data += "&mp3=" + mp3;
	}

	xhr.onerror = function(e){
		alert( "Error creating xhr signal." );
	}

	xhr.onprogress = function(e){
		var ratio = e.loaded / e.total;
		//debug( ratio + "% descargado." );
	}

	// Request completed
	xhr.onreadystatechange=function()
	{
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			if( signal === 'stop' ){
			}
		}
	}

	xhr.open("POST", "omx_command", true);


	// Envia el formulario
	xhr.setRequestHeader ('Content-type','application/x-www-form-urlencoded');
	xhr.send( post_data );

}
