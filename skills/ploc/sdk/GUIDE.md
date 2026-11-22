# PLOC SDK

PLOC is a wine cellar management app. Its SDK (PLOC 7.0 and later) lets **scripts** and **mini apps** read and
change the cellar and drive the app. The app injects the SDK: nothing to install or bundle.

## Rules

1. **Never invent an API.** Every method you use must exist in [`catalog.json`](catalog.json)
   (key `service.method`, with `desc`, `params` and a ready-to-paste `snippet`). Search it before writing code.
2. Read [`gotchas.md`](gotchas.md) before writing code. It lists the mistakes models make most
   (`Collection` has no `.length`, `await` everywhere, etc.).
3. For models and their relations (Wine, Rack, Order, TastingNotes...), read [`data-model.md`](data-model.md).
4. For exact field names and signatures, read [`sdk.d.ts`](sdk.d.ts) (TypeScript declarations;
   `sdk-scripts.d.ts` types the `sdk` instance injected in scripts and mini apps). Do not rely on anything that is in neither the catalog
   nor these declarations. The full source is public: <https://github.com/PLOC-app/ploc-app-js-sdk>.
5. Everything is asynchronous. `await` every call to `sdk`.

## Services

`sdk.ui` · `sdk.cellar` · `sdk.network` · `sdk.dialog` · `sdk.haptics` · `sdk.clipboard` · `sdk.backup` · `sdk.ploud` ·
`sdk.csv` · `sdk.pdf` · `sdk.files` · `sdk.translations` · `sdk.miniApps` · `sdk.account` · `sdk.app` · `sdk.storage`

`sdk.cellar` exposes one repository per model: `wine`, `rack`, `order`, `tastingNotes`, `document`, `country`,
`region`, `appellation`, `grape`, `classification`, `color`, `bottleFormat`, `vendor`, `owner`, `parameter`.
Each has `get`, `getAll`, `find` and `findFirst`. `sdk.cellar.getInfo()` returns counts and an `empty` flag.

## Finding a method in the catalog

Catalog keys: `ui.openWine`, `cellar.wine.getAll`, `Wine#save` (instance method), `Model#save` (inherited, generic).
Search with `grep`, for example:

```bash
grep -n '"cellar\.' catalog.json
grep -n -i 'pdf' catalog.json
```

## Environment

- **Script**: `sdk` is already defined. Whatever the script `return`s is its result. See [`../script/GUIDE.md`](../script/GUIDE.md).
- **Mini app**: a web page opened inside PLOC. See [`../miniapp/GUIDE.md`](../miniapp/GUIDE.md).
- Outside PLOC (a regular browser), the SDK falls back to a mock gateway: `sdk.isMock` is `true` and native calls
  (files, backup, Ploud...) are not available. Useful to test the layout of a mini app.
- Runtime info: `SDK.version`, `SDK.versionCode`, `await sdk.app.getInfo()`.

## Keeping the catalog up to date

`catalog.json`, `sdk.d.ts` and `sdk-scripts.d.ts` in this folder are copies of files from the public repository
(`catalog/catalog.json`, `types/`). They are refreshed automatically when the SDK changes.
`sdkVersion` is written at the top of the catalog.
