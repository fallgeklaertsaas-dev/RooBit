# Syntaxreferenz – RooBit V1

## Überblick
~~~roobit
automation StudyMode ((
    trigger manual >
    let subject: Text = 'Informatik' >
    var hours = 0 >
    hours = hours + 1 >
    notify('Studium', subject) >
))
~~~

## Deklarationen
- let bindet einen unveränderlichen Wert.
- var bindet einen veränderlichen Wert.
- Typangabe ist optional, z. B. let age: Int = 20 >.
- shared var verbindet einen Wert später über Geräte.
~~~roobit
let name = 'RooBit' >
var current = 1 >
shared var studyMode = True >
~~~

## Bedingungen
~~~roobit
if battery < 20
    do:
        notify('Akku', 'Niedrig') >
elif battery < 50
    do:
        notify('Akku', 'Mittel') >
else:
    notify('Akku', 'Okay') >
~~~
**Noch DRAFT:** Das genaue Ende der eingerückten do:-Zweige muss formalisiert werden. Eine mögliche Alternative ist do: (( ... )). Der Eigentümer hat do: beschlossen, aber nicht abschließend die Block-Ende-Semantik.

## Schleifen
~~~roobit
repeat 3 ((
    print('Hallo') >
))
for file in files ((
    print(file.name) >
))
while ready ((
    process() >
))
~~~
Die Runtime benötigt Iterations-/Zeitgrenzen, insbesondere bei while.

## Funktionen/Actions
~~~roobit
function double(number: Int) -> Int ((
    return number * 2 >
))
action StartStudy ((
    notify('Start', 'Jetzt') >
))
~~~

## Plattform- und Device-Steuerung
~~~roobit
on mac ((
    app.open('Xcode') >
))
on iphone ((
    notify('Mac', 'Bereit') >
))
iphone.send('study.started') >
shared var state = 'ready' >
~~~

## Trigger, Async und Fehler
~~~roobit
when time is 07:00 every weekday ((
    notify('Uni', 'Los gehts') >
))
parallel ((
    download(urlA) >
    download(urlB) >
))
try ((
    file.read('~/Uni/test.pdf') >
)) catch error ((
    notify('Fehler', error.message) >
))
~~~

## Kommentare, Literale, Operatoren
~~~roobit
# Inline-Kommentar
/*
Abschnittskommentar
*/
let ok = True >
let ratio = 1.25 >
let message = 'Hallo' ++ ' RooBit' >
let greater = hours > 2 >
~~~

### Doppelte Bedeutung von >
Der Operator > vergleicht zwei Werte und beendet Statements. Im Ausdruck hours > 2 erwartet der Parser rechts einen Ausdruck; am Statement-Ende folgt der terminierende zweite >. Das muss mit Parser-Tests belegt werden.

Vergleich: == != < > <= >=, dazu lesbare Operatoren is, contains und exists. Zuweisung ist =. Logik orientiert sich an and/or/not aus Python. True/False werden großgeschrieben.

## Komma und Semikolon
Komma trennt Parameter/Argumente. Ein Semikolon wurde **nicht** explizit beschlossen: nicht als Standardterminalszeichen einführen; als offene Sprachentscheidung notieren. Das Zeilenende ist >, nicht ein Zeilenumbruch.
