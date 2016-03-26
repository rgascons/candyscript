var assert = require("assert");
var Data = require("./data");

function Stack() {
    this.stack = {};
}

Stack.prototype.setVar = function(id, value, type) {
    this.stack[id] = new Data.Data(value, type);
};

Stack.prototype.getVar = function (id) {
    assert (this.stack[id] !== 'undefined', 'Variable undefined');
    return this.stack[id];
};

module.exports = Stack;