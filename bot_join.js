const WebSocket = require('ws');
var jb = require("./jackbox_connection")

const ROOM = process.argv[2].toUpperCase()

const isNotValidRoom = ROOM.length !== 4 || !(/[a-zA-Z]{4}/.test(ROOM))

if (isNotValidRoom) {
	console.log(`Provide a valid room code. You provided: ${ROOM}`)
	process.exit()
}

const PORT = ":38203"
const USER_ID = randUserId()
const USER_NAME = 'ROBOT'
const JOIN_TYPE = 'player' 
// const JOIN_TYPE = 'audience' 

// console.log('USER_ID: ' + USER_ID)
jb.getWsUrl(USER_ID, ROOM).then(res => {

	// console.log(res)
	if (res['success'] === 'fail') { 
		console.log('Encountered a failure when attempting to join the room ' + ROOM + '. Exiting.')
		process.exit() 
	}
	
	let ws_url = res['ws_url'] // program parameter
	let host_url = res['serverid'] + PORT

	console.log(host_url)

	const ws = new WebSocket(ws_url, {
		origin: "https://jackbox.tv",
		host: host_url,
		perMessageDeflate: false
	});

	var openmessage = '5:::{"name":"msg","args":[{"roomId":"' + ROOM + '","name":"' + USER_NAME + '","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","joinType":"' + JOIN_TYPE + '","options":{"roomcode":"' + ROOM + '","name":"' + USER_NAME + '","email":"","phone":""},"type":"Action","userId":"' + USER_ID + '","action":"JoinRoom"}]}'
	console.log(openmessage)
	ws.onopen = function (event) {
	    console.log('Connection Open');
		ws.send(openmessage)
	};

	ws.onmessage = function (event) {
		var fs = require('fs')
		fs.appendFile(ROOM + '_log.txt', event.data, function (err) {
		  if (err) {
		    // append failed
		  } else {
		    // done
		  }
		})
	    if (event.data.substring(0,1) === '2') {
	    	console.log('Ping? Pong!')
	    	ws.send('2::')
	    	return
	    }
		//0:: means you were disconnected, can occur when you join in new websocket with same USER_ID
	    console.log('\x1b[37m'+event.data+'\x1b[0m');
	    if (event.data.substring(0,1) === '5') {
			console.log('')	    	
	    	// easiest method to check for trivia questions
	    	try {

		    	const json = JSON.parse(event.data.split(':::')[1])
		    	// console.log(json)
		    	
				if ('success' in json.args[0]) {
		    		console.log('Recieved success: ' + json.args[0].success)
		    	}

		    	// TRIVIA QUESTIONS
		    	switch(json.args[0].event) {
		    		case 'RoomDestroyed': //Game over
		    			console.log('Room destroyed. Exiting')
		    			process.exit()

		    		case 'CustomerBlobChanged': // maybe answer a question as player
		    			handlePlayer(ws, json.args[0])
		    			break;

		    		case 'RoomBlobChanged': 
		    			// maybe answer a question as audience
		    			// or in lobby
		    			handleAudience(ws, json.args[0])
		    			break;
		    	}
		    } catch(e) {
		    	console.log('error on trying to extract trivia_data')
		    	console.log(e)
		    }
	    }
	};

})

function handlePlayer(ws, data) {
	try {

		//{"name":"msg","args":[{"type":"Event","event":"CustomerBlobChanged","roomId":"BWKS","blob":{"choices":[{"disabled":false,"text":"Coca-Cola"},{"disabled":false,"text":"Nestle"},{"disabled":false,"text":"Nabisco"},{"disabled":false,"text":"Heinz"}],"chosen":null,"dollInfo":{"controllerColors":{"dark":"#5f3c28","light":"#e1af78"},"name":"Orange"},"playerIndex":1,"playerName":"Im a robot","state":"MakeSingleChoice","text":"What food company actually owns the Weight Watchers weight loss clinics?"}}]}
		json = data.blob

		var choices = json.choices
		// choices
		// [ { disabled: false, text: 'Coca-Cola' },
		//  { disabled: false, text: 'Nestle' },
	  	//	{ disabled: false, text: 'Nabisco' },
	  	//	{ disabled: false, text: 'Heinz' } ]

	  	//TODO dont ignore disabled

		var mode = json.state // MakeSingleChoice

	  	if (mode === 'MakeSingleChoice') {
	  		//push to a list
	  		//pick a random one
	  		var answer = Math.floor(Math.random() * choices.length)
	  		//submit it
	  		const message = '5:::{"name":"msg","args":[{"roomId":"' + ROOM + '","userId":"' + USER_ID + '","message":{"choice":' + answer + '},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendMessageToRoomOwner"}]}'
	  		console.log('Sending: ' + message)
	  		
	  		// real
	  		// 5:::{"name":"msg","args":[{"roomId":"DQCM","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fd","message":{"choice":3},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendMessageToRoomOwner"}]}
	  		// mine
	  		// 5:::{"name":"msg","args":[{"roomId":"VRFE","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fa","message":{"choice":0},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendMessageToRoomOwner"}]}

	  		// var seconds = 2
	  		// var waitTill = new Date(new Date().getTime() + seconds * 1000);
	  		// while(waitTill > new Date()){}

	  		ws.send(message)
	  		return 
	  	} else if (mode === 'MakeManyChoices') {

			for (i = 1; i<=choices.length; i++) {
				var true_or_false = (Math.floor(Math.random() * 2) === 1)
				if (i === 1) {
					multi_answer = true_or_false
				} else {
					multi_answer = multi_answer + ',' + true_or_false
				}
			}
	  		const message = '5:::{"name":"msg","args":[{"roomId":"' + ROOM + '","userId":"' + USER_ID + '","message":{"choices":[' + multi_answer + ']},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendMessageToRoomOwner"}]}'
			
			// var seconds = 2
	  // 		var waitTill = new Date(new Date().getTime() + seconds * 1000);
	  // 		while(waitTill > new Date()){}	  		
	  		ws.send(message)
	  		return

	  	} else if (mode === 'Lobby') {
	  		console.log('Lobby stuff. Ignoring.')
			//"lobbyState":"CanStart",
	  		//"lobbyState":"Countdown"
	  		return

	  	} else {
	  		console.log('FOUND A DIFFERENT CHOICE: ' + mode)
	  	}
	} catch(e) {
		console.log(e)
	}
}

