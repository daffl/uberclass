var Class = require('../lib/class').Class;

Class.extend('Server.Response.Handler', {
	/* Static */
}, {
	init : function(content, headers)
	{
		this._headers = headers;
		this._content = content;
	},
	
	/* Prototype */
	writeHead : function(response)
	{
		response.writeHead(200, this._headers);
	},
	
	handle : function(request, response)
	{
		this.writeHead(response);
		response.end(this._content);
	}
});

var handler = new Server.Response.Handler('Hello World from ResponseHandler\n', { 'Content-Type': 'text/plain' });

var http = require('http');
http.createServer(handler.callback('handle')).listen(1337, "127.0.0.1");
