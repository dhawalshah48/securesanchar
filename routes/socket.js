const express = require('express');
var session = require('express-session');
const app = express();
const crypto = require('crypto');
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
app.use(express.static(__dirname));
app.use(session({secret:'S3CVR3S^N(H^R'}));
const fs = require('fs');
var port = parseInt(process.env.PORT, 10) || 8000;
var keys = require('./keygen.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(port);

var us1 = null;
var us2 = null;

io.on('connection', function(socket)
{
	console.log("A user Connected");
	socket.on('disconnect', function(socket)
	{
		console.log("A user disconnected");
	});
	
	socket.on('messageFromClient', function(data)
	{
		io.emit('messageViaServer', {encMessage: data.encMessage});
		console.log(data.encMessage);
	});
});

var path = require("path");


app.get('/', async (req, res, next) => {
	//console.log(req.method);
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });

});

//---------------------   GET Messsage To THE USER ----------------------//

app.get('/getMessage', function(req,res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("Mera Naam hai server!");
	
});


//----------------------- GET PUBLIC KEY OF USER ----------------------------

app.post('/fromClientPublicKey', function(req, res)
{
	if(us1==null) 
	{
		us1 = req.body.pkey;
		io.emit('youAreTheOne', {});
	}
	else 
	{
		us2 = req.body.pkey;
		io.emit('publicKeysLeLo', {keys: [us1, us2]});
		console.log([us1, us2]);
	}
});