const axios = require('axios');

async function firstConnection(USER_ID, ROOM) {
	// This returns the serverid for use in the ws url
	// serverid.jackbox.com
	// This can also alert us that the room;
	//   does not exist
	//   is full / does not allow audience to join
	try {
		var URL = 'https://blobcast.jackboxgames.com/room/' + ROOM + '?userId=' + USER_ID;

		const res = await axios.get(URL);
		console.log('waitied for first, got: ' + res.data.server);
	  	//console.log(res.data)
	  	//console.log(res.data.success);
		//console.log(res.data.roomid);
		//console.log(res.data.server);
		//console.log(res.data.apptag);
		// console.log(res.data.joinAs);

		var serverId = res.data.server;
	    
	    return {
	    	mode: res.data.joinAs,
	    	serverId: res.data.server
		};
	} catch (e) {
		// TODO: if 404, ...
		// console.log(e)
	}
}

async function secondConnection(serverId) {
	// This gives us the websocketid that we need to connect to in
	// wss://serverid.jackbox.com:port/socket.io/1/websocket/websocketid
	try {
		var PORT = ':38203';
		var epochTime = (new Date).getTime(); //unix epoch time
		var URL = 'https://' + serverId + PORT + '/socket.io/1/?t=' + epochTime;
		// console.log(URL)
		const res = await axios.get(URL);
		
		var websocketId = res.data.split(':')[0];
		var webSocketURL = 'wss://' + serverId + PORT + '/socket.io/1/websocket/' + websocketId;

		return webSocketURL;
	} catch (e) {
		// console.log(e)
	}
}

async function getWebSocketURL(USER_ID, ROOM) {
	// Given a valid room id, this will give us the required url \
	// that we need to connect on websocket to in order to play the 
	// game.
	try {
		const data = await firstConnection(USER_ID, ROOM);

		// fail if we are joining as a player or the audience is disabled
		if (data['mode'] === "full") { 
			return {
				success: false,
				mode: data['mode'], 
				webSocketURL: '',
				serverId: ''}
	  	};

		// console.log('got first wait, serverId is :' + data['serverId']);
		const webSocketURL = await secondConnection(data['serverId']);

		return {
			success: true,
			mode: data['mode'],
			webSocketURL: webSocketURL,
			serverId: data['serverId']
		};
	} catch(e) {
		//todo if 404 return room not found

		// console.log(e)
		return {
			success: false,
			mode:'',
			webSocketURL: '',
			serverId: ''
		};
	}
}

module.exports.getWebSocketURL = getWebSocketURL;