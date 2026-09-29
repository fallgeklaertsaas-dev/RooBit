# RooBit Language Decision Log

This file is the authority for language-design decisions.

## Status vocabulary

- `OPEN`: owner decision required.
- `DRAFT`: provisional implementation exists so it can be tested.
- `ACCEPTED`: explicitly chosen by the project owner or delegated to the previously stated recommendation.
- `REJECTED`: explicitly rejected.
- `SUPERSEDED`: replaced by a later decision.

Detailed baseline: [LANGUAGE_SPEC_V1_DRAFT.md](LANGUAGE_SPEC_V1_DRAFT.md)

---

## LANG-001 — Two authoring modes
**Status:** ACCEPTED

Visual Blockly authoring and textual authoring are both first-class and map bidirectionally through one canonical AST.

---

## LANG-002 — Textual syntax direction
**Status:** ACCEPTED WITH FINAL GRAMMAR REVIEW PENDING

Owner-selected direction includes:
- automation declaration with parenthesis body;
- `#` line comments and `/* ... */` block comments;
- Python-like `if / elif / else` readability;
- owner-selected parenthesis/double-parenthesis control examples;
- natural-language trigger syntax.

Exact EBNF and delimiter consistency will be finalized before parser freeze, without changing accepted semantics.

---

## LANG-003 — Canonical representation
**Status:** ACCEPTED

Editor views converge on a typed AST, which lowers to a separate Automation IR and then bytecode/VM. JSON is serialization/interchange, not the semantic source of truth.

---

## LANG-004 — Variables
**Status:** ACCEPTED

- `let`: immutable
- `var`: mutable
- assignment uses `=`
- lexical scope
- local type inference by default
- optional explicit type annotations

---

## LANG-005 — Conditions
**Status:** ACCEPTED

- Bool accepted directly
- numeric `1` accepted as true
- numeric `0` accepted as false
- no general truthy/falsy coercion
- short-circuit logical operators
- `if / elif / else`

---

## LANG-006 — Comparisons / predicates
**Status:** ACCEPTED

Classical operators plus readable predicates:
- `== != < > <= >=`
- `is`
- `contains`
- `exists`

`=` remains assignment.

---

## LANG-007 — Loops
**Status:** ACCEPTED

- `repeat`
- `for`
- `while`
- runtime safety guard
- default Safe/Standard loop ceiling: 10,000 iterations
- exceeding the ceiling produces a visible `LoopLimitExceeded` error

---

## LANG-008 — Functions and actions
**Status:** ACCEPTED

- `function` for reusable computational units
- `action` for reusable automation units/capability side effects
- `return` for return values
- `-> Type` for return annotations
- `++` for Text concatenation

---

## LANG-009 — Failure model
**Status:** ACCEPTED

- unhandled error stops the affected workflow
- visual optional error branch
- text `try/catch`
- explicit retry / skip / continue policies may be configured
- silent failure is not the default

---

## LANG-010 — Async / concurrency
**Status:** ACCEPTED

- sequential automation steps implicitly wait for completion
- no ordinary explicit `await` required
- explicit `parallel` construct for concurrency
- timeout is a normal RooBit error

---

## LANG-011 — Platform-specific semantics
**Status:** ACCEPTED

- explicit `on mac` / `on iphone` platform blocks
- platform-only action in a cross-platform/Ecosystem project outside a guard is a compile-time error
- a platform-specific project may omit the redundant guard
- unsupported actions are never silently skipped by default

---

## LANG-012 — Device communication
**Status:** ACCEPTED

- personal aliases: `iphone`, `mac`
- message concept such as `iphone.send("study.started")`
- receiving handler such as `on message "study.started"`
- named device addressing may use `device("My Mac")`
- remote workflow execution may use `run StudySetup on mac`

---

## LANG-013 — Shared / synchronized state
**Status:** ACCEPTED

Both forms:
- `sync.get/set`
- `shared var`

Scalar conflicts use deterministic last-committed-write-wins based on sync-service commit order. Updates are versioned.

---

## LANG-014 — Trigger model
**Status:** ACCEPTED

Families:
- manual
- Shortcut
- App Intent
- calendar
- folder watch
- app launch
- schedule
- system event

Preferred textual style: naturally readable `when ...`.

---

## LANG-015 — Capabilities / permissions
**Status:** ACCEPTED

- compiler infers capabilities automatically
- capability manifest generated automatically
- user can inspect manifest
- first execution requires capability review/confirmation
- new capabilities added later show a diff and require confirmation
- manual OS changes receive guided instructions

---

## LANG-016 — Type system
**Status:** ACCEPTED

Static typing with local inference and optional annotations.

V1 core/domain types are defined in LANGUAGE_SPEC_V1_DRAFT.md.

Missing values use `Optional<T>` / `T?`, with readable `exists` checks.

---

## LANG-017 — Text ↔ Blockly synchronization
**Status:** ACCEPTED

```text
Blocks ⇄ AST ⇄ Text
```

If valid source has no built-in block, RooBit creates a Generic/Custom Code Block. Users may assign name, color and visual form while preserving validated semantics.

---

## LANG-018 — Visual organization
**Status:** ACCEPTED

Initial categories:
Triggers, Logic, Variables, Data, Text, Math, Lists, Time, Device, iPhone, Mac, Files, Calendar, Notifications, Shortcuts, Apps, Network, Sync, Advanced.

Visual direction: Apple-like reduced, with subdued accents.

---

## LANG-019 — Project packaging
**Status:** ACCEPTED

User sees one `.roobit` project package. Internally it may contain project metadata, source/workflows, assets and permissions.

---

## LANG-020 — Project kinds
**Status:** ACCEPTED

- Automation: one focused task/workflow
- Ecosystem: multiple automations + devices + shared state + triggers + remote actions

Future RooBit-owned desktop stickers/status cards are allowed design space for Ecosystem UI output.

---

## LANG-021 — Security levels
**Status:** ACCEPTED

- Safe
- Standard
- Advanced

Use least privilege and just-in-time explanations. High-risk/destructive actions may require explicit confirmation. Repeated confirmation before every harmless action is not a security guarantee and is avoided to reduce confirmation fatigue.

---

## LANG-022 — Debugging
**Status:** ACCEPTED

V1 includes:
- live execution visualization
- completed/current/failing block status
- execution logs
- step-by-step
- pause/resume
- retry
- skip/stop where policy allows

---

## LANG-023 — Simulation mode
**Status:** ACCEPTED

Default simulation validates and dry-runs side effects. It does not modify files, send external messages/notifications, run shell commands, perform destructive operations or write network requests.

Optional Live Read may access real read-only data after normal permission grants.

---

## LANG-024 — V1 definition of done
**Status:** ACCEPTED

V1 scope includes visual + text editors, bidirectional sync, language basics, Apple automation capabilities, cross-device shared state, agreed triggers, macOS+iPhone hosts, permission system, simulation, debugging/logs and automated tests.

LLVM backend, registry/marketplace and advanced language features are post-V1.
