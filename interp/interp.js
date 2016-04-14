var Stack = require('./stack');
var assert = require('assert');
var Data = require('./data');

var stack;

module.exports = {
    load: function(root) {
        this.root = root;
        stack = stack === undefined? new Stack() : stack;
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
                if (ast.getChild(2).type === 'IF-ELSE' || ast.getChild(2).type === 'IF') {
                    execute_block(ast.getChild(2));
                }else {
                    run_statements(ast.getChild(2));
                }
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
    if (checkIntegers(VAL, 1)) {stack.setVar(ID, VAL, Data.Type.NUMBER);}
    else if (checkString(VAL, " ")) {stack.setVar(ID, VAL, Data.Type.STRING);}
    else stack.setVar(ID, VAL, Data.Type.BOOLEAN);
}

function write(ast) {
    var val = ast.getChild(0);
    if (typeof val === 'string') {
        console.log(val);
    } else console.log(evaluate(ast.getChild(0)));
}

function checkIntegers(v1, v2) {
    return typeof v1 === 'number' && typeof v2 === 'number';
}

function checkString(v1, v2) {
    return typeof v1 === 'string' && typeof v2 === 'string';
}

function replaceAll(string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
}

function evaluate(ast) {
    var type = ast.type;
    var v1, v2;
    switch (type) {
        case 'PLUS':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            if (!checkIntegers(v1, v2) && !checkString(v1, v2)) {throw "Incompatible types"}
            return evaluate(ast.getChild(0)) + evaluate(ast.getChild(1));
        case 'MINUS':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            checkIntegers(v1, v2);
            return evaluate(v1) - evaluate(ast.getChild(1));
        case 'MUL':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            checkIntegers(v1, v2);
            return evaluate(ast.getChild(0)) * evaluate(ast.getChild(1));
        case 'DIV':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            checkIntegers(v1, v2);
            return evaluate(ast.getChild(0)) / evaluate(ast.getChild(1));
        case 'MOD':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            checkIntegers(v1, v2);
            return evaluate(ast.getChild(0)) % evaluate(ast.getChild(1));
        case 'POW':
            v1 = evaluate(ast.getChild(0));
            v2 = evaluate(ast.getChild(1));
            checkIntegers(v1, v2);
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
            v1 = evaluate(ast.getChild(0));
            checkIntegers(v1, 1);
            return - evaluate(ast.getChild(0));
        case 'NUMBER':
            return Number(ast.getChild(0));
        case 'STRING':
            return String(ast.getChild(0));
        case 'TRUE':
            return Boolean(true);
        case 'FALSE':
            return Boolean(false);
        case 'ID':
            var Var = stack.getVar(ast.getChild(0));
            if (Var.getType() === Data.Type.STRING) {
                return replaceAll(Var.getValue(), '"', '');
            } return Var.getValue();
        default: return;
    }
}