const axios = require('axios');

async function firstConnection(USER_ID, ROOM) {
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
	try {
		var PORT = ':38203';
		var epochTime = (new Date).getTime(); //unix epoch time
		var URL = 'https://' + serverId + PORT + '/socket.io/1/?t=' + epochTime;
		// console.log(URL)
		const res = await axios.get(URL);
		
		var websocketId = res.data.split(':')[0];
		var wsUrl = 'wss://' + serverId + PORT + '/socket.io/1/websocket/' + websocketId;

		return wsUrl;
	} catch (e) {
		// console.log(e)
	}
}


async function getWsUrl(USER_ID, ROOM) {
	try {
		
		const data = await firstConnection(USER_ID, ROOM);

		//fail if we are joining as a player or the audience is disabled
		if (data['mode'] === "full") { 
			return {
				success: 'fail',
				mode: data['mode'], 
				wsUrl: '',
				serverId: ''}
	  	};

		// console.log('got first wait, serverId is :' + data['serverId']);
		const wsUrl = await secondConnection(data['serverId']);

		return {
			success: 'success',
			mode: data['mode'],
			wsUrl: wsUrl,
			serverId: data['serverId']
		};
	} catch(e) {
		//todo if 404 return room not found

		// console.log(e)
		return {
			success: 'fail',
			mode:'',
			wsUrl: '',
			serverId: ''
		};
	}
}

module.exports.getWsUrl = getWsUrl;