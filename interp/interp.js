var _ = require('lodash');
var Stack = require('./stack');
var assert = require('assert');
var Data = require('./data');

var list_instr,
    stack;

module.exports = {
    init: function(root) {
        list_instr = root;
        stack = new Stack();
    },
    run: function() {
        run_instructions(list_instr);
    }
};

function run_instructions(list_instr) {
    _(list_instr).forEachRight(function(instr) {
        execute(instr);
    });
}

function execute(ast) {
    var type = ast.type;

    switch (type) {
        case ':=':
            assign(ast.getChild(0), ast.getChild(1));
            break;
        case 'WRITE':
            write(ast);
            break;
        default: break;
    }
}

function assign(id, value) {
    var ID = id;
    var VAL = evaluate(value);
    stack.setVar(ID, VAL, Data.Type.NUMBER);
}

function write(ast) {
    var val = ast.getChild(0);
    if (typeof val === 'string') {
        console.log(val);
    } else console.log(evaluate(ast.getChild(0)));
}

function evaluate(ast) {
    var type = ast.type;

    switch (type) {
        case 'PLUS':
            return evaluate(ast.getChild(0)) + evaluate(ast.getChild(1));
        case 'MINUS':
            return evaluate(ast.getChild(0)) - evaluate(ast.getChild(1));
        case 'MUL':
            return evaluate(ast.getChild(0)) * evaluate(ast.getChild(1));
        case 'DIV':
            return evaluate(ast.getChild(0)) / evaluate(ast.getChild(1));
        case 'NUMBER':
            return Number(ast.getChild(0));
        case 'ID':
            var Var = stack.getVar(ast.getChild(0));
            assert(Var.getType() === Data.Type.NUMBER);
            return Var.getValue();
        default: return;
    }
}