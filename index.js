var express = require('express');
var app = express();
var path = require('path');
const { spawn } = require('child_process');


// Routes
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/website/welcome.html'));
});

app.get('/room/:id([a-zA-Z]{4})', function(req, res){
	var roomCode = req.params.id;
	res.send(`Attempting to start bot to join room ${roomCode}`);
	
	startChildBot(roomCode);
});

// Functions
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