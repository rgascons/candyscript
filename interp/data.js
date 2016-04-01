
var Type = Object.freeze({
    NUMBER: "number",
    BOOLEAN: "boolean",
    STRING: "string"
});

function Data(value, type) {
    this.value = value;
    this.type = type;
}

Data.prototype.getValue = function () {
    return this.value;
};

Data.prototype.getType = function() {
    return this.type;
};

module.exports = {
    Data: Data,
    Type: Type
};