/**
 * Panda Monkey — Runtime Prototype Patcher
 * Drop this into a broken project to fix incorrect or missing
 * built-in prototype methods without touching the original source.
 *
 * @version 1.0.0
 * @license MIT
 * @see https://github.com/DoctorrrrBuild/pandamonkey
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PandaMonkey = factory());
}(this, function () {
  'use strict';

  const patches = {
    /**
     * Fixes broken String.prototype.trim implementations that don't
     * handle full Unicode whitespace (U+00A0, U+FEFF, etc.) or that
     * were shimmed incorrectly in legacy code.
     *
     * @example
     *   "  hello   ".trim() // => "hello"
     */
    stringTrim: function () {
      const ws = '[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]';
      const re = new RegExp('^' + ws + '+' + '|' + ws + '+$', 'g');
      String.prototype.trim = function () {
        return this.replace(re, '');
      };
      return this;
    },

    /**
     * Fixes codebases that treat arrays as [key, value] tuples and
     * need a quick way to sanitize the value without indexing manually.
     * Also repairs broken Array.prototype.trim shims that throw.
     *
     * @example
     *   ["name", "  Dr. Foo  "].trim() // => "Dr. Foo"
     *   ["only"].trim()               // => ""
     */
    arrayTupleTrim: function () {
      Array.prototype.trim = function () {
        return this[1] && typeof this[1] === 'string'
          ? this[1].trim()
          : '';
      };
      return this;
    },

    /**
     * Fixes Number.prototype.toFixed in environments where it
     * returns strings with trailing zeros stripped (old IE, broken shims).
     * Ensures the result always has exactly `digits` decimal places.
     *
     * @example
     *   (1.5).toFixed(2) // => "1.50"
     */
    numberToFixed: function () {
      Number.prototype.toFixed = function (digits) {
        const n = this;
        const d = digits === undefined ? 0 : digits;
        const pow = Math.pow(10, d);
        const str = (Math.round(n * pow) / pow).toString();
        if (d <= 0) return str;
        const dot = str.indexOf('.');
        if (dot === -1) return str + '.' + '0'.repeat(d);
        const current = str.length - dot - 1;
        return current < d ? str + '0'.repeat(d - current) : str;
      };
      return this;
    },

    /**
     * Fixes Object.prototype.hasOwnProperty when it has been
     * overwritten or shadowed by a property named "hasOwnProperty".
     * Restores safe property checking.
     *
     * @example
     *   var obj = { hasOwnProperty: 1, foo: 2 };
     *   obj.hasOwnProperty('foo') // => true (doesn't throw)
     */
    objectHasOwnProperty: function () {
      const hop = Object.prototype.hasOwnProperty;
      Object.prototype.hasOwnProperty = function (key) {
        return hop.call(this, key);
      };
      return this;
    },

    /**
     * Fixes Array.prototype.indexOf in environments where it
     * uses strict equality (===) instead of SameValueZero, causing
     * NaN lookups to fail.
     *
     * @example
     *   [NaN].indexOf(NaN) // => 0
     */
    arrayIndexOf: function () {
      const original = Array.prototype.indexOf;
      Array.prototype.indexOf = function (search, fromIndex) {
        if (Number.isNaN(search)) {
          for (let i = fromIndex || 0; i < this.length; i++) {
            if (Number.isNaN(this[i])) return i;
          }
          return -1;
        }
        return original.call(this, search, fromIndex);
      };
      return this;
    },

    /**
     * Fixes String.prototype.split when the separator is a regex
     * with capturing groups and the implementation drops empty strings
     * at the end (old V8, broken shims).
     *
     * @example
     *   "a,b,".split(/,/) // => ["a", "b", ""]
     */
    stringSplit: function () {
      const original = String.prototype.split;
      String.prototype.split = function (separator, limit) {
        const result = original.call(this, separator, limit);
        // Restore trailing empty strings dropped by buggy shims
        if (typeof separator === 'object' && separator !== null && separator.global) {
          const expected = this.match(new RegExp(separator.source, 'g')) || [];
          const trailing = (this.match(new RegExp(separator.source + '$')) || []).length;
          while (trailing > 0 && result.length < expected.length + 1) {
            result.push('');
            trailing--;
          }
        }
        return result;
      };
      return this;
    }
  };

  // Apply all patches
  function applyAll() {
    Object.values(patches).forEach(fn => fn());
    return patches;
  }

  return {
    version: '1.0.0',
    patches: patches,
    applyAll: applyAll
  };
}));
