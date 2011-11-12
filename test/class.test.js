var Class = require('../lib/class');

/**
 * Tests creating a simple class with no name
 */
exports.Simple = function(test) {
	var Animal = Class.extend({
		doSomething : function() {
			return this.somethingElse() + ' done';
		},
		somethingElse : function() {
			return 'doing';
		}
	});

	var myanimal = new Animal();
	test.equals(myanimal.doSomething(), 'doing done', "Prototype method call should return this string");
	test.done();
};
/**
 * Tests creating a simple class with no name and static properties
 */
exports.SimpleStatic = function(test) {
	var Animal = Class.extend({
		counter : 1
	}, {
		init : function() {
			this.Class.counter++;
		},
		doSomething : function() {
			return this.somethingElse() + ' done';
		},
		somethingElse : function() {
			return 'doing';
		}
	});

	var myanimal = new Animal();
	test.equals(myanimal.doSomething(), 'doing done', "Prototype method call should return this string");
	myanimal = new Animal();
	test.equals(myanimal.Class.counter, 3, "Static variable counter");
	test.done();
};
/**
 * Tests the class constructor and setting of instance properties.
 */
exports.Constructor = function(test) {
	var Person = Class.extend({}, {
		init : function(age) {
			this._age = age;
		},
		doSomething : function() {
			return this._age;
		}
	});

	test.equals(new Person(23).doSomething(), 23, "Instance property should be set properly");
	test.done();
};
/**
 * Tests extending an existing class
 */
exports.Extend = function(test) {
	var Mammal = Class.extend({}, {
		doSomething : function() {
			return 'done';
		}
	});

	test.equals(new Mammal().doSomething(), 'done', "Prototype method call should return this string");

	var Dog = Mammal.extend({
		doSomething : function() {
			var oldresult = this._super();
			return 'bark ' + oldresult;
		}
	});
	test.equals(new Dog().doSomething(), 'bark done', "Extended class should return different string");

	test.done();
};
/**
 * Tests accessing static properties
 */
exports.Static = function(test) {
	var Static = Class.extend({
		staticProperty : 'test',
		staticMethod : function() {
			return 'static';
		}
	}, {
		doSomething : function() {
			return this.Class.staticProperty + ' ' + this.Class.staticMethod();
		}
	});

	test.equals(Static.staticProperty, 'test', "Static properties are always accessible");
	test.equals(new Static().doSomething(), 'test static', "Static properties should be available");

	test.done();
};
/**
 * Tests the setup() function and currying the return value to the constructor
 */
exports.Setup = function(test) {
	var Setup = Class.extend({
	}, {
		setup : function(arg) {
			// Arguments have to be returned as an array
			return ['wrapped(' + arg + ')'];
		},
		init : function(arg) {
			this._wrapped = arg;
		}
	});
	test.equals(new Setup('test')._wrapped, 'wrapped(test)', "setup() wraps arguments before calling init");

	test.done();
};
/**
 * Tests callback creation
 */
exports.Callback = function(test) {
	var Callbacker = Class.extend({
	}, {
		init : function() {
			this._property = 'local';
		},
		doSomething : function(arg) {
			var value = arg ? ' ' + arg : '';
			return this._property + value;
		}
	});
	var tester = new Callbacker();

	var callback = tester.callback('doSomething');
	test.equals(callback(), 'local', "Callback wrapped function should have access to object properties");
	test.equals(callback('test'), 'local test', "Callback wrapped function should have access to object properties");

	var callback = tester.callback('doSomething', 'firstArg');
	test.equals(callback(), 'local firstArg', "Curry callback arguments");
	
	test.throws(function() { tester.callback('notAMethod'); }, 'Callback creation from non existing methods should throw an error');

	test.done();
};
/**
 * Tests nesting of callback
 */
exports.CallbackNesting = function(test) {
	var Nester = Class.extend({
	}, {
		processor : function(arg) {
			return arg + ' processed';
		},
		doSomething : function(arg) {
			return arg + ' done';
		}
	});
	var tester = new Nester();
	var callback = tester.callback(['processor', 'doSomething']);
	test.equals(callback('first'), 'first processed done', "Calbacks can be chained and get their previous callbacks result");
	test.done();
};

