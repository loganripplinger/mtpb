var jb = require("./jackbox_connection")
const WebSocket = require('ws');



var userId = '656fb518-d0ae-494f-bfd6-4e9a8fbde2fd'
var room = 'IGHB'

jb.getWsUrl(userId, room).then(res => {

	console.log(res)
	if (res['success'] === 'fail') { 
		console.log('Encountered a failure when attempting to join the room ' + room + '. Exiting.')
		process.exit() 
	}
	
	let ws_url = res['ws_url'] // program parameter
	let host_url = res['serverid'] + ":38203"

	console.log(host_url)

	const ws = new WebSocket(ws_url, {
		origin: "https://jackbox.tv",
		host: host_url,
		perMessageDeflate: false
	});

	var openmessage = '5:::{"name":"msg","args":[{"roomId":"' + room + '","name":"LOL","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","joinType":"audience","options":{"roomcode":"' + room + '","name":"LOL","email":"","phone":""},"type":"Action","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fd","action":"JoinRoom"}]}'

	ws.onopen = function (event) {
	    console.log('Connection Open');
		// ws.send('1::');
		ws.send(openmessage)
		ws.send('5:::{"name":"msg","args":[{"roomId":"ARMA","name":"LOL","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","joinType":"audience","options":{"roomcode":"ARMA","name":"LOL","email":"","phone":""},"type":"Action","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fd","action":"JoinRoom"}]}')
	};

	ws.onmessage = function (event) {
	    console.log('Recieved: '+event.data);
	    if (event.data.substring(0,1) === '2') {
	    	console.log('pong!')
	    	ws.send('2::')
	    }

	    if (event.data.substring(0,1) === '5') {
			console.log('')	    	

	    	// easiest method to check for trivia questions
	    	try {
		    	// TRIVIA QUESTIONS
		    	const json = JSON.parse(event.data.split(':::')[1])
		    	console.log(json)

		    	// check if game over
		    	if (json.args[0]['blob'].gameResults !== null) {
		    		console.log('Game over, exiting')
		    		process.exit()
		    	}

		    	const trivia_data = json.args[0]['blob']['audience']

		    	const question = trivia_data.text

		    	const answer_list = trivia_data['choices']
		    	let answer = []
		    	for (let key of answer_list.keys()) {
		    		answer.push(answer_list[key]['text']) // REMOVE HTML
		    	}

		    	console.log("Question: " + question)
		    	console.log("Answers: " + answer)
		    } catch(e) {
		    	console.log('error on trying to extract trivia_data')
		    	console.log(e)
		    }
	    }
	};

})

 
// ws.on('message', function incoming(data) {
//   console.log(data);
// });

// ws.on('open', function open() {
//   ws.send('2::');
// });












 
// const wss = new WebSocket.Server({ port: 8080 });
 
// wss.on('connection', function connection(ws, req) {
//   const ip = req.connection.remoteAddress;
// });


// const WebSocket = require('ws');
 
// const ws = new WebSocket('wss://echo.websocket.org/', {
//   origin: 'https://websocket.org'
// });
 
// ws.on('open', function open() {
//   console.log('connected');
//   ws.send(Date.now());
// });
 
// ws.on('close', function close() {
//   console.log('disconnected');
// });
 
// ws.on('message', function incoming(data) {
//   console.log(`Roundtrip time: ${Date.now() - data} ms`);
 
//   setTimeout(function timeout() {
//     ws.send(Date.now());
//   }, 500);
// });