var Class = require('../lib/class');

/**
 * Tests creating a simple class
 */
exports.Simple = function (test) {
	Class.extend("Test.Animal", {}, {
		doSomething : function()
		{
			return this.somethingElse() + ' done';	
		},
		
		somethingElse : function()
		{
			return 'doing';
		}
	});
	
	var myanimal = new Test.Animal();
	test.equals(myanimal.doSomething(), 'doing done', "Prototype method call should return this string");
	test.equals(myanimal.Class.shortName, "Animal", "Testing introspection shortname");
	test.equals(myanimal.Class.fullName, "Test.Animal", "Testing introspection fullname");
	test.ok(myanimal.Class.namespace.Animal, "Testing introspection namespace");
	test.done();
};

/**
 * Tests the class constructor and setting of instance properties.
 */
exports.Constructor = function (test) {
	Class.extend("Test.Person", {}, {
		init : function(age)
		{
			this._age = age;
		},
		
		doSomething : function()
		{
			return this._age;	
		}
	});
	
	test.equals(new Test.Person(23).doSomething(), 23, "Instance property should be set properly");
	test.done();
};

/**
 * Tests extending an existing class
 */
exports.Extend = function (test) {
	Class.extend("Test.Mammal", {}, {
		doSomething : function()
		{
			return 'done';	
		}
	});
	
	test.equals(new Test.Mammal().doSomething(), 'done', "Prototype method call should return this string");
	
	Test.Mammal.extend("Test.Dog", {}, {
		doSomething : function()
		{
			var oldresult = this._super();
			return 'bark ' + oldresult;
		}
	});
	test.equals(new Test.Dog().doSomething(), 'bark done', "Extended class should return different string");
	
	test.done();
};

/**
 * Tests accessing static properties
 */
exports.Static = function (test) {
	Class.extend("Test.Static", {
		staticProperty : 'test',
		staticMethod : function()
		{
			return 'static';
		}
	}, {
		doSomething : function()
		{
			return this.Class.staticProperty + ' ' + this.Class.staticMethod();
		}
	});
	
	test.equals(Test.Static.staticProperty, 'test', "Static properties are always accessible");
	test.equals(new Test.Static().doSomething(), 'test static', "Static properties should be available");
	
	test.done();
};

/**
 * Tests the setup() function and currying the return value to the constructor 
 */
exports.Setup = function (test) {
	Class.extend("Test.Setup", {
	}, {
		setup : function(arg)
		{
			// Arguments have to be returned as an array
			return ['wrapped(' + arg + ')'];
		},
		
		init : function(arg)
		{
			this._wrapped = arg;
		}
	});
	test.equals(new Test.Setup('test')._wrapped, 'wrapped(test)', "setup() wraps arguments before calling init");
	
	test.done();
};

/**
 * Tests callback creation
 */
exports.Callback = function (test) {
	Class.extend("Test.Callback", {
	}, {
		init : function()
		{
			this._property = 'local';
		},
		
		doSomething : function(arg)
		{
			var value = arg ? ' ' + arg : '';
			return this._property + value;
		}
	});
	var tester = new Test.Callback();
	
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
exports.CallbackNesting = function (test) {
	Class.extend("Test.CallbackNested", {
	}, {
		processor : function(arg)
		{
			return arg + ' processed';
		},
		
		doSomething : function(arg)
		{
			return arg + ' done';
		}
	});
	var tester = new Test.CallbackNested();
	var callback = tester.callback(['processor', 'doSomething']);
	test.equals(callback('first'), 'first processed done', "Calbacks can be chained and get their previous callbacks result");
	test.done();
};

exports.ClassLoading = function (test) {
	require('./export_class');
	test.ok(ExportClass.Dummy, "Class should exist in global namespace");
	require('./export_class');
	test.equals(new ExportClass.Dummy().dummy(), 'Dummy', "Loaded class should be available");
	test.done();
};