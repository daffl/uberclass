var Class = require('../lib/class');

var Server = Class.extend({
	/* Prototype */
	init : function(port, listen)
	{
		  this._port = port || 1337;
		  this._listen = listen || '127.0.0.1';
	},
	
	start : function()
	{
		var http = require('http');
		http.createServer(this.proxy('handle')).listen(this._port, this._listen);
		console.log("Server running at " + this._listen + ":" + this._port);
	},
	
	writeHead : function(response)
	{
		response.writeHead(200, {'Content-Type': 'text/plain'});
	},
	
	handle : function(request, response)
	{
		this.writeHead(response);
		response.write('Simple server running on ' + this._listen + ':' + this._port + ', saying:\n');
		response.end('Hello World\n');
	}
});

new Server().start();