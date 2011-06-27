var merge = exports.merge = function(first, second)
{
	var i = first.length, j = 0;

	if (typeof second.length === "number")
	{
		for ( var l = second.length; j < l; j++)
		{
			first[i++] = second[j];
		}

	} else
	{
		while (second[j] !== undefined)
		{
			first[i++] = second[j++];
		}
	}

	first.length = i;

	return first;
};

var makeArray = exports.makeArray = function(array, results)
{
	var ret = results || [];

	if (array != null)
	{
		var type = typeof array;
		if (array.length == null || type === "string" || type === "function"
				|| type === "regexp")
		{
			ret.push(array);
		} else
		{
			merge(ret, array);
		}
	}

	return ret;
};

var isFunction = exports.isFunction = function(fn)
{
	return typeof fn === 'function';
};

var isArray = exports.isArray = function(arr)
{
	return Array.isArray(arr);
};

var concatArgs = exports.concatArgs = function(arr, args)
{
	return arr.concat(makeArray(args));
};

var isPlainObject = exports.isPlainObject = function(obj)
{
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor
	// property.
	// Make sure that DOM nodes and window objects don't pass through, as
	// well
	if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType
			|| obj.setInterval)
	{
		return false;
	}

	var has_own_constructor = hasOwnProperty.call(obj, "constructor");
	var has_is_property_of_method = hasOwnProperty.call(
			obj.constructor.prototype, "isPrototypeOf");
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
	{
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var last_key;
	for (key in obj)
	{
		last_key = key;
	}

	return typeof last_key === "undefined"
			|| hasOwnProperty.call(obj, last_key);
};

var extend = exports.extend = function()
{
	// copy reference to target object
	var target = arguments[0] ||
	{}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if (typeof target === "boolean")
	{
		deep = target;
		target = arguments[1] ||
		{};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !typeof target === 'function')
	{
		target =
		{};
	}

	for (; i < length; i++)
	{
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null)
		{
			// Extend the base object
			for (name in options)
			{
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy)
				{
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if (deep && copy && (isPlainObject(copy) || isArray(copy)))
				{
					var clone = src && (isPlainObject(src) || isArray(src)) ? src
							: isArray(copy) ? [] :
							{};

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (typeof copy !== "undefined")
				{
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

var getObject = exports.getObject = function(objectName, roots, add)
{
	var isContainer = function(current)
	{
		var type = typeof current;
		return type && (type == 'function' || type == 'object');
	}, regs =
	{
		undHash : /_|-/,
		colons : /::/,
		words : /([A-Z]+)([A-Z][a-z])/g,
		lowUp : /([a-z\d])([A-Z])/g,
		dash : /([a-z\d])([A-Z])/g,
		replacer : /\{([^\}]+)\}/g,
		dot : /\./
	}, getNext = function(current, nextPart, add){
		return current[nextPart] || ( add && (current[nextPart] = {}) );
	};

	var parts = objectName ? objectName.split(regs.dot) : [], length = parts.length, currents = isArray(roots) ? roots
			: [ roots || globals ], current, ret, i, c = 0, type;

	if (length == 0)
	{
		return currents[0];
	}
	while (current = currents[c++])
	{
		for (i = 0; i < length - 1 && isContainer(current); i++)
		{
			current = getNext(current, parts[i], add);
		}
		if (isContainer(current))
		{

			ret = getNext(current, parts[i], add);

			if (ret !== undefined)
			{

				if (add === false)
				{
					delete current[parts[i]];
				}
				return ret;

			}
		}
	}
};