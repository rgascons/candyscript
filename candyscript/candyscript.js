var fs = require('fs');
var argv = require('optimist').argv;
var readline = require('readline');
var parser = require("../parser/grammar").parser;
var interp = require("../interp/interp");

parser.yy = require("../interp/ast-tree");

function parse(input) {
    return parser.parse(input);
}

function readFromFile(directory) {
    return fs.readFileSync(directory, 'utf8').toString();
}

function parseArgs() {
    // Read program from file
    if(argv.file !== undefined) {
        var raw_program = readFromFile(argv.file);
        var ast = parse(raw_program);
        interp.load(ast);
        interp.run();
    }
    // No arguments, switch to shell mode
    else {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        process.stdout.write(">>> ");
        rl.on('line', function(line){
            var instr = parse(line);
            interp.load(instr);
            interp.run();
            process.stdout.write(">>> ");
        })
    }
}

parseArgs();