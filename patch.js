String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); }; Array.prototype.trim = function() { return this[1] ? this[1].replace(/^\s+|\s+$/g, '') : ''; };
