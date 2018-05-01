var express = require('express');
var app = express();
const { spawn } = require('child_process');

app.get('/', function(req, res){
   res.send("Hello! go to 'url/room/4-digit-code' to make a bot join a room!") ;
});

app.get('/room/:id([a-zA-Z]{4})', function(req, res){
	res.send(`Attempting to start bot at ${req.params.id}`);
	
	const child = spawn('node', ['bot_join.js', req.params.id]);

	child.stdout.on('data', (data) => {
	  console.log(`child stdout:\n${data}`);
	});

	child.stderr.on('data', (data) => {
	  console.error(`child stderr:\n${data}`);
	});

	child.on('exit', function (code, signal) {
	  console.log('child process exited with ' +
	              `code ${code} and signal ${signal}`);
	});	
});

process.on('uncaughtException', function() {
	process.exit()
})  

process.on('SIGTERM', function() {
	process.exit()
})


app.listen(3000);


