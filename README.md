[README 4.md](https://github.com/user-attachments/files/28252162/README.4.md)
# Panda Monkey

A tiny JavaScript utility that extends built-in types with trimming helpers.

## What It Does

Panda Monkey patches two built-in JavaScript prototypes to add `trim()` methods:

- **String** — removes leading and trailing whitespace from a string.
- **Array** — trims the second element (index `1`) if it exists and is a string.

## Code

```js
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

Array.prototype.trim = function() {
    return this[1] ? this[1].replace(/^\s+|\s+$/g, '') : '';
};
```

## Usage

```js
"  hello world  ".trim();
// => "hello world"

["a", "  b  ", "c"].trim();
// => "b"
```

## What Are Built-In Prototypes?

In JavaScript, every object has a **prototype** — a hidden object it inherits properties and methods from. When you write `"hello".toUpperCase()`, you're calling a method that lives on `String.prototype`.

**Built-in prototypes** are the prototypes that ship with the language:

| Type | Prototype | Example methods |
|------|-----------|-----------------|
| String | `String.prototype` | `.toUpperCase()`, `.slice()`, `.replace()` |
| Array | `Array.prototype` | `.push()`, `.map()`, `.filter()` |
| Number | `Number.prototype` | `.toFixed()`, `.toString()` |
| Object | `Object.prototype` | `.toString()`, `.hasOwnProperty()` |

Panda Monkey adds `.trim()` directly onto `String.prototype` and `Array.prototype`, so it becomes available on every string and array in your program.

## ⚠️ Note

Modifying built-in prototypes is generally discouraged in production code because it can cause conflicts with other libraries and break future JavaScript features. Panda Monkey is a minimal demonstration.

## License

MIT
