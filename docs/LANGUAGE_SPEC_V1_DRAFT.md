# RooBit Language Specification — V1 Design Baseline

Status: **OWNER-APPROVED BASELINE**  
Date: 2026-09-29  
Scope: language + visual editor + Apple automation semantics

This document consolidates the owner's marked “übernehme” choices. Wherever the owner left a choice open, the previously proposed technical recommendation is adopted.

> Important: exact parser grammar remains versioned. The owner explicitly selected a mixed visual/textual style. Before freezing the parser, delimiter consistency will receive one final syntax-only review without changing semantics.

---

## 0. Language philosophy

RooBit should:
- be easy to learn visually;
- have a real textual language at the same time;
- be optimized specifically for automation;
- treat iPhone and Mac as parts of one personal automation ecosystem;
- catch mistakes as early as possible;
- be safe by default;
- avoid forcing beginners to understand low-level implementation concepts;
- still provide an advanced path for technical users;
- make visual and textual authoring equivalent views over one canonical semantic model;
- favor understandable execution over clever implicit behavior.

Priority:
1. reliable automation and cross-device behavior;
2. understandable visual/textual authoring;
3. extensibility toward a deeper programming language later.

RooBit V1 is not intended to be a systems-programming language or a replacement for Rust/Swift.

---

## 1. Program / automation declaration

Owner-selected base form:

~~~roobit
automation StudyMode (

    trigger manual,

    notify("Study Mode gestartet"),

)
~~~

RooBit therefore permits a declaration-oriented automation container.

### Syntax note

The owner also selected Python-like condition syntax and double-parenthesis examples for some control constructs. This is technically implementable, but the parser/formatter will keep these constructs explicit in the grammar rather than guessing from whitespace.

---

## 2. Comments

Accepted:

~~~roobit
# Einzeiliger Kommentar
~~~

and:

~~~roobit
/*
Mehrzeiliger
Kommentar
*/
~~~

---

## 3. Variables

Accepted direction: immutable + mutable variables, with Python-like type inference and simple assignment semantics.

~~~roobit
let university = "OVGU"
var studyHours = 0

studyHours = 2
~~~

Rules:
- let declares an immutable binding.
- var declares a mutable binding.
- reassignment uses =.
- variables use lexical scope.
- reading an undeclared variable is a compile-time error.
- reading a variable before initialization is a compile-time error where statically knowable, otherwise a runtime validation error.
- type inference is the default.

---

## 4. Type system

V1 built-in types:
- Bool
- Int
- Decimal
- Text
- List<T>
- Optional<T>
- Date
- Time
- DateTime
- Duration
- URL
- File

Apple/domain types:
- App
- Device
- Calendar
- CalendarEvent
- Reminder
- Shortcut
- Contact
- Notification
- Folder

Type annotations are optional:

~~~roobit
let age = 22
let exactAge: Int = 22
~~~

RooBit is statically checked with local type inference.

No implicit Text↔Number coercion is performed.

Numeric widening from Int to Decimal may be allowed where lossless; narrowing requires an explicit conversion.

---

## 5. Missing values / Optional

Internally RooBit uses Optional<T>, not unrestricted null values.

User-facing syntax remains readable:

~~~roobit
let event: CalendarEvent? = calendar.next()

if event exists
    do:
        notify("Termin gefunden")
~~~

Rules:
- T? is syntax sugar for Optional<T>.
- exists checks whether an Optional contains a value.
- missing values do not silently coerce to false/zero/empty text.
- advanced unwrapping syntax can be added later.

---

## 6. Conditions

Owner-selected style:

~~~roobit
if batteryLevel < 20
    do:
        notify("Akku niedrig")
elif batteryLevel < 40:
    ...
else:
    ...
~~~

Boolean policy:
- native Bool is accepted;
- numeric 1 may be interpreted as true;
- numeric 0 may be interpreted as false;
- no other automatic truthiness is accepted in V1.

Thus Text, List, File, Optional, etc. cannot be used directly as conditions.

Logical operators use short-circuit evaluation.

---

## 7. Comparisons and readable predicates

Classical operators remain available:

