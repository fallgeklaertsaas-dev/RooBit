use anyhow::{bail, Context, Result};
use serde::Deserialize;
use std::{collections::HashMap, env, fs};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Workflow {
    schema_version: u32,
    name: String,
    trigger: Trigger,
    actions: Vec<Action>,
}

#[derive(Debug, Deserialize)]
struct Trigger {
    #[serde(rename = "type")]
    kind: String,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
enum Action {
    SetVariable { name: String, value: String },
    Notify { title: String, message: String },
    RunShortcut { name: String },
    OpenApp { name: String },
    Repeat { times: i64, actions: Vec<Action> },
}

#[derive(Default)]
struct Runtime {
    variables: HashMap<String, String>,
}

fn validate(workflow: &Workflow) -> Result<()> {
    if workflow.schema_version != 1 {
        bail!("unsupported schemaVersion {}; expected 1", workflow.schema_version);
    }
    if workflow.name.trim().is_empty() {
        bail!("workflow name must not be empty");
    }

    const TRIGGERS: &[&str] = &[
        "manual",
        "shortcut",
        "app_intent",
        "calendar",
        "folder_watch",
        "app_launch",
        "schedule",
        "system_event",
    ];
    if !TRIGGERS.contains(&workflow.trigger.kind.as_str()) {
        bail!("unsupported trigger '{}'", workflow.trigger.kind);
    }

    fn validate_actions(actions: &[Action]) -> Result<()> {
        for action in actions {
            match action {
                Action::SetVariable { name, .. } if name.trim().is_empty() => {
                    bail!("variable name must not be empty")
                }
                Action::Repeat { times, actions } => {
                    if *times < 0 {
                        bail!("repeat count must be non-negative");
                    }
                    if *times > 10_000 {
                        bail!("repeat count above v0.1 safety limit (10000)");
                    }
                    validate_actions(actions)?;
                }
                _ => {}
            }
        }
        Ok(())
    }

    validate_actions(&workflow.actions)
}

fn execute_actions(runtime: &mut Runtime, actions: &[Action], depth: usize) -> Result<()> {
    let pad = "  ".repeat(depth);
    for action in actions {
        match action {
            Action::SetVariable { name, value } => {
                runtime.variables.insert(name.clone(), value.clone());
                println!("{pad}[core] set {name} = {value:?}");
            }
            Action::Notify { title, message } => {
                println!("{pad}[capability notifications.send] {title:?}: {message:?}");
            }
            Action::RunShortcut { name } => {
                println!("{pad}[capability shortcuts.run] {name:?}");
            }
            Action::OpenApp { name } => {
                println!("{pad}[capability mac.apps.open] {name:?}");
            }
            Action::Repeat { times, actions } => {
                println!("{pad}[core] repeat {times} times");
                for index in 0..*times {
                    println!("{pad}  iteration {}", index + 1);
                    execute_actions(runtime, actions, depth + 2)?;
                }
            }
        }
    }
    Ok(())
}

fn run(workflow: &Workflow) -> Result<()> {
    validate(workflow)?;
    println!("RooBit v0.1 dry-run");
    println!("workflow: {}", workflow.name);
    println!("trigger: {}", workflow.trigger.kind);

    let mut runtime = Runtime::default();
    execute_actions(&mut runtime, &workflow.actions, 0)?;
    println!("variables: {:?}", runtime.variables);
    Ok(())
}

fn main() -> Result<()> {
    let path = env::args().nth(1).context(
        "usage: cargo run -- <workflow.roobit.json>",
    )?;
    let raw = fs::read_to_string(&path)
        .with_context(|| format!("could not read workflow file: {path}"))?;
    let workflow: Workflow = serde_json::from_str(&raw)
        .with_context(|| format!("invalid RooBit workflow JSON: {path}"))?;
    run(&workflow)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn workflow(actions: Vec<Action>) -> Workflow {
        Workflow {
            schema_version: 1,
            name: "Test".into(),
            trigger: Trigger { kind: "manual".into() },
            actions,
        }
    }

    #[test]
    fn accepts_valid_workflow() {
        assert!(validate(&workflow(vec![
            Action::SetVariable { name: "mode".into(), value: "study".into() },
            Action::Repeat { times: 2, actions: vec![] }
        ])).is_ok());
    }

    #[test]
    fn rejects_negative_repeat() {
        assert!(validate(&workflow(vec![
            Action::Repeat { times: -1, actions: vec![] }
        ])).is_err());
    }

    #[test]
    fn rejects_empty_variable_name() {
        assert!(validate(&workflow(vec![
            Action::SetVariable { name: " ".into(), value: "x".into() }
        ])).is_err());
    }

    #[test]
    fn executes_portable_state() {
        let wf = workflow(vec![
            Action::SetVariable { name: "mode".into(), value: "study".into() }
        ]);
        validate(&wf).unwrap();
        let mut rt = Runtime::default();
        execute_actions(&mut rt, &wf.actions, 0).unwrap();
        assert_eq!(rt.variables.get("mode").map(String::as_str), Some("study"));
    }
}
