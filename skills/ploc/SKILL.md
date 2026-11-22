---
name: ploc
description: >-
  Helps the user write PLOC scripts and build PLOC mini apps. PLOC is a wine cellar management app with an SDK (the `sdk` object) used by scripts (JavaScript run inside the app: list or search wines and racks, export CSV or PDF, back up, sync with Ploud, automate the cellar) and by mini apps (web pages with their own screen, opened inside PLOC). Use when the user asks for a PLOC script, automation or mini app, mentions the PLOC SDK, or pastes PLOC code to fix or explain.
---

# PLOC: scripts and mini apps

PLOC is a wine cellar management app. Its SDK (PLOC 7.0 and later) lets code read and change the cellar and drive the
app. The app injects the `sdk` object: never declare it.

## 1. Choose the path

| The user wants... | Path | Read |
|---|---|---|
| a result, an export, an automation or a one-off action, with no screen of its own | **script** | [`script/GUIDE.md`](script/GUIDE.md) |
| something to look at and interact with: screens, buttons, lists, filters, charts, a game | **mini app** | [`miniapp/GUIDE.md`](miniapp/GUIDE.md) |

- If the request says "script" or "mini app" (or "mini-app"), follow what it says.
- If it could be both, ask one question: "Do you want a script that runs once and returns a result, or a mini app
  with its own screen?" Without a preference, recommend a **script** when no interface is needed, a **mini app**
  otherwise.
- If a script turns out to need a real interface, suggest a mini app: both use the same SDK.

## 2. Always read the SDK reference first

Before writing any code that calls `sdk.*`, read [`sdk/GUIDE.md`](sdk/GUIDE.md). Rules that apply to everything:

1. **Never invent an API.** Use only methods listed in [`sdk/catalog.json`](sdk/catalog.json).
2. Read [`sdk/gotchas.md`](sdk/gotchas.md): `Collection` has no `.length`, `await` every call, return plain data.
3. Models and relations: [`sdk/data-model.md`](sdk/data-model.md). Exact fields and signatures:
   [`sdk/sdk.d.ts`](sdk/sdk.d.ts).
4. `sdk` is injected in scripts and in mini apps: do not write `const sdk` or `new SDK(...)`.
5. Do not modify or delete the user's data without an explicit request, and confirm with `sdk.dialog.confirm`.

## Files

```
sdk/       GUIDE.md, catalog.json, sdk.d.ts, sdk-scripts.d.ts, gotchas.md, data-model.md
script/    GUIDE.md, runtime.md, examples/ (25 scripts)
miniapp/   GUIDE.md, structure.md, ui-guidelines.md, icons.md, icons/, template.html, examples/
```

The assistant writes the code: it has no access to the user's cellar. Scripts are pasted into the PLOC script editor;
mini apps are web pages hosted over HTTPS and added to PLOC by their URL.
