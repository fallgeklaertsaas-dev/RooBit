# Praxisbeispiele: Automationen und Ecosystems

Alle folgenden RooBit-Textbeispiele sind **DESIGNEXEMPLARE** und noch nicht vom vorhandenen JSON-Runtime-Prototyp parsebar. Für den ausführbaren Dry Run siehe examples/study-mode.json.

## 1. Hallo RooBit
~~~roobit
automation Welcome ((
    trigger manual >
    notify('RooBit', 'Hallo') >
))
~~~
**Lernziel:** Deklaration, Statementende, Textliteral. **Test:** zwei Parameter werden korrekt geparst; Notification im Dry Run protokolliert.

## 2. Studienmodus auf Mac
~~~roobit
automation Focus ((
    trigger manual >
    let subject = 'Datenbanken' >
    on mac ((
        app.open('Xcode') >
        notify('Studium', subject) >
    ))
))
~~~
**Lernziel:** Plattform-Guard und immutable Variable. **Fehlerprobe:** on iphone + mac.app.open muss statisch fehlschlagen.

## 3. Akkuschwelle
~~~roobit
automation Battery ((
    trigger manual >
    if battery < 20
        do:
            notify('Akku', 'Aufladen') >
    else:
        notify('Akku', 'Alles okay') >
))
~~~
**Achtung:** Das Ende eines do:-Zweigs ist noch Grammatik-DRAFT; dieses Beispiel dient als Diskussions- und Parser-Testfall.

## 4. Wiederholung
~~~roobit
automation Reminder ((
    trigger manual >
    repeat 3 ((
        notify('RooBit', 'Pause machen') >
    ))
))
~~~
**Test:** genau drei Dry-Run-Ausgaben; kein realer Notification-Spam.

## 5. Download-Ordner organisieren
~~~roobit
automation PDFSorter ((
    trigger folder '~/Downloads' changed >
    on mac ((
        for file in files('~/Downloads') ((
            if file.extension is 'pdf'
                do:
                    file.move('~/Documents/PDFs') >
        ))
    ))
))
~~~
**Sicherheitsanforderung:** File-Read-/Write-Capabilities und Dry-Run-Vorschau vor Live-Ausführung. Trigger- und do:-Notation sind weiterhin DRAFT.

## 6. Cross-device Study Ecosystem
~~~roobit
automation UniversityEvent ((
    trigger calendar >
    on iphone ((
        iphone.send('study.started') >
    ))
))

automation StudyOnMac ((
    on mac ((
        on message 'study.started' ((
            app.open('Xcode') >
            sync.set('studySession', True) >
        ))
    ))
))
~~~
**Lernziel:** Ereignisse, Zielgerät, Empfangsbestätigung, Sync. **Tests:** Mac offline, Duplikate, Berechtigungsfehler, später Empfang.

## 7. Fehler sichtbar machen
~~~roobit
automation ReadNotes ((
    trigger manual >
    try ((
        file.read('~/Uni/not-found.txt') >
    )) catch error ((
        notify('Fehler', error.message) >
    ))
))
~~~
**Test:** Fehlerblock wird markiert; Fehlerpfad protokolliert; keine falsche Erfolgsmeldung.

## 8. Eigenes Beispiel dokumentieren
Immer angeben: Ziel, Zielplattform, Trigger, Inputs, erwartete Actions, Permissions, Fehlerfälle, Offline-Verhalten, Simulationsergebnis und erwartete AST-/Block-Struktur.
