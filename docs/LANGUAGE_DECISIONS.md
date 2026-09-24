# RooBit Language Decision Log

This file is the authority for language-design decisions.

## Status vocabulary

- `OPEN`: owner decision required.
- `DRAFT`: provisional implementation exists so it can be tested.
- `ACCEPTED`: explicitly chosen by the project owner.
- `REJECTED`: explicitly rejected.
- `SUPERSEDED`: replaced by a later decision.

---

## LANG-001 — Two authoring modes
**Status:** ACCEPTED

RooBit supports both visual block authoring and textual authoring.

Constraint: both forms must map to the same canonical semantic model.

---

## LANG-002 — v0.1 textual syntax
**Status:** DRAFT

Current generated preview:

```roobit
automation "Study Mode" {
  trigger manual
  set mode = "study"
  repeat 2 {
    notify "RooBit" "Focus session started"
  }
}
```

Open decisions:
- keyword names
- braces vs indentation
- statement terminators
- string interpolation
- declarations
- mutability syntax
- function syntax

No compatibility promise exists for v0.1 syntax.

---

## LANG-003 — Canonical representation
**Status:** DRAFT

v0.1 uses JSON as interchange format. Long-term candidates:
- typed AST only
- AST + serialized project format
- AST lowered to a separate Automation IR

Recommended long-term direction: AST + separate IR.

---

## LANG-004 — Variables
**Status:** OPEN

Questions:
1. immutable-by-default (`let`) or mutable-by-default?
2. separate `let` / `var`?
3. explicit types or inference?
4. scope: lexical blocks?
5. what happens when a variable is missing?

v0.1 JSON supports a simple runtime variable map only.

---

## LANG-005 — Conditions
**Status:** OPEN

Questions:
- only `Bool` accepted, or truthy/falsy values?
- short-circuit `and/or`?
- equality coercion?
- comparison rules across number types?

---

## LANG-006 — Repeat / loops
**Status:** DRAFT

v0.1 supports counted repeat with a non-negative integer.

Open:
- maximum default iteration count
- while loops
- foreach semantics
- cancellation behavior
- async actions inside loops

---

## LANG-007 — Platform-specific actions
**Status:** OPEN

Example: `open app` or `file write` exists on macOS but may not be available on iOS.

Candidate semantics:
A. compile-time error
B. runtime error
C. silently skip
D. require explicit platform guard such as `on mac`

No final choice yet.

---

## LANG-008 — Failure model
**Status:** OPEN

Choices to decide:
- exceptions
- Result-style values
- error edges/blocks
- implicit stop-on-error
- configurable policies

This affects visual block design substantially.

---

## LANG-009 — Async/concurrency
**Status:** OPEN

Apple automations are naturally asynchronous. We need to decide:
- implicit sequential await
- explicit `await`
- parallel blocks
- cancellation
- timeout semantics

---

## LANG-010 — Capabilities / permissions
**Status:** ACCEPTED at product level, semantics DRAFT

RooBit has an explicit capability system. The host must explain and request permissions where APIs allow it, and provide guided instructions where manual OS actions are required.

Open:
- declaration syntax
- compile-time capability inference
- whether undeclared capability use is an error
- per-project vs global grants

---

## LANG-011 — Trigger model
**Status:** ACCEPTED at product level

Projects may choose:
- manual
- Shortcut button
- App Intent
- calendar-based
- folder observation (macOS)
- app launch
- schedule
- system event

Exact semantics and platform availability remain DRAFT.

---

## LANG-012 — Type system
**Status:** OPEN

Needs separate design session before implementation.

Candidate v1 types:
- Bool
- Int
- Decimal
- Text
- List<T>
- Optional<T>
- DateTime
- Duration
- URL
- File
- CalendarEvent
- Device/Platform

Questions:
- static vs gradual typing
- inference
- nullability
- numeric conversions
- generic containers
- user-defined types