~~~text
==
!=
<
>
<=
>=
~~~

Readable automation predicates are also part of RooBit:

~~~roobit
if name is "Omar"
if app is running
if file exists
if text contains "Uni"
if battery < 20
~~~

Recommendation adopted for ambiguity:
- = remains assignment.
- == is strict equality.
- is, contains, exists are readable predicates.
- no JavaScript-style equality coercion.

---

## 8. Loops

Accepted forms:

~~~roobit
repeat 5 ((
    notify("Hallo")
))
~~~

~~~roobit
for file in files ((
    print(file.name)
))
~~~

~~~roobit
while batteryLevel > 20 ((
    ...
))
~~~

Rules:
- repeat: counted loop.
- for: collection iteration.
- while: allowed with runtime safeguards.
- Safe/Standard modes apply a default iteration ceiling of 10,000 iterations per loop unless the runtime proves the loop is bounded more tightly.
- exceeding the safety ceiling raises LoopLimitExceeded.
- the visual runtime highlights the loop that stopped.
- Advanced mode may allow a user-configured larger limit, never an invisible unbounded execution.

---

## 9. Functions and automation actions

Normal reusable function:

~~~roobit
function greet(name: Text) (
    notify("Hallo " ++ name)
)
~~~

Call:

~~~roobit
greet("Omar")
~~~

Automation action:

~~~roobit
action StartStudyMode ((
    ...
))
~~~

Rules:
- function: reusable computational/function unit.
- action: reusable automation-oriented unit that may invoke capabilities.
- ++ concatenates Text.
- ordinary functions should preferably remain side-effect-light; actions explicitly represent side effects.

---

## 10. Return values

Accepted:

~~~roobit
function double(number) -> Int (
    return number * 2
)
~~~

Rules:
- return is the return keyword.
- return type annotations use -> Type.
- parameter and return types may be inferred where unambiguous.
- public/reusable actions/functions should eventually be encouraged by tooling to expose explicit types.

---

## 11. Error handling

Default: **stop on unhandled error**.

Text form:

~~~roobit
try (
    file.read("~/Uni/test.pdf")
) catch error (
    notify(error.message)
)
~~~

Visual behavior:

~~~text
[ Read file ]
    ├─ success → next step
    └─ error   → optional error path
~~~

Rules:
- unhandled error stops the affected workflow.
- handled errors may route into an explicit visual error branch.
- text mode provides try/catch.
- a user may explicitly configure an action/error branch to retry, skip or continue.
- silent failure is not a default behavior.
- execution UI shows every completed step in green and the failing/current step distinctly.

---

## 12. Async / waiting / parallelism

Accepted default: **sequential automation actions automatically wait for completion.**

~~~roobit
download(url)
open(file)
~~~

means download completes before open begins.

Explicit parallelism:

~~~roobit
parallel (
    download(fileA)
    download(fileB)
)
~~~

Rules:
- no explicit await required for ordinary sequential automation code.
- parallel is opt-in.
- actions may define a default timeout.
- project/runtime may define a global timeout policy.
- timeout becomes a normal RooBit error and follows the failure model.

---

## 13. macOS / iPhone platform semantics

Accepted platform blocks:

~~~roobit
on mac (
    app.open("Xcode")
)

on iphone (
    notify("Mac-Workflow gestartet")
)
~~~

Recommended platform rule adopted:
- in a cross-platform/Ecosystem project, a platform-only capability outside an explicit platform guard is a compile-time error;
- in a project explicitly targeted only to that platform, the guard is optional;
- RooBit never silently skips an unsupported action by default.

---

## 14. Device communication

Accepted direct message concept:

~~~roobit
iphone.send("study.started")
~~~

Receiver:

~~~roobit
on message "study.started" (
    app.open("Xcode")
)
~~~

Additional recommended syntax:

~~~roobit
run StudySetup on mac
device("My Mac").run StudySetup
~~~

Device addressing model:
- personal aliases: iphone, mac;
- named-device addressing for multiple devices: device("name");
- remote execution routes through a signed/synchronized RooBit project context;
- receiving device must have required capabilities already granted.

