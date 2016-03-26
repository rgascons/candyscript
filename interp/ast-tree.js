var scope = exports;
var instruction_list = [];

scope.addInstruction = function(ast) {
    instruction_list.push(ast);
    return instruction_list;
};


scope.AstNode = function (type, params) {
    this.type = type;
    this.children = params;
    return this;
};

scope.AstNode.prototype.getChild = function(i) {
    return this.children[i];
};

scope.AstNode.prototype.getChildCount = function() {
    return this.children.length;
};

scope.AstNode.prototype.addChild = function(ast) {
    this.children.push(ast);
};
