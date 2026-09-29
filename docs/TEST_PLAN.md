# RooBit Test Plan

## v0.1 acceptance checks

### Editor
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] Blockly workspace renders
- [ ] every toolbox block can be dragged
- [ ] trigger selector changes exported trigger
- [ ] JSON preview updates
- [ ] text preview updates
- [ ] JSON export downloads a valid file

### Runtime
- [ ] `cargo test` succeeds
- [ ] valid example loads
- [ ] missing workflow name is rejected
- [ ] repeat count < 0 is rejected
- [ ] unknown action type is rejected by JSON deserialization
- [ ] variable set is executed in dry-run
- [ ] repeat executes children the requested number of times
- [ ] Apple actions report required capabilities

### Cross-layer
- [ ] exported editor JSON loads in Rust runtime
- [ ] block order equals action order
- [ ] nested repeat survives serialization
- [ ] text preview describes same workflow intent as JSON

## Later test layers

- parser golden tests
- AST snapshot tests
- static type checker tests
- compile-fail tests
- bytecode verifier tests
- VM conformance tests
- capability denial tests
- macOS integration tests
- App Intent tests
- sync conflict tests
- property tests / fuzzing
- migration tests for project file versions
