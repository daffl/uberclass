JS.Class
========

JS.Class is a class framework based on [JavaScriptMVC $.Class](http://javascriptmvc.com/docs.html#&who=jQuery.Class)
and [John Resig's Simple JavaScript inheritance](http://ejohn.org/blog/simple-javascript-inheritance/).

It encourages a hybrid (as made popular by e.g. Scala) approach between functional and object oriented programming.

Features:

- Prototypal inheritance
- Static inheritance
- Setup and initialization methods
- Callback creation

 
 Creating a Class
 ----------------
 
 The following creates a Monster class, static, and prototype members.
 The prototype init is called as the constructor. Every time a monster instance is created, the static count is incremented:
 
 
	var Class = require('class').Class;
	
	var Monster = Class.extend(
	/* @static */
	{
	  count: 0
	},
	/* @prototype */
	{
	  init: function( name ) {
	
	    // saves name on the monster instance
	    this.name = name;
	
	    // sets the health
	    this.health = 10;
	
	    // increments count
	    this.Class.count++;
	  },
	  eat: function( smallChildren ){
	    this.health += smallChildren;
	  },
	  fight: function() {
	    this.health -= 2;
	  }
	});
	
	hydra = new Monster('hydra');
	dragon = new Monster('dragon');
	
	console.log(hydra.name)		// -> hydra
	console.log(Monster.count)	// -> 2
	
	hydra.eat(2);
	console.log(hydra.health);	// health = 12
	
	dragon.fight();    
	console.log(dagon.health);	// health = 8
	
	
 Inheritance
 -----------
 
 When a class is extended, all static and prototype properties are available on the new class.
 If you overwrite a function, you can call the base class's function by calling this._super.
 Lets create a SeaMonster class. SeaMonsters are less efficient at eating small children, but more powerful fighters.
 
 
	var SeaMonster = Monster.extend(
	{
		eat : function(smallChildren)
		{
			this._super(smallChildren / 2);
		},
		fight : function()
		{
			this.health -= 1;
		}
	});
	
	var lochNess = new SeaMonster('Loch Ness');
	
	lochNess.eat(4);
	console.log("Loch Ness ate. Health: " + lochNess.health); // -> 12
	
	lochNess.fight();
	console.log("Loch Ness fought. Health: " + lochNess.health); // -> 11
	
	
 Callbacks
 ---------
 
Class provides a callback function that returns a callback to a method that will always have this set to the class or instance of the class.
The following example creates a ResponseHandler class that takes the reponse text and the responses header options as constructor arguments
and provides it's handle method as callback to the http.createServer function:
 
 
	var ResponseHandler = Class.extend({
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
	
	var handler = new ResponseHandler('Hello World from ResponseHandler\n', { 'Content-Type': 'text/plain' });
	
	var http = require('http');
	http.createServer(handler.callback('handle')).listen(1337, "127.0.0.1");


Exporting
---------

To export your classes from your module just add the created class to the exports object:


	// monsters.js
	var Class = require('class').Class;
	exports.Monster = Class.extend({ /* Static */ },{ /* Prototype */ });
	
	// othermodule.js
	var Monsters = require('monsters');
	var hydra = new Monsters.Monster();

