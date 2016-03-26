/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"*"                                         return 'MUL'
"/"                                         return 'DIV'
"-"                                         return 'MINUS'
"+"                                         return 'PLUS'
"="                                         return 'EQUAL'
"write"                                     return 'WRITE'
";"                                         return ';'
[0-9]+("."[0-9]+)?\b                        return 'NUMBER'
([a-z]|[A-Z]|_)([a-z]|[A-Z]|_|[0-9])*       return 'ID'
<<EOF>>                                     return 'EOF'
.                                           return 'INVALID'

/lex

/* operator associations and precedence */

%left 'PLUS' 'MINUS'
%left 'MUL' 'DIV'

%start prog

%% /* language grammar */

prog
    : block_instructions EOF
        { return $1; } /* to print the tree: typeof console !== 'undefined' ? console.log($1) : print($1); */
    ;

block_instructions
    : instruction ';' block_instructions
        { $$ = yy.addInstruction($1); }
    |
    ;

instruction
    : assign
    | write
    ;

assign
    : 'ID' 'EQUAL' e
        {$$ = new yy.AstNode(':=', [$1, $3]);}
    ;

write
    : 'WRITE' e
        {$$ = new yy.AstNode('WRITE', [$2]);}

/*expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; } /* prints the tree when the parsing is finished */
    ;*/

e
    : e 'PLUS' e
        {$$ = new yy.AstNode('PLUS', [$1, $3]);}
    | e 'MINUS' e
        {$$ = new yy.AstNode('MINUS', [$1, $3]);}
    | e 'MUL' e
        {$$ = new yy.AstNode('MUL', [$1, $3]);}
    | e 'DIV' e
        {$$ = new yy.AstNode('DIV', [$1, $3]);}
    | 'NUMBER'
        {$$ = new yy.AstNode('NUMBER', [$1]);}
    | 'ID'
        {$$ = new yy.AstNode('ID', [$1]);}
    ;

