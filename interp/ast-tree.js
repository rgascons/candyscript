var scope = exports;

scope.AstNode = function (type, params) {
    this.type = type;
    this.children = {};
    for (var i = 0; i < params.length; ++i) this.children[i] = params[i]; 
    return this;
};

scope.AstNode.prototype.getChild = function(i) {
    return this.children[i];
};

scope.AstNode.prototype.getChildCount = function() {
    return this.children.length;
};

