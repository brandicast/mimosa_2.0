
var net = require('net');
var fs = require ('fs') ;

var client = new net.Socket();
client.connect(9613, '127.0.0.1', function() {
	console.log('Connected');
	
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

var data = fs.readFileSync('20210923.log', 'utf8');
var data_per_line = data.split ("\n");

var counter = 0;
function sendLog () {
	if (counter ==data_per_line.length)
		counter = 0 ;
	client.write(data_per_line[counter]);
	counter ++ ;
	console.log ('Sending :' + data_per_line[counter]) ;
	
};

setInterval(sendLog, 5000);