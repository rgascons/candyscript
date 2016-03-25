var scope = exports;

scope.AstNode = function (type, params) {
    this.type = type;
    this.children = params;
    return this;
};

scope.AstNode.prototype.getChild = function(i) {
    return this.children[i];
};