# Glossar: Compiler, Automation und Apple

**AST (Abstract Syntax Tree):** hierarchische Repräsentation des Programms ohne nebensächliche Schreibdetails.

**Automation:** einzelne ausgelöste Folge von Aktionen.

**Bytecode:** kompakte VM-Instruktionen, nicht direkt ARM64-Maschinencode.

**Capability:** ausdrücklich erlaubte Systemaktion wie calendar.read.

**Compiler:** übersetzt/prüft Programme; ein Compiler muss nicht zwingend nativen Code erzeugen.

**Dry Run:** simulierte Ausführung ohne echte Seiteneffekte.

**Ecosystem:** koordiniertes System aus mehreren Workflows, Geräten und gemeinsamem Zustand.

**EBNF:** Schreibweise für formale Grammatikregeln.

**FFI:** Foreign Function Interface, hier Kommunikation Rust ↔ Swift über C-kompatible Grenzen.

**Interpreter:** führt eine Repräsentation direkt aus, z. B. AST oder JSON-Workflows.

**IR:** Intermediate Representation, Zwischensprache zwischen AST und Bytecode/Host.

**Lexer:** wandelt Quelltext in Tokens; erkennt keine vollständige Programmsemantik.

**Parser:** erkennt grammatische Struktur und erzeugt AST.

**Pratt Parser:** Verfahren zum Parsen von Ausdrücken mit Operatorpräzedenz.

**Resolver:** ordnet Namensnutzungen den Deklarationen und Scopes zu.

**Sandbox:** OS-/App-Grenze, die Zugriff auf Ressourcen beschränkt.

**Semantik:** die Bedeutung und das Verhalten syntaktisch gültiger Konstrukte.

**Source Span:** Position im Quelltext, die einem Token/Knoten/Fehler zugeordnet ist.

**Static Typechecking:** prüft Typbeziehungen vor der Ausführung.

**SwiftUI:** Apples UI-Framework.

**App Intents:** Apple-Schnittstelle, um App-Funktionalität für Systemoberflächen/Shortcuts verfügbar zu machen.

**Trigger:** Bedingung/Ereignis, das eine Automation startet.

**VM (Virtual Machine):** Laufzeit, die eigene Bytecode-Instruktionen ausführt.

**Workflow:** gerichtete Abfolge von Aktionen, Bedingungen und Fehlerpfaden.
