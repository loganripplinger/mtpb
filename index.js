var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});





// const { spawn } = require('child_process');

// function randRoom() {
//   var text = "";
//   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//   for (var i = 0; i < 5; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   return text;
// }

// for (i=1;i<=5;i++) {
// 	const child = spawn('node', ['bot_join.js', randRoom()]);

// 	child.stdout.on('data', (data) => {
// 	  console.log(`child stdout:\n${data}`);
// 	});

// 	child.stderr.on('data', (data) => {
// 	  console.error(`child stderr:\n${data}`);
// 	});

// 	child.on('exit', function (code, signal) {
// 	  console.log('child process exited with ' +
// 	              `code ${code} and signal ${signal}`);
// 	});	
// }



app.listen(3000);