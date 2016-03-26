var assert = require("assert");

function Stack() {
    this.stack = {};
}

Stack.prototype.setVar = function(id, value) {
    this.stack[id] = value;
};

Stack.prototype.getVar = function (id, value) {
    assert (this.stack[id] !== 'undefined', 'Variable undefined');
    return this.stack[id];
};

module.exports = Stack;