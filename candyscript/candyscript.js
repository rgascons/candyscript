var parser = require("../parser/grammar").parser;
var interp = require("../interp/interp");

parser.yy = require("../interp/AstTree");

function parse(input) {
    return parser.parse(input);
}

var ast = parse("4/2+2"); // TODO: read from file
interp.init(ast);
interp.run();