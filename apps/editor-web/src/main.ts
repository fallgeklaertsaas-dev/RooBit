import * as Blockly from "blockly";
import "./style.css";

type TriggerKind =
  | "manual"
  | "shortcut"
  | "app_intent"
  | "calendar"
  | "folder_watch"
  | "app_launch"
  | "schedule"
  | "system_event";

type Action =
  | { type: "set_variable"; name: string; value: string }
  | { type: "notify"; title: string; message: string }
  | { type: "run_shortcut"; name: string }
  | { type: "open_app"; name: string }
  | { type: "repeat"; times: number; actions: Action[] };

type Workflow = {
  schemaVersion: 1;
  name: string;
  trigger: { type: TriggerKind };
  actions: Action[];
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="shell">
    <header>
      <strong>RooBit</strong>
      <input id="projectName" value="My Automation" aria-label="Project name" />
      <select id="trigger" aria-label="Trigger">
        <option value="manual">Manual</option>
        <option value="shortcut">Shortcut button</option>
        <option value="app_intent">App Intent</option>
        <option value="calendar">Calendar based</option>
        <option value="folder_watch">Folder watch (macOS)</option>
        <option value="app_launch">App launch</option>
        <option value="schedule">Schedule</option>
        <option value="system_event">System event</option>
      </select>
      <button class="secondary" id="refresh">Refresh previews</button>
      <button class="primary" id="export">Export workflow JSON</button>
    </header>
    <main>
      <div id="blocklyDiv"></div>
      <aside class="panel">
        <p class="note">v0.1: syntax and semantics are intentionally provisional.</p>
        <section class="card"><h2>Draft text view</h2><pre id="textPreview"></pre></section>
        <section class="card"><h2>Canonical v0.1 JSON</h2><pre id="jsonPreview"></pre></section>
      </aside>
    </main>
  </div>
`;

Blockly.defineBlocksWithJsonArray([
  {
    type: "rb_set_variable",
    message0: "set %1 to %2",
    args0: [
      { type: "field_input", name: "NAME", text: "mode" },
      { type: "field_input", name: "VALUE", text: "study" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 330
  },
  {
    type: "rb_notify",
    message0: "notify title %1 message %2",
    args0: [
      { type: "field_input", name: "TITLE", text: "RooBit" },
      { type: "field_input", name: "MESSAGE", text: "Done" }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 25
  },
  {
    type: "rb_shortcut",
    message0: "run Shortcut %1",
    args0: [{ type: "field_input", name: "NAME", text: "Study Mode" }],
    previousStatement: null,
    nextStatement: null,
    colour: 210
  },
  {
    type: "rb_open_app",
    message0: "open macOS app %1",
    args0: [{ type: "field_input", name: "NAME", text: "Safari" }],
    previousStatement: null,
    nextStatement: null,
    colour: 210
  },
  {
    type: "rb_repeat",
    message0: "repeat %1 times",
    args0: [{ type: "field_number", name: "TIMES", value: 2, min: 0, precision: 1 }],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
    colour: 120
  }
]);

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Logic & Flow",
      colour: "120",
      contents: [{ kind: "block", type: "rb_repeat" }]
    },
    {
      kind: "category",
      name: "Variables",
      colour: "330",
      contents: [{ kind: "block", type: "rb_set_variable" }]
    },
    {
      kind: "category",
      name: "Apple Actions",
      colour: "210",
      contents: [
        { kind: "block", type: "rb_notify" },
        { kind: "block", type: "rb_shortcut" },
        { kind: "block", type: "rb_open_app" }
      ]
    }
  ]
};

const workspace = Blockly.inject("blocklyDiv", {
  toolbox,
  trashcan: true,
  scrollbars: true,
  zoom: { controls: true, wheel: true, startScale: 0.95 }
});

function actionFromBlock(block: Blockly.Block): Action | null {
  switch (block.type) {
    case "rb_set_variable":
      return {
        type: "set_variable",
        name: block.getFieldValue("NAME"),
        value: block.getFieldValue("VALUE")
      };
    case "rb_notify":
      return {
        type: "notify",
        title: block.getFieldValue("TITLE"),
        message: block.getFieldValue("MESSAGE")
      };
    case "rb_shortcut":
      return { type: "run_shortcut", name: block.getFieldValue("NAME") };
    case "rb_open_app":
      return { type: "open_app", name: block.getFieldValue("NAME") };
    case "rb_repeat": {
      const nested: Action[] = [];
      let child = block.getInputTargetBlock("DO");
      while (child) {
        const action = actionFromBlock(child);
        if (action) nested.push(action);
        child = child.getNextBlock();
      }
      return { type: "repeat", times: Number(block.getFieldValue("TIMES")), actions: nested };
    }
    default:
      return null;
  }
}

function readWorkflow(): Workflow {
  const actions: Action[] = [];
  const tops = workspace.getTopBlocks(true);
  for (const top of tops) {
    let block: Blockly.Block | null = top;
    while (block) {
      const action = actionFromBlock(block);
      if (action) actions.push(action);
      block = block.getNextBlock();
    }
  }
  return {
    schemaVersion: 1,
    name: (document.querySelector<HTMLInputElement>("#projectName")!.value || "Untitled").trim(),
    trigger: { type: document.querySelector<HTMLSelectElement>("#trigger")!.value as TriggerKind },
    actions
  };
}

const q = (s: string) => JSON.stringify(s);

function actionToText(action: Action, indent = "  "): string {
  switch (action.type) {
    case "set_variable":
      return `${indent}set ${action.name} = ${q(action.value)}`;
    case "notify":
      return `${indent}notify ${q(action.title)} ${q(action.message)}`;
    case "run_shortcut":
      return `${indent}shortcut.run ${q(action.name)}`;
    case "open_app":
      return `${indent}mac.app.open ${q(action.name)}`;
    case "repeat": {
      const body = action.actions.map(a => actionToText(a, indent + "  ")).join("\n");
      return `${indent}repeat ${action.times} {\n${body}\n${indent}}`;
    }
  }
}

function toDraftText(w: Workflow): string {
  const body = w.actions.map(a => actionToText(a)).join("\n");
  return `automation ${q(w.name)} {\n  trigger ${w.trigger.type}\n${body ? body + "\n" : ""}}`;
}

function refresh() {
  const workflow = readWorkflow();
  document.querySelector("#jsonPreview")!.textContent = JSON.stringify(workflow, null, 2);
  document.querySelector("#textPreview")!.textContent = toDraftText(workflow);
}

workspace.addChangeListener(() => refresh());
document.querySelector("#projectName")!.addEventListener("input", refresh);
document.querySelector("#trigger")!.addEventListener("change", refresh);
document.querySelector("#refresh")!.addEventListener("click", refresh);

document.querySelector("#export")!.addEventListener("click", () => {
  const workflow = readWorkflow();
  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${workflow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "workflow"}.roobit.json`;
  a.click();
  URL.revokeObjectURL(url);
});

refresh();
