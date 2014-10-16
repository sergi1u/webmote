"use strict";


/*******************************************************************************
********************************************************************************
********************************************************************************
*******************************************************************************/

//init_page();

function init_page_mediam(){

	$( document ).on( "click", ".show-page-loading-msg", function() {
		$(this).attr('disabled','');
	    var $this = $( this ),
		theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
		msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
		textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
		textonly = !!$this.jqmData( "textonly" ),
		html = $this.jqmData( "html" ) || "";

	    $.mobile.loading( "show", {
		    text: msgText,
		    textVisible: textVisible,
		    theme: theme,
		    textonly: textonly,
		    html: html
	    });
	})
	.on( "click", ".hide-page-loading-msg", function() {
	    $.mobile.loading( "hide" );
	});

	reload_media();
	init_buttons();
}


function reload_media()
{

	var video = localStorage.getItem("video");
	var subtitles = localStorage.getItem("subtitles");

	if( video !== null && video !== '' ){
		$('#video_title').text(video.slice( video.lastIndexOf("/") +1 ) );
	}
	if( subtitles !== null && subtitles !== '' ){
		$('#subtitles_title').text(subtitles.slice( subtitles.lastIndexOf("/") +1 ) );
	}

	get_fixed_mp3()
	get_videos();
	get_subtitles();
	get_mp3();

}

function get_fixed_mp3()
{
	var radioInput="";
	var spanText;
	var radioParent = document.getElementById("fixed_mp3");
	var fixed_mp3 = localStorage.getItem("mp3");
	var option=""

	radioParent.innerHTML="";

   // segonahora
	option = "/home/pi/multimierda/musica/segonahora.mp3";
	radioInput = document.createElement("input")
	radioInput.setAttribute('type', 'radio');
	radioInput.setAttribute('name', "select_fixed_mp3");
	radioInput.setAttribute('value', option);
	if( option.localeCompare( fixed_mp3 ) == 0 )
		radioInput.setAttribute('checked', 'checked');
	radioParent.appendChild(radioInput);

	spanText = document.createElement("span")
	spanText.innerHTML = option.slice( option.lastIndexOf("/") +1 ) + " ";
	radioParent.appendChild(spanText);
	
   // la competencia
	option = "/home/pi/multimierda/musica/lacompetencia.mp3";
	radioInput = document.createElement("input")
	radioInput.setAttribute('type', 'radio');
	radioInput.setAttribute('name', "select_fixed_mp3");
	radioInput.setAttribute('value', option);
	if( option.localeCompare( fixed_mp3 ) == 0 )
		radioInput.setAttribute('checked', 'checked');
	radioParent.appendChild(radioInput);

	spanText = document.createElement("span")
	spanText.innerHTML = option.slice( option.lastIndexOf("/") +1 ) + "<br />";
	radioParent.appendChild(spanText);
	
}

function get_videos( )
{
	var xhr = new XMLHttpRequest();
	if ( typeof xhr.withCredentials === undefined ){
		return false;
	}

	xhr.onerror = function(e){
		alert( "Error getting media data." );
	}

	xhr.onprogress = function(e){
		var ratio = e.loaded / e.total;
		//debug( ratio + "% descargado." );
	}

	// Data received
	xhr.onload = function(e){
		received_videos(e, xhr);
	}

	xhr.open("GET", "videos.json", true);

	//param_post  = "tipo=1";

	xhr.setRequestHeader ('Content-type','application/x-www-form-urlencoded')
	//xhr.send( param_post );
	xhr.send( );

}

function received_videos(e, xhr){

	var li;
	var ul = $('#ul_videos');
	var video = localStorage.getItem("video");

	ul.find("li").remove();

	ul.append('<li><a href="javascript:selected_video(\'\')">No video</a></li>');

	var aVideos = JSON.parse(xhr.responseText);
	for( var n=0;n<aVideos.length;n++){
		li  = '<li><a href="javascript:selected_video(\'' + aVideos[n] + '\')">';
		li += aVideos[n].slice( aVideos[n].lastIndexOf("/") +1 );
		li += '</a></li>';
		ul.append(li);
	}

	if ( ul.hasClass('ui-listview')) {
	   ul.listview('refresh');
	     } 
	else {
	    ul.trigger('create');
	     }



}

function selected_video(sel_video){
	localStorage.setItem('video',sel_video);
	if( sel_video != '' )
		$('#video_title').text(sel_video.slice( sel_video.lastIndexOf("/") +1 ) );
	else
		$('#video_title').text('No video');
	$.mobile.pageContainer.pagecontainer("change", "#mediam");

}

function get_subtitles( )
{
	var xhr = new XMLHttpRequest();
	if ( typeof xhr.withCredentials === undefined ){
		return false;
	}

	xhr.onerror = function(e){
		alert( "Error getting media data." );
	}

	xhr.onprogress = function(e){
		var ratio = e.loaded / e.total;
		//debug( ratio + "% descargado." );
	}

	// Data received
	xhr.onload = function(e){
		received_subtitles(e, xhr);
	}

	xhr.open("GET", "subtitles.json", true);

	xhr.setRequestHeader ('Content-type','application/x-www-form-urlencoded')
	xhr.send( );

}

function received_subtitles(e, xhr){

	var li;
	var ul = $('#ul_subtitles');
	var subtitles = localStorage.getItem("subtitles");

	ul.find("li").remove();

	ul.append('<li><a href="javascript:selected_subtitles(\'\')">No subtitles</a></li>');

	var aSubtitles = JSON.parse(xhr.responseText);
	for( var n=0;n<aSubtitles.length;n++){
		li  = '<li><a href="javascript:selected_subtitles(\'' + aSubtitles[n] + '\')">';
		li += aSubtitles[n].slice( aSubtitles[n].lastIndexOf("/") +1 );
		li += '</a></li>';
		ul.append(li);
	}

	if ( ul.hasClass('ui-listview')) {
	   ul.listview('refresh');
	     } 
	else {
	    ul.trigger('create');
	     }

}

