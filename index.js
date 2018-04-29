// var jb = require("./jackbox_connection")
const WebSocket = require('ws');


let ws_url = 'wss://i-0beef755e843a2ac4.jackboxgames.com:38203/socket.io/1/websocket/QorxKbnlfEOtULnTYcEC' // program parameter
let host_url = 'i-0beef755e843a2ac4' + ":38203"


const ws = new WebSocket(ws_url, {
	origin: "https://jackbox.tv",
	host: host_url,
	perMessageDeflate: false
});


var openmessage = '5:::{"name":"msg","args":[{"roomId":"PNDO","name":"LOL","appId":"87fd7112-e835-4794-88bc-dc6e3630d640","joinType":"audience","options":{"roomcode":"PNDO","name":"LOL","email":"","phone":""},"type":"Action","userId":"656fb518-d0ae-494f-bfd6-4e9a8fbde2fd","action":"JoinRoom"}]}'

ws.onopen = function (event) {
    console.log('Connection Open');
	// ws.send('1::');
	ws.send(openmessage)
};
ws.onmessage = function (event) {
    console.log('Recieved: '+event.data);
    if (event.data.substring(0,1) === '2') {
    	console.log('pong!')
    	ws.send('2::')
    }
};


 
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