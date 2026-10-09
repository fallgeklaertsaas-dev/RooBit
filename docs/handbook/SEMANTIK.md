# Semantik und Typensystem

## Was Semantik bedeutet
Der Lexer erkennt Tokens; der Parser liefert Struktur; der Resolver erkennt, welche Variable gemeint ist; der Typchecker prüft Operationen; die Runtime führt sie aus.

## Typen
Bool, Int, Decimal, Text, List<T>, Optional<T>, Date, Time, DateTime, Duration, URL, File. Apple-Domänentypen: App, Device, Calendar, CalendarEvent, Reminder, Shortcut, Contact, Notification, Folder.

Type Inference ist die Regel, eine Annotation ist optional:
~~~roobit
let n = 42 >
let s: Text = 'Uni' >
let next: CalendarEvent? = calendar.next() >
~~~

## Wahrheit und Vergleiche
Bool sowie numerisch 1 (wahr) und 0 (falsch) werden in Bedingungen akzeptiert. Es gibt **keine allgemeine Truthiness** für Strings, Listen oder beliebige Zahlen. = ist Zuweisung; == vergleicht streng. Keine implizite Text-Zahl-Konvertierung.

## Bindungen
let ist immutable, var mutable. Lexikale Scopes. Undeklarierte Variablen und Typfehler sollen vor Ausführung auffallen.
~~~roobit
let x = 2 >
# x = 3 >  -> ungültig
var y = 2 >
y = 3 >
~~~

## Schleifen und Zeit
repeat, for, while. Standardlimit: 10.000 Iterationen pro Schleife in Safe/Standard. Zusätzlich Timeouts und Benutzerabbruch. Unendliche Schleifen enden mit sichtbarer Diagnose LoopLimitExceeded.

## Sequenziell und parallel
Normale Aktionen warten implizit aufeinander. parallel startet unabhängige Zweige; Fehler-, Cancellation- und Schreibkonfliktregeln erhalten separate Tests.

## Fehler
Standard: Nicht abgefangener Fehler stoppt Workflow. Visuell optionaler Error-Zweig, textuell try/catch. Retry/Skip/Continue nur ausdrücklich konfiguriert. Ein gescheiterter Block wird rot markiert, abgeschlossene Schritte grün.

## Plattform
macOS-exklusive Aktionen dürfen im Cross-Platform-Projekt nur unter on mac laufen; sonst Compile-Error. Bei reinem Mac-Projekt ist der Guard optional. iOS verfügt nicht über frei zugängliche Shell-/Desktop-Steuerungs-APIs.

## Shared
shared var sowie sync.get/set teilen State. Konflikte werden versioniert und nach geordneter Commit-Reihenfolge entschieden. Sync ist nicht automatisch zeitgleich oder transaktionssicher.

## Offene Randfälle
Überlauf, Division durch null, optionale Werte entpacken, Zeitzonen, doppelte Triggerauslösung, Async-Fehler und Rechteänderungen werden vor tatsächlicher VM-Implementierung als spezifische Designfragen geprüft.
