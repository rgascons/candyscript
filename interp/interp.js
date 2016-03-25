module.exports = {
    init: function(ast) {
        this.ast = ast;
    },
    run: function() {
        console.log(evaluate(this.ast));
    }
};

function evaluate(ast) {
    var type = ast.type;

    switch (type) {
        case '+':
            return (evaluate(ast.getChild(0)) + evaluate(ast.getChild(1)));
        case '-':
            return (evaluate(ast.getChild(0)) - evaluate(ast.getChild(1)));
        case '*':
            return (evaluate(ast.getChild(0)) * evaluate(ast.getChild(1)));
        case '/':
            return (evaluate(ast.getChild(0)) / evaluate(ast.getChild(1)));
        case 'NUMBER':
            return Number(ast.getChild(0));
        default: return;
    }
}