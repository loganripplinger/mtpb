// const WebSocket = require('ws');
const axios = require('axios');
 
var room = "CINF"
var userId = '656fb518-d0ae-494f-bfd6-4e9a8fbde2fd'
var url = 'https://blobcast.jackboxgames.com/room/' + room + '?userId=' + userId

// var serverid = ''

axios.get(url)
  .then(res => {
  	console.log(res.data)
  	console.log(res.data.success);
    console.log(res.data.roomid);
    console.log(res.data.server);
    console.log(res.data.apptag);
    console.log(res.data.joinAs);

    var serverid = res.data.server
    var epochtime = (new Date).getTime(); //unix epoch time

    var url = 'https://' + serverid + ':38203/socket.io/1/?t=' + epochtime
    console.log(url)

    if (res.data.joinAs !== "full") { //|| !(res.data.server === undefined) 
	    return axios.get(url)
	    	.then(res => {
	    		// CALL BACK HELLLLLLL
	    		console.log(res.data)
	    		var websocketid = res.data.split(':')[0]

	    		var ws_url = 'wss://' + serverid + ':38203/socket.io/1/websocket/' + websocketid
	    		console.log(ws_url)
	    	})
	    	.catch(error => {
	    		console.log(error)
	    	});
    } else {
    	console.log()
    }
  })
  .catch(error => {
    console.log(error);
  });



// axios.get('http://google.com')
//   .then((res) => {
//     // do something with Google res

//     return axios.get('http://apple.com');
//   })
//   .then((res) => {
//     // do something with Apple res
//   })
//   .catch((err) => {
//     // handle err
//   });








// const ws = new WebSocket('wss://i-09f65be97a65537d2.jackboxgames.com:38203/socket.io/1/websocket/KzDQDhBP1m7N9CvgYXIY', {
// 	origin: "https://jackbox.tv",
// 	host: "i-09f65be97a65537d2.jackboxgames.com:38203",
// 	perMessageDeflate: false
// });

 
// ws.on('message', function incoming(data) {
//   console.log(data);
// });









// // const ws = new WebSocket('ws://www.host.com/path');
 
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