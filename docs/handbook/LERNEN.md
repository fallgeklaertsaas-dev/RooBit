# RooBit Lernpfad: Theorie und praktische Übungen

## Modul 1 – Swift und Apple-Grundlagen (20–40 h)
Wissen: let/var, Optionals, Struct/Enum, async/await, SwiftUI, Permissions. Praxis: kleine SwiftUI-App mit Liste, Button und Berechtigungsanzeige. **Gate:** App startet in Xcode, zeigt sinnvolle Fehlermeldung bei verweigerter Berechtigung.

## Modul 2 – Rust (35–70 h)
Wissen: Cargo, Ownership/Borrowing, enum/match, Result, Vec/HashMap, Module, Tests. Praxis: CLI liest Workflow-JSON und zählt Actions. **Gate:** cargo test grün, Fehler beim ungültigen JSON nachvollziehbar.

## Modul 3 – Compiler-Theorie (20–35 h)
Wissen: lexikalische Analyse, AST, Parser-Präzedenz, Typchecking, IR. Praxis: auf Papier fünf Statements in Tokens und AST zerlegen. **Gate:** Unterschied zwischen lexikalischem und semantischem Fehler erklären.

## Modul 4 – Lexer (30–50 h)
Wissen: endliche Automaten, Escape-Sequenzen, Quellspans, maximal munch. Praxis: Tokens für 'let x = 3 > 2 >' erzeugen. **Gate:** 30 positive/negative Tests; Kommentar- und String-Inhalt nicht fehlinterpretieren.

## Modul 5 – Parser (45–80 h)
Wissen: Recursive Descent, Pratt Parsing, Recovery. Praxis: let, calls und repeat parsen. **Gate:** GreaterThan-Konflikt und verschachtelte Klammern in Golden Tests gelöst.

## Modul 6 – Typchecker und Semantik (40–65 h)
Wissen: Namensauflösung, lexikalische Scopes, Typinferenz, Optionals, Errors. Praxis: 'let x: Text = 3 >' als Compile Error erkennen. **Gate:** 20 Compile-Fail-Tests.

## Modul 7 – Blockly ↔ AST ↔ Text (45–80 h)
Wissen: Serialisierung, AST-Losslessness, stabile Knoten-IDs, Undo. Praxis: 5 Blöcke → Text → Parse → gleiche Semantik. **Gate:** 20 Roundtrip-Fälle.

## Modul 8 – Automation IR / VM (60–100 h)
Wissen: Instruktionen, Kontrollfluss, Callstack, Fehlerpfade, Capability-Checks. Praxis: repeat mit Notification im Dry Run. **Gate:** deterministisches Log; keine echten Side Effects.

## Modul 9 – Apple Hosts (60–110 h)
Wissen: Xcode-Targets, FFI, SwiftUI, App Intents, Sandbox und BackgroundTasks. Praxis: Notification/Shortcut über Host-Abstraktion, mit Permission-Flow. **Gate:** Mac/iPhone unterscheiden Capabilities korrekt.

## Modul 10 – Geräte und V1-Test (50–90 h)
Wissen: Nachrichten-IDs, Retry, Offline-Sync, CI, Integrationstests. Praxis: Uni-Event → Mac StudyStatus-Workflow simulieren. **Gate:** offline, denied, duplicate, timeout getestet.

**Schätzungen sind Planungswerte, keine gemessenen Entwicklungszeiten.** Bestehende Kenntnisse können Zeit reduzieren.

## Übung + Musterlösung

**Aufgabe:** Welche zwei Verwendungen hat > in 'let ok = hours > 2 >'?

**Lösung:** Das erste > ist GreaterThan im Ausdruck; das zweite schließt das Statement ab. Der Parser benötigt einen eindeutigen Ausdrucks-/Statement-Kontext.

**Aufgabe:** Was passiert bei 'let x = 3 >' gefolgt von 'x = 4 >'?

**Lösung:** Statischer Reassignment-Fehler, da let nicht veränderlich ist.

**Aufgabe:** Kann 'on iphone (( mac.app.open(\'Xcode\') > ))' ausgeführt werden?

**Lösung:** Nein. Statischer Plattformfehler; auch ein Testmodus darf die fehlende Capability nicht als Erfolg vortäuschen.

## Lernstatus festhalten
Für jede Session: Thema, Verständnis (0–4), Übung, Testresultat, letzter grüner Commit, nächster genauer Schritt. Nach Pause: STATUS.md → Git-Status → Tests → letztes Beispiel → nächsten Task.
