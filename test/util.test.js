var util = require('../lib/util');

exports.merge = function (test) {
	var first = [1, 2];
	var second = [3, 4, 5];
	test.deepEqual(util.merge(first, second), [1, 2, 3, 4, 5], "Arrays should be concatenated");
	test.deepEqual(util.merge([1, 2], { 0 : 'test', 1 : 'test2'}), [ 1, 2, 'test', 'test2' ], "Object with numeric keys will be merged as arrays");
	test.done();
};

exports.isArray = function (test) {
    test.ok(util.isArray([]), "Plain array");
    test.equal(util.isArray(1), false, "Number is not an array");
    test.done();
};

exports.makeArray = function (test) {
	test.deepEqual(util.makeArray([1, 2]), [1, 2], "Array should stay the same");
	test.deepEqual(util.makeArray('test'), ['test'], "Should be turned into an array");
	test.deepEqual(util.makeArray(2), [2], "Should be turned into an array");
	test.done();
};

exports.isFunction = function (test) {
	test.ok(util.isFunction(function() {}), "Anonymus function should return true");
	test.equals(util.isFunction('noFunction'), false, "This should not be a function");
	test.done();
};

exports.isPlainObject = function (test) {
	test.ok(util.isPlainObject({ test : 1 }), "Initialized a plain object");
	test.equals(util.isPlainObject(new Array()), false, "Instantiated array object which is not a plain object");
	test.done();
};

exports.extend = function (test) {
	var obj1 = { test : 1, foo : 'bar' };
	test.deepEqual(util.extend(obj1, { test : 'tested' }), { test : 'tested', foo : 'bar' }, "Object should be extended properly");
	test.deepEqual(obj1, { test : 'tested', foo : 'bar' }, "Initial object should be modified");
	
	var obj2 = { test : 1 };
	test.deepEqual(util.extend(obj2, { foo : 'bar' }), { test : 1, foo : 'bar' }, "New properties are added");
	
	test.done();
};