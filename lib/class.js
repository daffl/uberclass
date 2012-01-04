// See https://github.com/jupiterjs/jquerymx/blob/master/class/class.js
// if we are initializing a new class
var util = require('./util'),
initializing = false, makeArray = util.makeArray, isFunction = util.isFunction, isArray = util.isArray, extend = util.extend,
concatArgs = function(arr, args)
{
	return arr.concat(makeArray(args));
},
// tests if we can get super in .toString()
fnTest = /xyz/.test(function()
{
	xyz;
}) ? /\b_super\b/ : /.*/,

// overwrites an object with methods, sets up _super
inheritProps = function(newProps, oldProps, addTo)
{
	addTo = addTo || newProps;
	for ( var name in newProps)
	{
		// Check if we're overwriting an existing function
		addTo[name] = isFunction(newProps[name]) && isFunction(oldProps[name])
				&& fnTest.test(newProps[name]) ? (function(name, fn)
		{
			return function()
			{
				var tmp = this._super, ret;

				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = oldProps[name];

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				ret = fn.apply(this, arguments);
				this._super = tmp;
				return ret;
			};
		})(name, newProps[name]) : newProps[name];
	}
};

var clss = exports.Class = function()
{
	if (arguments.length)
	{
		clss.extend.apply(clss, arguments);
	}
};

extend(
	clss,
	{
		callback : function(funcs)
		{
			// args that should be curried
			var args = makeArray(arguments), self;
	
			funcs = args.shift();
	
			if (!isArray(funcs))
			{
				funcs = [ funcs ];
			}
	
			self = this;
			for ( var i = 0; i < funcs.length; i++)
			{
				if (typeof funcs[i] == "string"
						&& !isFunction(this[funcs[i]]))
				{
					throw ("class.js "
							+ (this.fullName || this.Class.fullName)
							+ " does not have a " + funcs[i] + "method!");
				}
			}
			return function class_cb()
			{
				var cur = concatArgs(args, arguments), isString, length = funcs.length, f = 0, func;
				for (; f < length; f++)
				{
					func = funcs[f];
					if (!func)
					{
						continue;
					}
	
					isString = typeof func == "string";
					if (isString && self._set_called)
					{
						self.called = func;
					}

					cur = (isString ? self[func] : func).apply(self, cur
							|| []);
					if (f < length - 1)
					{
						cur = !isArray(cur) || cur._use_call ? [ cur ]
								: cur;
					}
				}
				return cur;
			};
		},
	
		newInstance: function() {
			var inst = this.rawInstance(),
				args;
			if ( inst.setup ) {
				args = inst.setup.apply(inst, arguments);
			}
			if ( inst.init ) {
				inst.init.apply(inst, isArray(args) ? args : arguments);
			}
			return inst;
		},
	
		setup: function( baseClass, fullName ) {
			this.defaults = extend(true, {}, baseClass.defaults, this.defaults);
			return arguments;
		},
		
		rawInstance: function() {
			initializing = true;
			var inst = new this();
			initializing = false;
			return inst;
		},
		
		extend: function(klass, proto) {
			if(!proto) {
				proto = klass;
				klass = null;
			}
			proto = proto || {};
			var _super_class = this,
				_super = this.prototype, prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			prototype = new this();
			initializing = false;
			// Copy the properties over onto the new prototype
			inheritProps(proto, _super, prototype);

			// The dummy class constructor

			function Class() {
				// All construction is actually done in the init method
				if ( initializing ) return;

				if ( this.constructor !== Class && arguments.length ) { //we are being called w/o new
					return arguments.callee.extend.apply(arguments.callee, arguments);
				} else { //we are being called w/ new
					return this.Class.newInstance.apply(this.Class, arguments);
				}
			}
			// Copy old stuff onto class
			for ( name in this ) {
				if ( this.hasOwnProperty(name) && ['prototype', 'defaults'].indexOf(name) == -1 ) {
					Class[name] = this[name];
				}
			}

			// do static inheritance
			inheritProps(klass, this, Class);

			// set things that can't be overwritten
			extend(Class, {
				prototype: prototype,
				constructor: Class
			});

			//make sure our prototype looks nice
			Class.prototype.Class = Class.prototype.constructor = Class;

			var args = Class.setup.apply(Class, concatArgs([_super_class],arguments));

			if ( Class.init ) {
				Class.init.apply(Class, args || []);
			}

			/* @Prototype*/
			return Class;
		}
	});

clss.prototype.callback = clss.prototype.proxy = clss.callback;

exports.extend = function()
{
	return clss.extend.apply(clss, arguments);
};
