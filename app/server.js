var mediaContent = {	aVideos: null,
			aSubtitles: null,
			aMp3: null
		   },
    commandManager = require('./commandManager'),
    socketServer = require('./socketServer');
    mediaServer = require('./MediaServer');

    commandManager.init( socketServer, mediaContent );
    mediaServer.init( commandManager );

    socketServer.init( 8080, 9000, commandManager, mediaContent );
