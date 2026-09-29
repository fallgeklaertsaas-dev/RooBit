# RooBit

RooBit is an experimental **visual + textual automation language for iPhone and macOS**. The long-term goal is a low-code Apple automation environment in which users can compose workflows as blocks, inspect/edit a textual representation, validate them through a typed language core, and execute supported actions through Apple host apps.

## v0.1 goal

This branch is deliberately a **vertical slice**, not the final language design.

It proves this chain:

```text
Blockly editor
    ↓
RooBit workflow model / JSON
    ↓
validation
    ↓
draft text representation
    ↓
Rust runtime (dry-run + portable semantics)
    ↓
future Swift host bridges
    ├─ macOS
    └─ iOS
```

Language syntax and semantics are marked **DRAFT** until explicitly accepted by the project owner.

## What you can test now

### 1. Visual editor

Requirements: Node.js 20+.

```bash
cd apps/editor-web
npm install
npm run dev
```

Open the local URL shown by Vite.

You can:
- assemble blocks
- choose a trigger
- add notification / shortcut / open-app / variable / repeat actions
- inspect generated workflow JSON
- inspect a generated draft textual form
- export a workflow JSON file

### 2. Rust runtime

Requirements: current stable Rust.

```bash
cd core/runtime
cargo run -- ../../examples/study-mode.json
```

The v0.1 runtime validates the workflow and performs a **safe dry-run**. It executes portable language semantics such as variables/repeat and prints Apple capability calls that will later be dispatched through Swift host bridges.

### 3. Tests

```bash
cd core/runtime
cargo test

cd ../../apps/editor-web
npm install
npm run build
```

## Repository map

```text
apps/
  editor-web/       Blockly + TypeScript visual editor
  apple-host/       Apple host integration design / Xcode handoff
core/
  runtime/          Rust validator + interpreter prototype
docs/
  ARCHITECTURE.md
  LANGUAGE_DECISIONS.md
  USER_GUIDE.md
  STATUS.md
  TEST_PLAN.md
examples/
  study-mode.json
```

## Project rule

Any choice that changes the observable behavior of the language—syntax, semantics, type rules, error behavior, platform behavior, or capability behavior—must be proposed and then explicitly decided by the project owner before being marked `ACCEPTED`.

See [docs/LANGUAGE_DECISIONS.md](docs/LANGUAGE_DECISIONS.md).
