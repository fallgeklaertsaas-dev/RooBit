# Compilerbau: Theorie, Grammatik, AST und Runtime

## 1. Pipeline
Quelltext → Lexer → Tokens mit Spans → Parser → AST → Namensauflösung → Typprüfung → Capability-Analyse → Automation-IR → Bytecode → VM → Swift-Host.

**Status:** Die vorhandene v0.1-Rust-Runtime verarbeitet JSON; diese Pipeline ist Zielarchitektur und noch nicht komplett umgesetzt.

## 2. Lexing
Longest-match: (( vor (, )) vor ), >= vor >, == vor =, ++ vor +. String-Inhalte und Kommentare bleiben von Operatoren unberührt. Jedes Token hat Zeile/Spalte/Byteoffset, um Fehler im Editor zu markieren.

Beispiel:
~~~roobit
let allowed = count > 2 >
~~~
Tokens: LET, IDENT(allowed), EQUALS, IDENT(count), GT, INTEGER(2), GT. Der Parser interpretiert das erste GT als Vergleich und das zweite als Statementabschluss.

## 3. EBNF-Entwurf (Subset, DRAFT)
~~~ebnf
program      = { declaration } ;
declaration  = automation | function | action ;
automation   = "automation", IDENT, block ;
function     = "function", IDENT, "(", [ parameters ], ")", [ "->", type ], block ;
action       = "action", IDENT, block ;
block        = "((", { statement }, "))" ;
statement    = var_decl, ">"
             | assignment, ">"
             | call, ">"
             | return_stmt, ">"
             | repeat_stmt
             | for_stmt
             | while_stmt
             | platform_stmt ;
var_decl     = [ "shared" ], ("let" | "var"), IDENT, [ ":", type ], "=", expr ;
assignment   = IDENT, "=", expr ;
return_stmt  = "return", [ expr ] ;
repeat_stmt  = "repeat", expr, block ;
for_stmt     = "for", IDENT, "in", expr, block ;
while_stmt   = "while", expr, block ;
platform_stmt= "on", ("mac" | "iphone"), block ;
call         = IDENT, "(", [ expr, { ",", expr } ], ")" ;
type         = IDENT, [ "?" ] ;
expr         = precedence_expression ;
~~~
if/elif/else mit do: und natürlichsprachige Trigger sind **noch nicht final als EBNF festgelegt**, weil das Ende eines eingerückten do:-Zweigs formal vereinbart werden muss.

## 4. Parserstrategie
Recursive Descent für Deklarationen und Statements, Pratt Parsing für operatorreiche Ausdrücke. Wichtig: Parserzustand unterscheidet Vergleich > von Abschluss >. Recovery an Statement-Abschluss und Block-Ende verhindert, dass ein Syntaxfehler 20 Folgefehler verursacht.

## 5. AST
Vereinfachtes Beispiel:
~~~text
Automation(name=StudyMode,
  body=[
    Trigger(Manual),
    Let(name=allowed,
        value=Binary(GreaterThan, Identifier(count), Integer(2))),
    Call(Notify, [Text("Start"), Identifier(allowed)])
  ])
~~~
AST speichert Bedeutung und Quellbezug; die Blockly-Position ist separate Layout-Metadaten.

## 6. Semantische Analyse
Resolver erstellt Symboltabellen; Typchecker annotiert AST-Expressions; Capability-Analyse extrahiert Rechte wie notifications.send und calendar.read. Plattformprüfer stellt sicher, dass Mac-only-Aktionen nicht in ungeschützten iPhone-Pfaden stehen.

## 7. IR und Bytecode
Typed AST senkt sich zu Automation-IR mit expliziten Steuerflusskanten, Fehlerpfaden und async-Schritten. VM führt Bytecode in einer Capability-Sandbox aus. Diese IR/Bytecode-Formate sind **noch DRAFT**, damit Nutzerentscheidungen zum Fehler- und Triggerverhalten erhalten bleiben.

## 8. Implementierungsschritte
1. Lexer für Strings, Kommentare, Klammern, > und Identifier mit 30 Tests.
2. AST-Datentypen und Parser für Variablen/Calls/Repeat.
3. Pratt-Parser für Vergleiche mit Doppel-> und Fehler-Recovery.
4. do:-Branch-Grenze final entscheiden und implementieren.
5. Resolver/Typchecker/Plattformfehler ergänzen.
6. Blockly→AST und Text→AST mit Roundtrip-Tests.
7. AST→IR→Bytecode und VM mit Testadapter, erst danach echte Swift-Host-Aktionen.

## 9. Praktische Aufgabe
Tokenisiere:
~~~roobit
let canRun = 3 > 2 >
~~~
**Lösung:** LET IDENT EQUALS INT GT INT GT. Erwarteter AST: LetDecl(canRun, GreaterThan(3,2)).
Negativprobe: let x = > muss präzise auf fehlenden Ausdruck hinweisen.
