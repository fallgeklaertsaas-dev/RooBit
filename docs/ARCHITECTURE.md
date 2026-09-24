# RooBit Architecture — v0.1

Status: **DRAFT**

## Product direction

RooBit combines:
1. a visual Blockly editor,
2. a textual language view,
3. a platform-neutral workflow model,
4. a Rust core for validation/runtime,
5. Swift host applications for Apple-specific capabilities.

## Core principle

The visual blocks are **not** the semantic source of truth. Both visual and textual authoring should converge on one canonical language model.

```text
Visual blocks ─┐
               ├─> canonical AST / Workflow Model -> Validator -> IR/Bytecode -> Runtime
Text source  ──┘
```

For v0.1, JSON is used as the canonical interchange format so the architecture can be tested before the final parser, typed AST and bytecode format are frozen.

## Target architecture

```text
┌────────────────────────────┐
│ Blockly + TypeScript Editor│
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│ Canonical RooBit AST / IR  │
└─────────────┬──────────────┘
              │
      ┌───────┴────────┐
      ▼                ▼
 Type checker      Serializer
      │                │
      ▼                ▼
 Bytecode VM       Project files
      │
 ┌────┴──────────────┐
 ▼                   ▼
macOS Swift Host   iOS Swift Host
 │                   │
 ├ Files             ├ App Intents
 ├ Apps              ├ Shortcuts
 ├ Clipboard         ├ Notifications
 ├ Shortcuts         ├ Calendar
 ├ Calendar          └ Sync
 └ Notifications
```

## Why Rust + Swift + TypeScript

- **Rust:** language core, parser, validator, IR, bytecode/VM, portable semantics.
- **TypeScript + Blockly:** visual editor and rapid block-system iteration.
- **Swift/SwiftUI:** Apple platform permissions, App Intents, entitlements and framework bridges.
- **VS Code:** monorepo work.
- **Xcode:** Apple host applications, signing, simulator/device debugging.

## v0.1 boundaries

Implemented:
- visual editor proof
- JSON workflow format
- generated text preview
- Rust validation
- portable dry-run interpreter
- sample workflow
- documentation and test plan

Not implemented yet:
- final grammar/parser
- typed AST
- bytecode VM
- real iOS/macOS capability execution
- Swift host application projects
- App Intents
- iCloud synchronization
- persistent permission ledger

These omissions are intentional. They remain dependent on language and product decisions.
