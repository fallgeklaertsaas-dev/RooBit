# RooBit v0.1 — User Guide

## Idea

RooBit is intended to let a user describe an automation visually and, when desired, inspect the same automation as text.

Example concept:

```text
[ Manual trigger ]
        │
        ▼
[ Set mode = "study" ]
        │
        ▼
[ Repeat 2 times ]
        │
        └──> [ Notify "Focus session started" ]
```

The editor exports a workflow that the RooBit runtime can validate and execute.

## Visual editor

```bash
cd apps/editor-web
npm install
npm run dev
```

The screen contains:
- Blockly workspace
- project name
- trigger selector
- JSON preview
- text preview
- export button

### Basic test

1. Keep trigger `manual`.
2. Drag a **Set variable** block into the workspace.
3. Add a **Repeat** block.
4. Put a **Notification** block inside it.
5. Click **Refresh previews**.
6. Inspect JSON and text.
7. Click **Export workflow JSON**.

## Run an exported workflow

```bash
cd core/runtime
cargo run -- /path/to/exported-workflow.json
```

v0.1 is a safe dry-run: Apple-specific actions are printed, not dispatched to system APIs yet.

## Apple integration vision

Later versions will use Swift host apps:

### macOS
- open applications
- read/write user-approved files
- clipboard
- calendar
- notifications
- Shortcuts
- selected system events

### iPhone/iPad
- App Intents
- Shortcuts exposure
- notifications
- calendar
- synchronized project state
- supported system triggers

RooBit will never assume that a capability available on macOS is automatically available on iOS.

## Current limitations

- text is generated but not parsed back yet
- no real Apple actions yet
- no final type system
- no final error model
- trigger scheduling is metadata only
- language syntax is provisional

This is expected for v0.1.
