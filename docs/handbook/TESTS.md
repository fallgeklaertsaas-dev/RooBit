# Tests, Diagnostik und Qualitätssicherung

## Testpyramide
1. Lexer (Tokens, Spans, Strings, Kommentare).
2. Parser (AST, Präzedenz, Mehrfachfehler-Recovery).
3. Resolver (Scopes, undefinierte Variablen).
4. Typchecker (Optionals, Bool/0/1, Text+Zahl).
5. Platform/Capability-Analyse.
6. AST↔Text↔Blockly-Roundtrip.
7. IR-Verifier und Bytecode-VM.
8. Integrationsadapter Mac/iOS mit Fake-Host.
9. End-to-end auf realen Geräten (mit Nutzerfreigabe).
10. Security-/Regressionstests.

## Syntax-Goldenfälle
~~~roobit
let gt = 3 > 2 >
let x = 2 >
notify('Hallo', 'Welt') >
repeat 2 ((
    notify('RooBit', 'ok') >
))
~~~
Prüfen: korrektes AST und genaue Spans für beide Bedeutungen von >.

## Negativfälle
- let x = 1  → Statement-Ende fehlt.
- let x = >  → Ausdruck fehlt.
- notify('x' >  → Klammer fehlt.
- let x: Text = 3 >  → Typfehler.
- on iphone (( mac.app.open('Xcode') > )) → Plattformfehler.
- repeat -3 (( ... )) → ungültige Wiederholungszahl.

## Semantik-Grenzen
- Schleife > 10.000: LoopLimitExceeded.
- Fehlende OS-Berechtigung: CapabilityDenied, keine automatische Privileg-Eskalation.
- Unknown shared state: differenzierter Optional-/Fehlerzustand.
- Replay einer Device-Nachricht: dedupliziert oder nachvollziehbar wiederholt.

## Testmodus
Dry Run simuliert Seiteneffekte und schreibt detaillierte 'Would ...'-Logs. Live Read darf nur genehmigte Lese-APIs nutzen. Test Mode modifiziert keine Dateien, startet keine Shell-Kommandos und versendet keine externen Nachrichten.

## Lokale Kommandos (bestehender v0.1-Prototyp)
~~~bash
cd core/runtime
cargo test
cargo run -- ../../examples/study-mode.json

cd ../../apps/editor-web
npm install
npm run build
~~~
**Nicht mit ausgeführten CI-Tests verwechseln:** Diese Befehle sind Anleitungen; ihr Erfolg wird erst nach tatsächlichem Run bestätigt.

## Definition of Done für neue Sprachfeatures
- Entscheidungs-ID und erwartete Semantik.
- Positive/negative/Grenzfalltests.
- Parser + AST + Formatter.
- Blockdarstellung/Inspector.
- Runtime/Testadapter.
- präziser Fehlercode und Dokumentationsbeispiel.
- STATUS.md aktualisiert.
