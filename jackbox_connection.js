const axios = require('axios');

// const example = require('example-library');

// const runDemo = async () => {
//   try {
//     const fistResponse = await example.firstAsyncRequest();
//     const secondResponse = await example.secondAsyncRequest(fistResponse);
//     const thirdAsyncRequest = await example.thirdAsyncRequest(secondResponse);
//   }
//   catch (error) {
//     // Handle error
//   }
// };

// runDemo();

async function go() {
  try {
    // but first, coffee
    const coffee = await getCoffee();
    console.log(coffee); // ☕
    // then we grab some data over an Ajax request
    const wes = await axios('https://api.github.com/users/wesbos');
    console.log(wes.data); // mediocre code
    // many requests should be concurrent - don't slow things down!
    // fire off three requests and save their promises
    const wordPromise = axios('http://www.setgetgo.com/randomword/get.php');
    const userPromise = axios('https://randomuser.me/api/');
    const namePromise = axios('https://uinames.com/api/');
    // await all three promises to come back and destructure the result into their own variables
    const [word, user, name] = await Promise.all([wordPromise, userPromise, namePromise]);
    console.log(word.data, user.data, name.data); // cool, {...}, {....}
  } catch (e) {
    console.error(e); // 💩
  }
}

async function firstConnection(room) {
	try {
		var userId = '656fb518-d0ae-494f-bfd6-4e9a8fbde2fd'
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
	    
	    switch(res.data.joinAs){
	    	case "full":
	    		return ["full", ""]
	    	case "audience":
	    		return ["audience", serverid]
	    	case "player":
	    		return ["player", serverid]
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


async function getWsUrl(room) {
	try {
		const serverid = await firstConnection(room);
		if (serverid[0] === "full") {
			return ['fail', '']
	  	}

		console.log('got first wait, serverid is :' + serverid[1])
		const ws_url = await secondConnection(serverid[1]);

		return ['success', ws_url, serverid[0]]
	} catch(e) {
		return ['fail', '']
	}
}

// module.exports.getWsUrl = getWsUrl;
getWsUrl('PNDO').then(v => {
	console.log(v)
})