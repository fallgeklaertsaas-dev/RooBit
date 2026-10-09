# Visueller Editor, Textmodus und UX

## Architektur
Blockly-Blöcke ↔ kanonischer AST ↔ Text. Eine bloß generierte Textvorschau ist noch **keine bidirektionale Synchronisierung**.

## Blockmodell
Jeder Block braucht stabile ID, AST-Knotentyp, Eingabeports/Typen, Quellspan, Plattform, benötigte Capabilities und optionale Darstellungsmetadaten. Position, Farbe und Skalierung sind Editor-Metadaten und dürfen Semantik nicht ändern.

### Beispiel
~~~text
[ When manual ]
      ↓
[ Set variable: mode = 'study' ]
      ↓
[ On mac ]
    [ Open app 'Xcode' ]
~~~

Textrepräsentation (Design, nicht ausführbar in v0.1):
~~~roobit
automation Study ((
    trigger manual >
    let mode = 'study' >
    on mac ((
        app.open('Xcode') >
    ))
))
~~~

## Bearbeitung und Roundtrip
1. Nutzer bewegt/konfiguriert Block.
2. Blockadapter erzeugt AST-Änderung.
3. Validator führt Typ-/Capability-Checks aus.
4. Textansicht wird aus AST formatiert.
5. Textänderung wird geparst und atomar angewendet, wenn sie gültig ist.
6. Bei Syntaxfehler bleibt die letzte gültige AST-Version erhalten; die Textansicht zeigt den Fehler und verhindert stillen Datenverlust.
7. Layout-Metadaten werden nach Block-ID zugeordnet.

## Custom Blocks
Fehlt für gültigen Text ein spezialisierter Block, erscheint ein generischer Codeblock. Nutzer darf Name, Form und dezente Farbe wählen. Inhalt bleibt parse-/typgeprüfter AST, nicht ungeprüft ausgeführtes Script.

## Kategorien
Triggers, Logic, Variables, Data, Text, Math, Lists, Time, Device, iPhone, Mac, Files, Calendar, Notifications, Shortcuts, Apps, Network, Sync, Advanced.

## UI-Prinzipien
Mac: linke Kategorien, zentraler Canvas, rechter Inspector, unten Code/Execution/Logs/Permissions. iPhone: Projektliste, zoombarer Canvas, Inspector als Sheet, umschaltbarer Text. Design Apple-like reduziert; Farben nie als einziges Statussignal.

## Debugging
Block-Zustände: pending, running, succeeded, failed, skipped, cancelled. Jeder Ausführungs-Trace enthält Block-ID, Zeit und Fehlermeldung. Step, Pause, Retry, Stop sollen kontrolliert arbeiten und OS-seitige Cancellation berücksichtigen.

## Praktische Review-Aufgabe
Ein Block 'Read file' ist nach 'On iPhone' angeschlossen, aber die gewählte API erlaubt nur Mac. Erwartung: statische Plattformdiagnose mit Quell- und Blockposition; Nutzer bekommt 'On mac'-Lösungsvorschlag. Keine stille Ausführung.
