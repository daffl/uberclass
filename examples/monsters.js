var Class = require('../lib/class').Class;

var Monster = Class.extend(
// Static properties
{
	count : 0
},
// Prototype properties
{
	init : function(name)
	{

		// saves name on the monster instance
		this.name = name;

		// sets the health
		this.health = 10;

		// increments count
		this.Class.count++;
	},
	eat : function(smallChildren)
	{
		this.health += smallChildren;
	},
	fight : function()
	{
		this.health -= 2;
	}
});

var hydra = new Monster('hydra');
var dragon = new Monster('dragon');

console.log("Monster name: " + hydra.name); // -> hydra
console.log("Total monsters: " + Monster.count); // -> 2

hydra.eat(2);
console.log("Hydra health: " + hydra.health); // -> 12

dragon.fight();
console.log("Dragon health: " + dragon.health); // -> 8

var SeaMonster = Monster.extend({
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
