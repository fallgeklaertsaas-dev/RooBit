# RooBit – Handbuch und Einstieg

**Status:** Sprachdesign und Dokumentation; der vorhandene v0.1-Prototyp interpretiert bisher JSON und erzeugt eine Textvorschau mit alter Syntax. Die hier beschlossene neue Syntax ist noch nicht als vollständiger Parser lauffähig.

## Ziel
Eine visuelle und textuelle Automationssprache für macOS und iPhone: Blockly-Blöcke und Quelltext bilden denselben AST ab, Rust prüft/führt portable Logik aus und Swift-Host-Apps stellen geschützte Apple-Fähigkeiten bereit.

## Bestätigte Notation
~~~roobit
# Studienstart
automation StudyMode ((
    trigger manual >
    let course = 'Mathematik' >
    notify('Uni', course) >
))
~~~
- Doppelklammern (( ... )) begrenzen Codeblöcke.
- do: kennzeichnet den Zweig von Bedingungen.
- > beendet Statements.
- Komma trennt Argumente; einfache Anführungszeichen für Strings.
- # ist Zeilenkommentar, /* ... */ ist Blockkommentar.
- Python ist nur Fallback für nicht anders entschiedene Details.

## Praktischer Test des bestehenden Prototyps
~~~bash
git checkout feat/v0.1-vertical-slice
cd apps/editor-web
npm install
npm run dev
~~~
Zweites Terminal:
~~~bash
cd core/runtime
cargo test
cargo run -- ../../examples/study-mode.json
~~~
Der Runtime-Prototyp führt reale Systemaktionen **nicht** aus. Er meldet geplante Capabilities als Dry-Run. Die neue Syntax kann dort noch nicht eingegeben werden.

## Lernreihenfolge
1. Syntax und Beispiele lesen.
2. Lexer, Parser und AST verstehen.
3. Semantik und Typechecking durchgehen.
4. Datenfluss Blockly ↔ AST ↔ Text untersuchen.
5. Apple-Fähigkeiten und Berechtigungen lernen.
6. Tests und Übungen bearbeiten.
7. Eigene Sprachentscheidungen als Beispiele + erwartete Ergebnisse einreichen.

## Beteiligung
Der Eigentümer entscheidet Syntax und Semantik. Ein Designvorschlag ist nicht automatisch implementiert. Jede neue Regel erhält mindestens ein gültiges Beispiel, einen Negativtest und einen Edge Case.
