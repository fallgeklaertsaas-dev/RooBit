# Apple-Ökosystem, Sicherheit und Gerätekommunikation

## Mac versus iPhone
macOS kann mit ausdrücklicher Zustimmung lokale Dateien, Shortcuts und eingeschränkt andere Apps ansprechen. iOS besitzt App-Sandboxing und restriktive Background-Ausführung. **Gleicher RooBit-Quelltext bedeutet daher nicht gleiche Capabilities.**

## Swift-Host und Rust
Rust ist zuständig für Parsing, Typen, IR, VM und portable Logik. SwiftUI und App Intents stellen native Interfaces bereit. Kommunikation per wohldefinierter C-FFI bzw. stabiler Request-/Response-Grenze. Kein direkter Dateisystem-/Shell-Zugriff aus iOS-VM.

## Capabilities
Beispiele:
- notifications.send
- shortcuts.run
- calendar.read
- files.read / files.write
- mac.apps.open
- mac.clipboard.read
- sync.read / sync.write

Compiler ermittelt benötigte Capabilities aus AST, erzeugt Manifest und verlangt vor erstem Gebrauch Review. Neue Rechte nach einem Edit werden als Delta angezeigt. Betriebssystem-Prompts können nicht beliebig erzwungen werden: RooBit erklärt die nötigen Systemeinstellungen und zeigt bei Verweigerung eine konkrete Diagnose.

## Sicherheitsprofile
- Safe: keine destruktiven Operationen.
- Standard: Dateischreiben usw. mit begrenztem Scope/Bestätigung.
- Advanced: potenziell mächtige Systemaktionen mit gesonderter Freigabe.

Least Privilege, keine pauschalen Root-Rechte. Secrets gehören nicht ungeprüft in generischen Cloud-/shared State.

## Trigger
Manuell, Shortcut-Button, App Intent, kalenderbezogen, Ordnerbeobachtung (Mac), App-Start, Zeitplan, Systemereignis. **Jeder Trigger braucht eine Plattform-Matrix** (verfügbar, eingeschränkt, nicht verfügbar). 'schedule 07:00' auf iOS ist keine Garantie sekundengenauer Ausführung.

## Cross-device
~~~text
iPhone Event → autorisierte Sync-/Message-Schicht → Mac empfangt → Capability-Check → Aktion
~~~
Mac kann offline sein; Empfang und Ausführung müssen Wiederholung, Ablaufdatum, Duplikate, Fehler/Timeouts und Widerruf behandeln. Empfangene Nachrichten sind nicht automatisch vertrauenswürdig.

## Sync
sync.get/set und shared var. Stände versionieren; Commit-Reihenfolge löst einfache konkurrierende Schreibvorgänge. Kein Versprechen für Echtzeit. UI zeigt Pending/Offline/Conflict. Verschlüsselte Speicherung und iCloud-/Backend-Auswahl sind separate Infrastrukturentscheidungen.

## Desktop-Sticker
Ein RooBit-Ecosystem kann später ein eigenes kleines macOS-Statusfenster/Widget für Studiensession anzeigen. Das ist **RooBit-UI**, keine Berechtigung, beliebig auf fremde App-Displays zu zeichnen.

## Praxisszenario
iPhone erkennt Uni-Event → meldet Mac 'study.started' → Mac öffnet freigegebene Lernapps → Statusfenster zeigt Fortschritt. Testfall: Mac offline; Ereignis wird als 'pending' markiert und folgt vorher festgelegter Retry-/Ablauf-Policy.

## Offizielle Orientierung
- https://developer.apple.com/documentation/appintents
- https://developer.apple.com/documentation/backgroundtasks
- https://developer.apple.com/documentation/eventkit
- https://developer.apple.com/documentation/cloudkit
- https://developer.apple.com/documentation/swiftui
- https://doc.rust-lang.org/reference/
- https://developers.google.com/blockly
