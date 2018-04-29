const axios = require('axios');

async function firstConnection(userId, room) {
	try {
		var url = 'https://blobcast.jackboxgames.com/room/' + room + '?userId=' + userId

		const res = await axios.get(url);
		console.log('waitied for first, got: ' + res.data.server)
	  	// console.log(res.data)
	  	// console.log(res.data.success);
		//  console.log(res.data.roomid);
		//  console.log(res.data.server);
		//  console.log(res.data.apptag);
		console.log(res.data.joinAs);

		var serverid = res.data.server
	    
	    return {
	    	'mode': res.data.joinAs,
	    	'serverid': res.data.server
		}
	} catch (e) {
		console.log(e)
	}
}

async function secondConnection(serverid) {
	try {
		var epochtime = (new Date).getTime(); //unix epoch time
		var url = 'https://' + serverid + ':38203/socket.io/1/?t=' + epochtime
		console.log(url)
		const res = await axios.get(url);
		
		var websocketid = res.data.split(':')[0]
		var ws_url = 'wss://' + serverid + ':38203/socket.io/1/websocket/' + websocketid

		return ws_url
	} catch (e) {
		console.log(e)
	}
}


async function getWsUrl(userId, room) {
	try {
		
		const data = await firstConnection(userId, room);

		//fail if we are joining as a player or the audience is disabled
		if (data['mode'] === "full") { 
			return {'success': 'fail','mode': data['mode'], 'ws_url': '','serverid': ''}
	  	}

		console.log('got first wait, serverid is :' + data['serverid'])
		const ws_url = await secondConnection(data['serverid']);

		return {
			'success': 'success',
			'mode': data['mode'],
			'ws_url': ws_url,
			'serverid': data['serverid']
		}
	} catch(e) {
		//todo if 404 return room not found
		console.log(e)
		return {'success': 'fail','mode':'','ws_url': '','serverid': ''}
	}
}

module.exports.getWsUrl = getWsUrl;