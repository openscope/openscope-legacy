
// # getValue
// Gets a value from an object with the option to have a default
// value. If no default value or key is present, `null` is returned.
// In the future, this should accept dot-notation and possibly array
// index notation, like so:
//
// ```js
// get_value(options, 'foo.bar.baz[3]', 42);
// ```

function getValue(object, key, default_value) {
  
  if(key in object) {
    return object[key];
  }

  // When `default_value` is not present, return `null` instead of `undefined`.
  if(arguments.length === 2) return null;

  if(default_value instanceof Error) throw default_value;
  
  return default_value;
}

// # withScope
// Effectively calls `func` with `scope`. Mostly to be used inline
// with callbacks, to make things cleaner.

function withScope(scope, func) {
  return function() {
    func.apply(scope, arguments);
  };
}

exports.getValue = getValue;
exports.withScope = withScope;
