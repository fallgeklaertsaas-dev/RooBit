# Dokumentationsstatus / Wiedereinstieg

Stand: 2026-10-09. Branch: docs/roobit-language-handbook-v1.

## Was erstellt wurde
- [x] Syntaxentscheidung ((...)), do:, >, Komma, Single-Quote und Python-Fallback dokumentiert.
- [x] Syntaxreferenz und semantische Grundregeln.
- [x] Compiler-/EBNF-Teilentwurf.
- [x] Blockly-/AST-/Textstrategie.
- [x] Apple-/Capabilities-/Sicherheitskapitel.
- [x] Teststrategie mit Negativ- und Edge-Cases.
- [x] Lernpfad, Praxisbeispiele, Glossar, Entwickler-Guide.
- [ ] vollständiger Textparser für neue Syntax.
- [ ] bidirektionale Blockly↔Text-Implementierung.
- [ ] echte Swift macOS-/iOS-Host-Apps.
- [ ] End-to-End-Tests auf echten Geräten.

## Besonders wichtige offene Fragen
1. Wie wird do: beendet: dedent-basiert oder do: ((...))?
2. Für > als Vergleich und Terminator: Parserprobe und Ambiguitätstests.
3. Soll ; überhaupt eine Rolle erhalten? Bisher nicht beschlossen.
4. Exaktes Error-/Timeout-Verhalten im Device-/Parallel-Modus.

## Nächste drei konkrete Tasks
1. Sprachgrammatik nach Besitzerreview formal vervollständigen.
2. Lexer-Suite für ((, )), Textstrings, >, >=, Kommentare schreiben.
3. Parser für Let/Var/Calls/Repeat plus AST-Regressionstests erstellen.

## Wiedereinstieg nach Wochen
1. Dieses Dokument und docs/LANGUAGE_DECISIONS.md lesen.
2. git status und git log -5 --oneline prüfen.
3. cd core/runtime && cargo test.
4. cd apps/editor-web && npm run build.
5. Vorhandenen Dry Run durchspielen.
6. Ausschließlich die nächste offene Aufgabe wählen.
7. Zum Schluss Status, Testbefunde, Blocker und nächsten konkreten Befehl eintragen.

## Session-Template
Datum:
Ziel:
Neue/Geänderte Dateien:
Sprachentscheidung:
Getestet (exakte Kommandos):
Testresultat:
Bekannte Grenzen:
Nächste drei Schritte:
