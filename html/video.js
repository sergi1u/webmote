"use strict";

function init_videom()
{

	var video = localStorage.getItem("video");
	var subtitles = localStorage.getItem("subtitles");


	if( video !== null )
		document.getElementById("video_title").innerHTML = video.slice( video.lastIndexOf("/") +1 );

	if( subtitles !== null )
		document.getElementById("video_subtitles").innerHTML = subtitles.slice ( subtitles.lastIndexOf("/") +1 );

	init_buttons();

}


/*
Asings events to buttons
*/
function init_buttons(){


	$("#btn_change_media").click( function(){ 
		window.location.assign("/mediam.html");
		//$.mobile.pageContainer.pagecontainer("change", "/mediam.html");
	 });

	$("#btn_start").click( function(){
		sendXhr("start");
	});

	$("#btn_stop").click( function(){
		sendXhr("stop");
	});

	$("#btn_pause").click( function(){
		sendXhr("pause");
	});

	$("#btn_subtitle").click( function(){
		sendXhr("subtitle");
	});

	$("#btn_rw").click( function(){
		sendXhr("rw");
	});

	$("#btn_ff").click( function(){
		sendXhr("ff");
	});

	$("#btn_volume_up").click( function(){
		sendXhr("vol+");
	});

	$("#btn_volume_down").click( function(){
		sendXhr("vol-");
	});

	$("#btn_left_600").click( function(){
		sendXhr("skip-");
	});

	$("#btn_right_600").click( function(){
		sendXhr("skip++");
	});

	$("#bbtn_left_30").click( function(){
		sendXhr("skip-");
	});


	$("#btn_right_30").click( function(){
		sendXhr("skip+");
	});


/*
	document.getElementById("btn_info").onclick=function(){ 
		sendXhr("info");
	 };

	document.getElementById("btn_halt").onclick=function(){ 
		sendXhr("halt");
	 };
*/
}


function swap_media()
{
	var button =	document.getElementById("btn_start");
	var media = localStorage.getItem("media");
	var video = localStorage.getItem("video");
	var mp3 = localStorage.getItem("mp3");

	if(media === null ){
		if( mp3 != null && mp3 != '' ){
			localStorage.setItem('media','mp3');
			button.value = "Start MP3";
			button.onclick=function(){ 
				sendXhr("start_mp3");
		 	};
		}
		else if( video != null && video != '' ){
			localStorage.setItem('media','video');
			button.value = "Start video";
			button.onclick=function(){ 
				sendXhr("start");
		 	};
		}
	}
	else if ( media === 'mp3' && video != null && video != '')
	{
		localStorage.setItem('media','video');
		button.value = "Start video";
		button.onclick=function(){ 
			sendXhr("start");
	 	};
	}
	else if ( media === 'video' && mp3 != null && mp3 != '' )
	{
		localStorage.setItem('media','mp3');
		button.value = "Start MP3";
		button.onclick=function(){ 
			sendXhr("start_mp3");
	 	};
	}
	else
		localStorage.removeItem('media');



}


function sendXhr( signal )
{
	var post_data = "";
	var xhr = new XMLHttpRequest();
	var mp3,video,subtitles;


	if ( signal == null )
		return;

	post_data = "c=" + signal;

	if( signal === "start" ){

		video = localStorage.getItem("video");
		subtitles = localStorage.getItem("subtitles");

		post_data += "&video=" + video;
		post_data += "&subtitles=" + subtitles;

	}

	else if( signal === "start_mp3" ){

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
