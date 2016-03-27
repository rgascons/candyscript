var _ = require('lodash');
var Stack = require('./stack');
var assert = require('assert');
var Data = require('./data');

var stack;

module.exports = {
    init: function(root) {
        this.root = root;
        stack = new Stack();
    },
    run: function() {
        run_statements(this.root);
    }
};

function run_statements(ast) {
    if (ast.type !== 'no-op') {
        run_statements(ast.getChild(0));
        execute_stmt(ast);
    }
}

function execute_stmt(ast) {
    var type = ast.type;
    
    switch (type) {
        case 'STMT-LINE':
            execute_line(ast.getChild(1));
            break;
        case 'STMT-BLCK':
            execute_block(ast.getChild(1));
            break;
    }
}

function execute_line(ast) {
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

function execute_block(ast) {
    var type = ast.type;
    var condition;
    
    switch (type) {
        case 'IF':
            condition = evaluate(ast.getChild(0));
            if (condition) {
                run_statements(ast.getChild(1));
            }
            break;
        case 'IF-ELSE':
            condition = evaluate(ast.getChild(0));
            if (condition) {
                run_statements(ast.getChild(1));
            } else {
                run_statements(ast.getChild(2));
            }
            break;
        case 'WHILE':
            condition = evaluate(ast.getChild(0));
            while (condition) {
                run_statements(ast.getChild(1));
                condition = evaluate(ast.getChild(0));
            }
            break;
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
        case 'MOD':
            return evaluate(ast.getChild(0)) % evaluate(ast.getChild(1));
        case 'POW':
            return Math.pow(evaluate(ast.getChild(0)), evaluate(ast.getChild(1)));
        case '>':
            return evaluate(ast.getChild(0)) > evaluate(ast.getChild(1));
        case '<':
            return evaluate(ast.getChild(0)) < evaluate(ast.getChild(1));
        case '>=':
            return evaluate(ast.getChild(0)) >= evaluate(ast.getChild(1));
        case '<=':
            return evaluate(ast.getChild(0)) <= evaluate(ast.getChild(1));
        case '==':
            return evaluate(ast.getChild(0)) === evaluate(ast.getChild(1));
        case '!=':
            return evaluate(ast.getChild(0)) !== evaluate(ast.getChild(1));
        case 'UMINUS':
            return - evaluate(ast.getChild(0));
        case 'NUMBER':
            return Number(ast.getChild(0));
        case 'TRUE':
            return true;
        case 'FALSE':
            return false;
        case 'ID':
            var Var = stack.getVar(ast.getChild(0));
            assert(Var.getType() === Data.Type.NUMBER);
            return Var.getValue();
        default: return;
    }
}