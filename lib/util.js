/**
 * Merge two arrays. Also merges objects with continous numeric
 * keys.
 * @see http://api.jquery.com/jQuery.merge/
 * @see https://github.com/jquery/jquery/blob/master/src/core.js
 * @param first The first array
 * @param second The second array or an object with numeric keys
 * @returns The merged array
 */
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

/**
 * Turns any object in an array.
 * @see http://api.jquery.com/jQuery.makeArray/
 * @see https://github.com/jquery/jquery/blob/master/src/core.js
 * @param array The object to turn into an array
 * @param results The optional result array
 * @returns A new array or results
 */
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

/**
 * Check if a given argument is a function.
 * @param fn The object to check
 * @returns If the object is a function or not
 */
var isFunction = exports.isFunction = function(fn)
{
	return typeof fn === 'function';
};

/**
 * Check if a given argument is an Array.
 * @param arr The object to check
 * @returns If the object is an array or not
 */
var isArray = exports.isArray = function(arr)
{
	return Array.isArray(arr);
};

/**
 * Concatenate two arguments
 * @param arr The first array (will be turned into an array if it isn't)
 * @param args The second array (will be turned into an array if it isn't)
 * @returns The concatenated array
 */
var concatArgs = exports.concatArgs = function(arr, args)
{
	return makeArray(arr).concat(makeArray(args));
};

/**
 * Check if the given object is a plain object (e.g. initalized using {})
 * @see https://github.com/jquery/jquery/blob/master/src/core.js
 * @param obj The object to check
 * @returns Whether it is a plain object or not
 */
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

/**
 * @see https://gist.github.com/825253
 * @returns
 */
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
