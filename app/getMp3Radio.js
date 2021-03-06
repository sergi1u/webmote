/*
   Obtiene el RSS con los ultimos ficheros de la segona hora y se baja el del dia actual si existe
*/

/*
  Gets the file especified on url and save it on file
*/
function get_archive( url, file, return_function )
{
  var fs = require('fs'),
    request = require('request');

  var download = function(uri, filename, callback){
    request.head(uri, function(error, response, body){
	if (!error && response.statusCode == 200) {
	      //console.log('content-type:', response.headers['content-type']);
	      //console.log('content-length:', response.headers['content-length']);

	      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	}
    });
  };

  download(url, file, function(){
    console.log(file + ' downloaded.');
	return_function(null, file + ' downloaded');

  });
}

function find_last_mp3(xml)
{
	var d = new Date();	// actual date
	var fecha_mp3;

	var url="";
 	var aItems = xml.rss.channel[0].item;

	for (var n=0; n < aItems.length; n++){
		fecha_mp3 = aItems[n].description[0];
		if( fecha_mp3.slice(7,9) === d.toISOString().slice(8,10)	// dia
			&& fecha_mp3.slice(10,12) === d.toISOString().slice(5,7)	// mes
			&& fecha_mp3.slice(13,15) === d.toISOString().slice(2,4))	// año
		{
			url = aItems[n].link[0];
			break;
		}
		//console.log(aItems[n].description[0] );	
	}

	return url;

}

/*
 Executes an HTTP GET request and returns the page requested on callback

  use get_rss( host, path, callback )

  callback arguments( error, page_requested )

*/
function get_page( pHost, pPath, done){

   var options = {
	host: pHost,
 	path: pPath,
 	method: 'GET',
   };

   var str="";
   var http = require('http');
   var req = http.request( options, function(res) {
	   res.setEncoding('utf8');

	   res.on('end', function(  ) {
		//console.log("Got response: " + res.statusCode);
		return done(null, str);
	    });
	 
	   res.on('data', function (chunk) {
		str += chunk;
	    });

	    req.on('error', function(e){
		   return('problem with request: ' + e.message);
	    });

	    req.end();
   } );

   req.write("");
   req.end();
} // end function get_page


function get_last_mp3( host, path, archive, callback )
{

  get_page(host,path,
	function(err, ret){
		if (err) throw err;

		var parseString = require('xml2js').parseString;
		parseString(ret, function (err, result) {
		    var url = find_last_mp3(result);
		    if( url !== "" ){
		    	console.log('Getting mp3: ' + url);
			get_archive(url, archive, callback);
		    }
		    else{
			callback('mp3 file not found.');
		    }
		});

	} );

}

exports.getMp3 = function( program, return_function ){

	var host, path, archive="";
console.log('en getMp3' + program);
	if( program === 'lasegonahora' ){
		host='www.racalacarta.com';
		path='/wp-feeder.php?limit=3&prog=LA%20SEGONA%20HORA&param=la_segona_hora';
		archive = '/home/pi/multimedia/musica/segonahora.mp3';

	}

	else if( program === 'lacompetencia' ){
		host='www.racalacarta.com';
		path='/wp-feeder.php?limit=3&prog=LA%20COMPETENCIA&param=la_competencia';
		archive = '/home/pi/multimedia/musica/lacompetencia.mp3';
	}
	else{
		return_function('Error reading parameters on getMp3');
	}

	//return_function(null,archive);
	get_last_mp3( host, path, archive, return_function );

};

/*
getMp3("lasegonahora", function(err, ret ){
	if( err != null )
		console.log("Error " + err );
	console.log("return : " + ret );
});
*/
//get_last_segonahora();
