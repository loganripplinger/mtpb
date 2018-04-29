var jb = require("./jackbox_connection")
const WebSocket = require('ws');



var userId = '656fb518-d0ae-494f-bfd6-4e9a8fbde2fd'

var user_name = 'ROBOT'
var room = 'PYKN'
var joinType = 'player' //'audience'

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

	var openmessage = '5:::{"name":"msg","args":[{"roomId":"' + room + '","name":"' + user_name + '","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","joinType":"' + joinType + '","options":{"roomcode":"' + room + '","name":"' + user_name + '","email":"","phone":""},"type":"Action","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fd","action":"JoinRoom"}]}'
	console.log(openmessage)
	ws.onopen = function (event) {
	    console.log('Connection Open');
		ws.send(openmessage)
	};

	ws.onmessage = function (event) {
		var fs = require('fs')
		fs.appendFile(room + '_log.txt', event.data, function (err) {
		  if (err) {
		    // append failed
		  } else {
		    // done
		  }
		})
	    console.log('Recieved: '+event.data);
	    if (event.data.substring(0,1) === '2') {
	    	console.log('pong!')
	    	ws.send('2::')
	    }

	    if (event.data.substring(0,1) === '5') {
			console.log('')	    	
	    	// easiest method to check for trivia questions
	    	try {

		    	const json = JSON.parse(event.data.split(':::')[1])
		    	console.log(json)
		    	
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

function handlePlayer(ws, json) {
	process.exit()
}

function handleAudience(ws, json) {

		    	const trivia_data = json['blob']['audience']

		    	const question = trivia_data.text
		    	const question_type = trivia_data.type

		    	const answer_list = trivia_data['choices']

		    	// for (i=1;i<=answer_list.length;i++) {
		    	// 	console.log('real keys: ' + answer_list[i].key)
		    	// }

		    	let answer = []
		    	for (let key of answer_list.keys()) {
		    		console.log('answer key: ' + key)
		    		console.log('answer text: ' + answer_list[key]['text'])
		    		answer.push(answer_list[key]['text']) // can have <i> if title. TODO select key correctly
		    	}

		    	console.log("Question: " + question)
		    	console.log("Answers: " + answer)

		    	if (question_type === 'single') {
			    	// send a random answer
			    	var chosen_answer = answer[Math.floor(Math.random() * answer.length)];
					const answer_message = '5:::{"name":"msg","args":[{"userId":"' + userId + '","roomId":"' + room + '","module":"vote","name":"Trivia Death Vote","message":{"type":"vote","vote":"' + chosen_answer + '"},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendSessionMessage"}]}'
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
					const answer_message = '5:::{"name":"msg","args":[{"userId":"' + userId + '","roomId":"' + room + '","module":"vote","name":"Trivia Death Vote","message":{"type":"vote","vote":"' + multi_answer + '"},"type":"Action","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","action":"SendSessionMessage"}]}'
					console.log('sending : ' + answer_message)
					ws.send(answer_message)

				}

}