function selected_subtitles(sel_subtitles){
	localStorage.setItem('subtitles',sel_subtitles);

	if( sel_subtitles != '' )
		$('#subtitles_title').text(sel_subtitles.slice( sel_subtitles.lastIndexOf("/") +1 ) );
	else
		$('#subtitles_title').text('----' );

	$.mobile.pageContainer.pagecontainer("change", "#mediam");

}

function get_mp3( )
{
	var xhr = new XMLHttpRequest();
	if ( typeof xhr.withCredentials === undefined ){
		return false;
	}

	xhr.onerror = function(e){
		alert( "Error getting media data." );
	}

	xhr.onprogress = function(e){
		var ratio = e.loaded / e.total;
		//debug( ratio + "% descargado." );
	}

	// Data received
	xhr.onload = function(e){
		received_mp3(e, xhr);
	}

	xhr.open("GET", "mp3.json", true);

	xhr.setRequestHeader ('Content-type','application/x-www-form-urlencoded')
	xhr.send( );

}

function received_mp3(e, xhr){

	var input, name,id;
	var fs = $('#fieldset_mp3');
	//var video = localStorage.getItem("video");

	fs.find('input').remove();
	fs.find('label').remove();

	//ul.append('<li><a href="javascript:selected_mp3(\'\')">Clear list</a></li>');

	var aMP3 = JSON.parse(xhr.responseText);
	for( var n=0;n<aMP3.length;n++){
		name = aMP3[n];
		id = aMP3[n].slice( aMP3[n].lastIndexOf("/") +1 );
		/*
		if( aVideos[n].localeCompare( video ) == 0 )
			li += ' data-icon="check"';
		*/

		input  = '<input type="checkbox" name="' + name + '"';
		input += ' id="' + id + '">';
		input += '<label for="' + id + '">' + id + '</label>';


		fs.append(input);
	}

	if ( fs.hasClass('ui-listview')) {
	   fs.listview('refresh');
	     } 
	else {
	    fs.trigger('create');
	     }

}


// Funcion inservible
function return_videoPlayer(){

	var n;
	var videos = document.getElementsByName("select_video");
	var subtitles = document.getElementsByName("select_subtitles");

	n=0;
	while( n < videos.length ){
		if( videos[n].checked ){
			localStorage.setItem( "video", videos[n].value );
			break;
		}
		n++;
	}

	n=0;
	while( n < subtitles.length ){
		if( subtitles[n].checked ){
			localStorage.setItem( "subtitles", subtitles[n].value );
			break;
		}
		n++;
	}

	window.location.assign("/videoplayerm.html");

}

/*
Asigns events to buttons
*/
function init_buttons(){

	document.getElementById("btn_read_usb").onclick=function(){ 
		sendXhr("usb");
	 };

	document.getElementById("btn_read_local").onclick=function(){ 
		sendXhr("local");
	 };

	document.getElementById("btn_video").onclick=function(){ 
		//return_videoPlayer();
		window.location.assign("/videoplayerm.html");

	 };

	document.getElementById("btn_mp3").onclick=function(){ 
		window.location.assign("/mp3playerm.html");

	 };

	document.getElementById("btn_get_segonahora").onclick=function(){ 
		sendXhr("lasegonahora");
	 };
	document.getElementById("btn_get_lacompetencia").onclick=function(){
		sendXhr('lacompetencia');

	 };

	$("#video_title").click( function(){
		$.mobile.pageContainer.pagecontainer("change", "#videos");
	 });

	$("#subtitles_title").click( function(){
		$.mobile.pageContainer.pagecontainer("change", "#subtitles");
	 });

	$("#mp3_title").click( function(){
		$.mobile.pageContainer.pagecontainer("change", "#mp3");
	 });

	$("[name='select_fixed_mp3']").change( function(){
		localStorage.setItem('mp3', this.value);
	 });

}


function sendXhr( signal )
{
	var post_data = "";
	var xhr = new XMLHttpRequest();
	var video,subtitles;


	if ( signal == null )
		return;

	post_data = "c=" + signal;

	if( signal === "start" ){

		video = localStorage.getItem("video");
		subtitles = localStorage.getItem("subtitles");

		post_data += "&video=" + video;
		post_data += "&subtitles=" + subtitles;

	}


	xhr.onerror = function(e){
		alert( "Error creating xhr signal." );
	}

	xhr.onprogress = function(e){
		var ratio = e.loaded / e.total;
		//debug( ratio + "% descargado." );
	}


	xhr.onreadystatechange=function()
	{
	if (xhr.readyState == 4 && xhr.status == 200)
		{
			if( signal === 'usb' ){
				$.mobile.loading( "hide" );
				$('#btn_read_usb').removeAttr('disabled');

				reload_media();
			}

			else if( signal === 'local' ){
				$.mobile.loading( "hide" );
				$('#btn_read_local').removeAttr('disabled');

				reload_media();
			}

			else if( signal === 'lasegonahora' ){
				$.mobile.loading( "hide" );
				$('#btn_get_segonahora').removeAttr('disabled');
			}
			else if( signal === 'lacompetencia' ){
				$.mobile.loading( "hide" );
				$('#btn_get_lacompetencia').removeAttr('disabled');
			}

		}
	}


	xhr.open("POST", "omx_command", true);

	// Envia el formulario
	xhr.setRequestHeader ('Content-type','application/x-www-form-urlencoded');
	xhr.send( post_data );

}