//cut finger off
//5:::{"name":"msg","args":[{"type":"Event","event":"CustomerBlobChanged","roomId":"QNCT","blob":{"choices":[{"disabled":false,"text":"Cut finger 1"},{"disabled":false,"text":"Cut finger 2"},{"disabled":false,"text":"Cut finger 3"},{"disabled":false,"text":"Cut finger 4"}],"chosen":null,"dollInfo":{"controllerColors":{"dark":"#383838","light":"#afafaf"},"name":"Gray"},"playerIndex":1,"playerName":"Robot","state":"MakeSingleChoice","text":"Choose which finger to cut off"}}]}


function handleAudience(ws, json) {

	if (!('blob' in json) || !('audience' in json['blob']) || !('choices' in json['blob']['audience'])) {
		console.log('Does not contain a question/answer for audience. Ignoring.')
		return
	}

	// console.log(!('blob' in json))
	// console.log(!('audience' in json['blob']))
	// console.log(!('choices' in json['blob']['audience']))	

	const trivia_data = json.blob.audience

	const question = trivia_data.text
	const question_type = trivia_data.type

	const answer_list = trivia_data.choices //array of objects
	// console.log('answer_list: ' + answer_list[1])

	let answer = []
	for (i=0;i<answer_list.length;i++) {
		if ('key' in answer_list[i]) {
			answer.push(answer_list[i].key) //used when voting for users ids
		} else {
			answer.push(answer_list[i].text)
		}
	}

	// for (let key of answer_list.keys()) {
	// 	console.log('answer key: ' + key)
	// 	console.log('answer text: ' + answer_list[key]['text'])
	// 	answer.push(answer_list[key]['text']) // can have <i> if title. TODO select key correctly
	// }

	console.log("Question: " + question)
	console.log("Answers: " + answer)

	if (question_type === 'single') {
    	// send a random answer
    	var chosen_answer = answer[Math.floor(Math.random() * answer.length)];
		const answer_message = '5:::{"name":"msg","args":[{"userId":"' + USER_ID + '","roomId":"' + ROOM + '","module":"vote","name":"Trivia Death Vote","message":{"type":"vote","vote":"' + chosen_answer + '"},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendSessionMessage"}]}'
		console.log('sending : ' + answer_message)
		ws.send(answer_message)
	} else if (question_type === 'multiple') {
		// format, "vote":"true,true,false"
		// bundle up those answers
		var multi_answer = ''
		for (i = 1; i<=answer.length; i++) {
			var true_or_false = (Math.floor(Math.random() * 2) === 1)
			if (i === 1) {
				multi_answer = true_or_false
			} else {
				multi_answer = multi_answer + ',' + true_or_false
			}
		}

		console.log(multi_answer)

		// send those answers
		const answer_message = '5:::{"name":"msg","args":[{"userId":"' + USER_ID + '","roomId":"' + ROOM + '","module":"vote","name":"Trivia Death Vote","message":{"type":"vote","vote":"' + multi_answer + '"},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendSessionMessage"}]}'
		console.log('sending : ' + answer_message)
		ws.send(answer_message)
	}
}

function randUserId() {
	// produces: //656fb518-d0ae-494f-bfd6-4e9a8fbde2fa
	return Math.random().toString(16).substring(2, 10) + '-' + 
		Math.random().toString(16).substring(2, 6) + '-' +
		Math.random().toString(16).substring(2, 6) + '-' +
		Math.random().toString(16).substring(2, 14);
}