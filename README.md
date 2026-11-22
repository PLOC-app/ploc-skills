# ploc-skills

[![Release](https://img.shields.io/github/v/release/PLOC-app/ploc-skills)](https://github.com/PLOC-app/ploc-skills/releases/latest)

A skill that helps an AI assistant write **scripts** and **mini apps** for [PLOC](https://www.ploc.co), the wine
cellar app, using the [PLOC SDK](https://github.com/PLOC-app/ploc-app-js-sdk).

One skill, [`ploc`](skills/ploc/SKILL.md), covers:

- **scripts**: writes, fixes and explains PLOC scripts (25 examples);
- **mini apps**: designs and builds a mini app (template, UI guidelines, `ploc:name` / `ploc:icon`, icon list);
- **SDK reference**: API catalog, TypeScript types, data model and common mistakes, shared by both.

## Install

### Option 1: download the latest release (recommended)

1. Download [`ploc.zip`](https://github.com/PLOC-app/ploc-skills/releases/latest/download/ploc.zip) (always the latest
   release).
2. Unzip it: you get a **`ploc`** folder.
3. Put that folder in the skills folder of your tool (table below).

Example for Claude Code:

```bash
unzip ploc.zip -d ~/.claude/skills/
```

### Option 2: with git

```bash
git clone https://github.com/PLOC-app/ploc-skills.git
cp -R ploc-skills/skills/ploc ~/.claude/skills/
```

Pull and copy again to update.

### Skills folder by tool

| Tool | Skills folder |
|---|---|
| **Claude Code** (terminal, desktop app "Code" tab) | `~/.claude/skills/` for all projects, or `.claude/skills/` in one project |
| **OpenAI Codex** | `.agents/skills/` in your project (see the [Codex documentation](https://developers.openai.com/codex/skills)) |
| **Gemini CLI** | see the [Gemini CLI skills documentation](https://geminicli.com/docs/cli/skills/) |
| **Claude chat** (claude.ai, desktop "Chat" tab) | import `ploc.zip` as is in the settings, do not unzip it |
| Other tools that support `SKILL.md` | see their documentation: the format is the open [Agent Skills](https://agentskills.io/) standard |

Then **start a new session**: skills are loaded when a session starts.

## Use

Just ask, the skill is picked from your request:

> Write me a PLOC script that lists my red wines older than 5 years.

> Build a PLOC mini app that picks a random wine for tonight.

In Claude Code you can also call it by name: `/ploc ...`.

The assistant writes the code, it does not have access to your cellar. Paste a script into the PLOC script editor
to run it. A mini app is a web page you host over HTTPS and add to PLOC by its URL.

For tools without skill support, give the assistant the contents of [`AGENTS.md`](AGENTS.md) and of the files it
points to.

## Repository layout

```
skills/ploc/
├── SKILL.md         entry point: choose script or mini app
├── sdk/             GUIDE.md, catalog.json, sdk.d.ts, sdk-scripts.d.ts, reserved-names.txt, gotchas.md, data-model.md
├── script/          GUIDE.md, runtime.md, examples/*.js
└── miniapp/         GUIDE.md, structure.md, ui-guidelines.md, icons.md, icons/, template.html, examples/*.html
scripts/package.sh   builds dist/ploc.zip (with the LICENSE)
AGENTS.md            instructions for tools that read it instead of SKILL.md
```

## Maintenance

- `catalog.json`, `sdk.d.ts`, `sdk-scripts.d.ts` and `reserved-names.txt` in `skills/ploc/sdk/` are copies or extracts of files from
  [ploc-app-js-sdk](https://github.com/PLOC-app/ploc-app-js-sdk) (`catalog/catalog.json`, `types/`). Do not edit them
  here: they are refreshed when the SDK changes (`sdkVersion` is at the top of the catalog).
- The icons in `skills/ploc/miniapp/icons/` come from the PLOC app. Update them and `miniapp/icons.md` together.
- **Releasing**: the version is the single line of the [`VERSION`](VERSION) file (`X.Y.Z`).
  1. Increment `VERSION` by hand in your pull request to `main` (semantic versioning: `X.Y.Z`).
  2. The `CI` workflow validates the skill and **fails unless `VERSION` is strictly greater than the latest release
     tag and than the `VERSION` on `main`** ([`scripts/check-version.sh`](scripts/check-version.sh)).
  3. When the pull request is merged, the `Release` workflow creates the tag and a GitHub release with `ploc.zip`.
- Locally: `scripts/validate.sh` checks the repository, `scripts/package.sh` builds `dist/ploc.zip`.
- In the GitHub settings, protect `main` and require the `CI` check, so a failing check blocks the merge.

## License

See [LICENSE](LICENSE).
