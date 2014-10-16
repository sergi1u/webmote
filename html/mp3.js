"use strict";

function init_mp3m()
{

	var mp3 = localStorage.getItem('mp3');

	if( mp3 !== null )
		document.getElementById("mp3_title").innerHTML = mp3.slice( mp3.lastIndexOf("/") +1 );

	init_buttons();

}


/*
Asings events to buttons
*/
function init_buttons(){

	$("#btn_change_media").click( function(){ 
		window.location.assign("/mediam.html");
	 });


	$("#btn_start").click( function(){
		sendXhr("start_mp3");
	});

	$("#btn_stop").click( function(){
		sendXhr("stop");
	});

	$("#btn_pause").click( function(){
		sendXhr("pause");
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
		sendXhr("skip--");
	});

	$("#btn_right_600").click( function(){
		sendXhr("skip++");
	});

	$("#btn_left_30").click( function(){
		sendXhr("skip-");
	});


	$("#btn_right_30").click( function(){
		sendXhr("skip+");
	});


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
