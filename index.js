var express = require('express');
var app = express();
const { spawn } = require('child_process');

app.get('/', function(req, res){
	var welcomePage = "Hello! Go to 'url/room/4-digit-code' to make a bot join that room!";
	res.send(welcomePage);
});

app.get('/room/:id([a-zA-Z]{4})', function(req, res){
	var roomCode = req.params.id;
	res.send(`Attempting to start bot to join room ${roomCode}`);
	
	startChildBot(roomCode);
});

function startChildBot(roomCode) {
	const child = spawn('node', ['bot_join.js', roomCode]);
	child.stdout.on('data', (data) => {
	 	console.log(`${roomCode} -> ${data}`);
	});

	child.stderr.on('data', (data) => {
	 	console.error(`${roomCode} stderr:\n${data}`);
	});

	child.on('exit', function (code, signal) {
	 	console.log('child process exited with ' +
	              `code ${code} and signal ${signal}`);
	});	
};

process.on('uncaughtException', function() {
	process.exit();
});

process.on('SIGTERM', function() {
	process.exit();
});

app.listen(3000);