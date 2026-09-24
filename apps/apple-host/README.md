# Apple Host — planned v0.2+

The Apple host layer will be implemented in Swift/SwiftUI and will call the Rust core through a stable C-compatible boundary.

## macOS target

Planned capability adapters:
- `notifications.send`
- `shortcuts.run`
- `mac.apps.open`
- `files.read` / `files.write` for user-authorized locations
- clipboard
- EventKit calendar read
- selected trigger adapters

## iOS/iPadOS target

Planned:
- App Intents
- Shortcuts exposure
- notifications
- EventKit calendar read
- synchronized project/value store
- trigger adapters that are permitted by iOS

## Permission UX rule

1. RooBit explains why a capability is needed.
2. The host invokes the system permission prompt when supported.
3. If the user must change a setting manually, RooBit shows exact instructions.
4. A denied capability must produce a visible workflow error, not silently succeed.

## Important

No final Swift host code is committed in v0.1 because failure semantics, async semantics, platform guards and capability declarations are still owner decisions. Committing those bridges first would freeze language behavior prematurely.
