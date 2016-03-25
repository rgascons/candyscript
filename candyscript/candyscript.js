var parser = require("../parser/grammar").parser;
var interp = require("../interp/interp");

parser.yy = require("../interp/ast-tree");

function parse(input) {
    return parser.parse(input);
}

var ast = parse("write 4+3;"); // TODO: read from file
interp.init(ast);
interp.run();