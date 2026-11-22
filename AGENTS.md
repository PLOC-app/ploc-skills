# PLOC skills

This repository contains one agent skill, `skills/ploc`, for writing code for [PLOC](https://www.ploc.co), a wine
cellar app: **scripts** and **mini apps** that use the PLOC SDK (the `sdk` object).

Start with `skills/ploc/SKILL.md`: it explains how to choose between a script and a mini app.

| Task | Read |
|---|---|
| Any code that calls `sdk.*` | `skills/ploc/sdk/GUIDE.md` |
| Write, fix or explain a PLOC script | `skills/ploc/script/GUIDE.md` |
| Build or improve a PLOC mini app | `skills/ploc/miniapp/GUIDE.md` |

## Rules for any PLOC code

1. Read `skills/ploc/sdk/GUIDE.md`, then the guide that matches the task.
2. Use only methods listed in `skills/ploc/sdk/catalog.json`. Never invent an API.
3. Read `skills/ploc/sdk/gotchas.md` before writing code (`Collection` has no `.length`, `await` every call).
4. In a script and in a mini app, `sdk` is injected by the app: never declare it.
5. A mini app must define `ploc:name` and `ploc:icon` meta tags; the icon is a name from
   `skills/ploc/miniapp/icons.md`.

## Maintaining this repository

- `skills/ploc/sdk/{catalog.json,sdk.d.ts,sdk-scripts.d.ts}` are copies of files from the public `ploc-app-js-sdk`
  repository. Do not edit them here.
- Keep the `name` in `skills/ploc/SKILL.md` equal to its folder name (`ploc`).
- Check the repository with `scripts/validate.sh`; build the zip file with `scripts/package.sh`.
- The version is the content of the `VERSION` file (`X.Y.Z`). Every pull request to `main` must increment it by hand:
  CI fails unless it is strictly greater than the latest release tag and than the `VERSION` on `main`
  (`scripts/check-version.sh`). The merge creates the release.
