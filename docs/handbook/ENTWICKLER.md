# Entwicklerhandbuch: RooBit mit VS Code und Xcode

## Voraussetzungen
- macOS auf Apple Silicon empfohlen.
- Git und VS Code (Rust-Analyzer, TypeScript-Unterstützung).
- aktuelles Rust-Toolchain mit Cargo.
- Node.js 20+ und npm.
- Xcode für spätere macOS-/iOS-Hosts und Simulator.

## Architekturkarte
~~~text
apps/editor-web/    Blockly-Editor in TypeScript
apps/apple-host/    bisher nur Swift-Host-Konzept
core/runtime/       Rust v0.1 JSON Validator / Dry-run
examples/           importierbare JSON-Demobeispiele
docs/              Produkt-/Sprachentscheidungen, Handbuch, Status
~~~

## Einrichten
~~~bash
git clone https://github.com/fallgeklaertsaas-dev/RooBit.git
cd RooBit
git checkout docs/roobit-language-handbook-v1

cd apps/editor-web
npm install
npm run dev
~~~
In einem zweiten Terminal:
~~~bash
cd core/runtime
cargo test
cargo run -- ../../examples/study-mode.json
~~~

## Wie neue Features entwickelt werden
1. Zuerst Besitzerentscheidung in docs/LANGUAGE_DECISIONS.md festhalten.
2. Positiv-/Negativ-/Edge-Test definieren.
3. AST-Knoten/Typregeln anpassen; keine Semantik im Blockly-Frontend doppelt implementieren.
4. Lexer/Parser/Formatter implementieren.
5. Blockgenerator + Inspector + bidirektionale Konvertierung ergänzen.
6. Interpreter/IR/VM oder Hostadapter implementieren.
7. Dry Run, Fehlerpfade und Berechtigungen testen.
8. Docs, CHANGELOG und STATUS aktualisieren.
9. PR mit Screenshots und Testnachweis erstellen.

## Designprinzipien
- Kern deterministisch und unabhängig vom Betriebssystem.
- Capability-Checks auf beiden Seiten: statische Analyse plus Runtime-Enforcement.
- Jeder Fehler mit Code, Quellspan und Block-ID.
- AST ist semantische Wahrheit; Blockly-Positionen sind Darstellung.
- Keine Live-Aktion über eine behauptete Simulation ausführen.
- Apple-Entitlements nur mit nachvollziehbarer Nutzungsabsicht.

## Repo-Prozess
Featurebranches, kleine PRs, Reviews; main nur nach Tests. Issues trennen Sprachdesign von Umsetzung. Konflikte zu früheren Entscheidungen explizit dokumentieren.

## Fehlersuche
- npm install schlägt fehl: Node-Version/Netz/Lockfile prüfen.
- Cargo-Build schlägt fehl: Rust-Version, serde-Features und Compilerfehler prüfen.
- JSON-Workflow wird abgewiesen: schemaVersion, trigger.type, action.type prüfen.
- Nutzer erwartet RooBit-Quelltext als Input: Noch nicht implementiert; aktuelle Runtime liest JSON.
- Blockly-Blöcke laufen nicht auf iOS: Swift-Host, App Intents und API-Berechtigungen sind Zukunftsmodule.

## Fertig-Kriterium für einen PR
Dokumentation, reproduzierbare Tests und expliziter Status. Nicht bestandene oder nicht ausgeführte Tests transparent benennen.
