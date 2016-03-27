/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"*"                                         return 'MUL'
"/"                                         return 'DIV'
"-"                                         return 'MINUS'
"+"                                         return 'PLUS'
">"                                         return '>'
"<"                                         return '<'
">="                                        return '>='
"<="                                        return '<='
"!="                                        return '!='
"=="                                        return '=='
"="                                         return 'EQUAL'
";"                                         return ';'
"{"                                         return '{'
"}"                                         return '}'
"("                                         return '('
")"                                         return ')'
"true"                                      return 'TRUE'
"false"                                     return 'FALSE'
"if"                                        return 'IF'
"else"                                      return 'ELSE'
"while"                                     return 'WHILE'
"write"                                     return 'WRITE'
[0-9]+("."[0-9]+)?\b                        return 'NUMBER'
([a-z]|[A-Z]|_)([a-z]|[A-Z]|_|[0-9])*       return 'ID'
\"(\\.|[^"])*\"                             return 'STRING'
<<EOF>>                                     return 'EOF'
.                                           return 'INVALID'

/lex

/* operator associations and precedence */

%left 'PLUS' 'MINUS'
%left 'MUL' 'DIV'
%left '>' '<' '>=' '<=' '!=' '=='

%start prog

%% /* language grammar */

prog
    : statement EOF
        { return $1; } /* to print the tree: typeof console !== 'undefined' ? console.log($1) : print($1); */
    ;

statement
    : statement line ';'
        {$$ = new yy.AstNode('STMT-LINE', [$1, $2]);}
    | statement block
        {$$ = new yy.AstNode('STMT-BLCK', [$1, $2]);}
    |
        {$$ = new yy.AstNode('no-op');}
    ;

line
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
    | 'WRITE' 'STRING'
        {$$ = new yy.AstNode('WRITE', [$2]);}
    ;

block
    : 'IF' '(' e ')' '{' statement '}'
        {$$ = new yy.AstNode('IF', [$3, $6]);}
    | 'IF' '(' e ')' '{' statement '}' 'ELSE' '{' statement '}'
        {$$ = new yy.AstNode('IF-ELSE', [$3, $6, $10]);}
    | 'WHILE' '(' e ')' '{' statement '}'
        {$$ = new yy.AstNode('WHILE', [$3, $6]);}
    ;

e
    : e 'PLUS' e
        {$$ = new yy.AstNode('PLUS', [$1, $3]);}
    | e 'MINUS' e
        {$$ = new yy.AstNode('MINUS', [$1, $3]);}
    | e 'MUL' e
        {$$ = new yy.AstNode('MUL', [$1, $3]);}
    | e 'DIV' e
        {$$ = new yy.AstNode('DIV', [$1, $3]);}
    | e '>' e
        {$$ = new yy.AstNode('>', [$1, $3]);}
    | e '<' e
        {$$ = new yy.AstNode('<', [$1, $3]);}
    | e '>=' e
        {$$ = new yy.AstNode('>=', [$1, $3]);}
    | e '<=' e
        {$$ = new yy.AstNode('<=', [$1, $3]);}
    | e '==' e
        {$$ = new yy.AstNode('==', [$1, $3]);}
    | e '!=' e
        {$$ = new yy.AstNode('!=', [$1, $3]);}
    | 'NUMBER'
        {$$ = new yy.AstNode('NUMBER', [$1]);}
    | 'TRUE'
        {$$ = new yy.AstNode('TRUE', []);}
    | 'FALSE'
        {$$ = new yy.AstNode('FALSE', []);}
    | 'ID'
        {$$ = new yy.AstNode('ID', [$1]);}
    ;

