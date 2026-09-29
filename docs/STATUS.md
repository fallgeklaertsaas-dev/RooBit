# RooBit Status / Resume File

Update this file at the end of every work session.

## Current milestone

**Milestone:** v0.1 vertical slice  
**Branch:** `feat/v0.1-vertical-slice`  
**State:** initial implementation

## What currently works

- [x] repository initialized
- [x] architecture documented
- [x] decision log created
- [x] Blockly editor scaffold
- [x] workflow JSON generation
- [x] draft textual preview generation
- [x] export JSON
- [x] Rust runtime scaffold
- [x] runtime validation
- [x] dry-run execution
- [x] example project
- [ ] run editor locally and record UI issues
- [ ] run Rust tests locally
- [ ] create Xcode macOS/iOS host projects
- [ ] decide first syntax/semantics batch

## Last known commands

```bash
git checkout feat/v0.1-vertical-slice

cd apps/editor-web
npm install
npm run dev

# second terminal
cd core/runtime
cargo test
cargo run -- ../../examples/study-mode.json
```

## Next three tasks

1. Test the visual editor and collect UX changes.
2. Decide LANG-004, LANG-005 and LANG-008 with the project owner.
3. Create the first Swift host shell after those runtime semantics are clear.

## Open blockers

None for the editor/runtime prototype.

## Resume-after-a-long-break checklist

1. Read this file.
2. Read `docs/LANGUAGE_DECISIONS.md`.
3. Run `git status` and `git log -5 --oneline`.
4. Run Rust tests.
5. Build the editor.
6. Run `examples/study-mode.json`.
7. Only then start a new task.
8. Before stopping, update this file again.

## Session log template

```md
### YYYY-MM-DD
Goal:
Changed:
Tests run:
Decision needed:
Known issue:
Next exact command:
Next exact task:
```
