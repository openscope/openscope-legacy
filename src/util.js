
function time() {
  return Date.now() * 0.001;
}

// # lerp
//
// Interpolates `i` from range `il..ih` to `ol..oh`.
//
// ```js
// lerp(0, 50, 100, -50, 50); // returns 0
// ```

function lerp(il, i, ih, ol, oh) {
  return ((i - il) / (ih - il)) * (oh - ol) + ol;
}

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

exports.time = time;
exports.lerp = lerp;
exports.getValue = getValue;
exports.withScope = withScope;