---

## 15. Synchronized values

Both forms are supported.

Explicit store:

~~~roobit
sync.set("studyMode", true)
active = sync.get("studyMode")
~~~

Language-level shared state:

~~~roobit
shared var currentProject = "RooBit"
~~~

Rules:
- shared variables synchronize between the user's RooBit devices.
- scalar conflicts use deterministic last-committed-write-wins based on sync-service commit order, not local device clock.
- every update carries a version.
- structured-state conflicts are logged and may later expose explicit conflict handlers.
- no secret/password values may be placed into generic shared state without a future secure-secret type/store.

---

## 16. Trigger syntax

Project trigger families:
- manual
- Shortcut
- App Intent
- calendar
- folder watch
- app launch
- schedule
- system event

Natural-readable style is preferred.

Accepted examples:

~~~roobit
when time is 07:00 every weekday {
    ...
}
~~~

~~~roobit
when app "Xcode" opens
~~~

~~~roobit
when folder "~/Downloads" changes
~~~

~~~roobit
when calendar.event starts
~~~

The exact trigger-body delimiter is retained as owner-selected syntax for the current design baseline and will receive a final parser-consistency review.

---

## 17. Permissions / capabilities

Accepted:
- compiler automatically infers required capabilities;
- compiler generates a capability manifest;
- user can inspect the manifest;
- user confirms capabilities before first execution;
- if a later edit adds a capability, RooBit shows a capability diff and requires confirmation for the new capability;
- where the OS needs a manual setting change, RooBit provides guided instructions;
- capability denial becomes a visible execution/validation error.

No explicit permission declaration is required in ordinary V1 source code.

Advanced/manual manifests may be added later.

---

## 18. Text ↔ Blockly synchronization

Architecture:

~~~text
Blocks
  ⇅
AST
  ⇅
Text
~~~

Both are first-class editors over the same canonical AST.

If valid RooBit text has no built-in visual block:
- RooBit creates a Generic/Custom Code Block rather than rejecting valid code.
- user can assign the custom block a name, color and visual form.
- the custom block stores a valid AST/text fragment, not arbitrary unvalidated text.
- a later block definition may replace the generic visualization without changing semantics.

---

## 19. Visual block categories

Initial V1 categories:
1. Triggers
2. Logic
3. Variables
4. Data
5. Text
6. Math
7. Lists
8. Time
9. Device
10. iPhone
11. Mac
12. Files
13. Calendar
14. Notifications
15. Shortcuts
16. Apps
17. Network
18. Sync
19. Advanced

Categories can be reorganized later without changing language semantics.

---

## 20. Visual style

Accepted: **Apple-like reduced**.

Rules:
- subdued category accents rather than Scratch-level saturation;
- color must not be the only semantic indicator;
- block shape/icon/text also communicate role;
- platform blocks should remain visually distinguishable;
- errors/warnings use status decoration rather than permanently recoloring entire projects.

---

## 21. Project package

User-facing project package:

~~~text
StudySystem.roobit
~~~

RooBit presents this as one project item while internally it may contain:

~~~text
project.json
main.roobit
workflows/
assets/
permissions.json
~~~

This allows one-file usability and multi-file internal structure.

---

## 22. Project types: Automation and Ecosystem

Both are first-class.

### Automation
One main task/workflow, e.g. move a PDF from Downloads.

### Ecosystem
Multiple related automations plus:
- devices;
- shared state;
- triggers;
- remote actions;
- coordinated UI/output.

Example study ecosystem:

~~~text
iPhone:
  university event begins
      ↓
  notify Mac

Mac:
  open Xcode
  open notes
  start Study Focus
  optionally create a RooBit desktop sticker/status card

Shared:
  studySession = active
~~~

Future design space includes RooBit-owned desktop “stickers”/status cards generated by workflow code.

---

## 23. Security levels

Accepted:

### Safe
- no destructive actions;
- high-risk capabilities unavailable.

### Standard
- file/system modifications allowed with explicit policy/confirmation;
- capability grants remain least-privilege.

### Advanced
- shell/system automation and other high-power adapters may be enabled;
- additional warnings and capability review required.

