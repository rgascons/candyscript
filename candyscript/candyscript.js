var fs = require('fs');
var parser = require("../parser/grammar").parser;
var interp = require("../interp/interp");

parser.yy = require("../interp/ast-tree");

function parse(input) {
    return parser.parse(input);
}

function readFromFile() {
    return fs.readFileSync(process.argv[2], 'utf8').toString();
}
var raw_program = readFromFile();
var ast = parse(raw_program);
interp.init(ast);
interp.run();