Prompt policy recommendation adopted:
- system permission prompts are requested just-in-time;
- RooBit always explains new/high-risk permissions;
- destructive actions may require explicit confirmation according to project policy;
- RooBit does not blindly prompt before every harmless action, because repeated prompts create confirmation fatigue and do not by themselves guarantee privacy/compliance.

---

## 24. UI baseline

macOS baseline:

~~~text
┌──────────────────────────────────────────────────────────────┐
│ RooBit                                                      │
│ Study Ecosystem                    Run   Stop   Test         │
├────────────┬─────────────────────────────┬───────────────────┤
│ Blocks     │                             │ Inspector         │
│ Triggers   │        Workspace            │ Selected Block    │
│ Logic      │                             │ Platform          │
│ Data       │                             │ Permissions       │
│ Apple      │                             │ Errors            │
│ Device     │                             │                   │
├────────────┴─────────────────────────────┴───────────────────┤
│ Blocks | Code | Execution | Logs | Permissions             │
└──────────────────────────────────────────────────────────────┘
~~~

iPhone baseline:
- project list;
- compact workflow canvas;
- selected-block inspector as sheet;
- Run/Test/Stop controls;
- Code view;
- Execution/Logs;
- Permissions.

Always visible while editing:
- project name;
- current platform/project type;
- run/test state;
- validation/error indicator.

---

## 25. Debugging

V1 includes:
- live execution visualization;
- completed blocks green/success-marked;
- current block highlighted;
- failing block explicitly marked;
- execution logs;
- step-by-step mode;
- pause/resume;
- retry;
- skip/stop where the failure policy allows it.

Example:

~~~text
[ Trigger ] ✓
    ↓
[ Open Xcode ] ✓
    ↓
[ Read Calendar ] ← CURRENT
    ↓
[ Notify ]
~~~

---

## 26. Simulation / Test Mode

Accepted: **yes**.

Default Test Mode:
- validates the entire workflow;
- simulates side effects;
- shows “Would…” actions;
- does not modify files;
- does not send messages/notifications externally;
- does not run shell commands;
- does not launch destructive external operations;
- does not perform write network requests.

Optional **Live Read** mode may use real read-only data, for example Calendar read, only after normal permissions have been granted.

Simulation and Live execution must be visually distinct.

---

## 27. RooBit V1 completion criteria

V1 must include:
- Visual Editor
- Text Editor
- bidirectional Blocks ↔ AST ↔ Text synchronization
- Variables
- If / conditions
- Repeat / loops
- Text / Math / Lists
- Notifications
- Shortcuts
- macOS app opening
- Files
- Clipboard
- Calendar read
- Shared State / Sync
- agreed trigger families
- macOS host
- iPhone host
- capability/permission system
- Simulation/Test Mode
- execution logs/debugging
- automated tests

V1 does not require:
- LLVM native backend;
- package registry;
- third-party plugin marketplace;
- full debugger protocol;
- classes/inheritance;
- generics beyond built-in containers;
- user-defined native extensions.

---

## 28. Canonical compiler/editor architecture

~~~text
Blockly ──┐
          ├──> Parser/Block Lowering
Text ─────┘
                 ↓
              Typed AST
                 ↓
            Semantic checks
                 ↓
          Automation IR
                 ↓
          Bytecode / VM
                 ↓
     Capability-aware runtime
           ┌─────┴─────┐
           ↓           ↓
       Swift macOS   Swift iOS
           │           │
       Apple APIs   Apple APIs
~~~

JSON remains a project/interchange serialization format, not the long-term semantic source of truth.

---

## 29. Items intentionally reserved for later design rounds

These are explicitly deferred:
- exact grammar formalization / EBNF;
- detailed string interpolation syntax;
- collection literals;
- advanced Optional unwrapping;
- retry/backoff syntax;
- structured sync conflict handlers;
- secret/keychain types;
- custom block packaging/sharing;
- network request model;
- user-defined record/object types;
- advanced concurrency;
- package/module imports.

They will be handled as separate owner-visible design decisions before implementation.
