# Gotchas

Mistakes to avoid when writing PLOC code.

## Collections

`getAll()` and `find()` return a `Collection`, not an array.

| Do | Don't |
|---|---|
| `wines.count` | `wines.length` (undefined) |
| `wines.isEmpty` | `wines.length === 0` |
| `wines.first` / `wines.last` / `wines.at(-1)` | `wines[0]` |
| `wines.toArray()` | spreading or `Array.from` is fine, but `toArray()` is the idiom |
| `for (const w of wines)` | works (iterable) |

- `map` and `filter` return a **Collection**, not an array. End with `.toArray()` before `return`ing or JSON-ing it.
- `find(param)` takes a string (searches by `name`) or an object of criteria forwarded as is to the app: the criteria
  an object can use are not described by the SDK and may differ between iOS and Android. Prefer `getAll()` then
  `filterBy` / `filter` in JavaScript for anything beyond a name search. `findFirst` returns `null` when nothing
  matches.
- Useful helpers: `filterBy(prop, value, { ignoreCase, mode })`, `find(prop, value)`, `sortBy(prop, "asc" | "desc")`.
  `prop` accepts a dotted path (`"color.name"`).
- Methods such as `reduce`, `some`, `slice` do not exist: call `.toArray()` first.

```js
const wines = await sdk.cellar.wine.getAll();
return wines.filter(w => w.bottles > 0).sortBy("vintage", "desc").map(w => w.name).toArray();
```

## Async

- Every `sdk.*` call returns a promise: `await` it.
- Relations are loaded lazily: `await wine.getCountry()`, `getRegion()`, `getColor()`... Inside a loop over many wines
  this is slow: load the data you need once, or keep a `Map` of ids.
- `Wine` also exposes `wine.country`, `wine.color`... getters: they only return what is already loaded and are
  `null` otherwise. Prefer the `getX()` methods.

## Return values

- Errors come in two forms, handle both:
  - invalid arguments (missing path or url, wrong type...) and errors reported by the app **throw an `SDKError`**
    (`error.code`, `error.message`): wrap risky calls (network, files, backup, restore) in `try/catch`;
  - methods that return a file or a result (`files.writeText`, `network.download`, `network.request`,
    `csv.createFiles`, `pdf.createFile`, `backup.createBackupFile`...) may also return `null` when the app returns
    nothing: always test the result before using it.
- `findFirst` returns `null` when nothing matches.
- `pdf.createFile(ids)` expects an **array of ids**, not a Collection (a Collection would print everything):
  `wines.toArray().map(w => w.id)`.
- `ui.shareFiles` takes a path or an array of paths.
- `ui.openWine` takes an id or `{ id }`.

## Storage

`sdk.storage` is a key/value store **shared by all scripts and mini apps** and synchronized with the cellar:

- prefix keys with the name of your script or mini app (`"my-script.runs"`);
- prefer small separate keys over one big object;
- `get(key, defaultValue)`, `set`, `has`, `remove`.

## Dialogs and user interaction

- `sdk.dialog` has `alert`, `confirm`, `prompt`, `toast`, `pick` and `pickMany`: use them instead of `window.alert` or `prompt`.
- `prompt` returns `null`/empty when cancelled: handle it.
- Do not ask for confirmation for read-only actions.

## Dates

`Wine`, `Order` and `TastingNotes` expose `date` as a `Date` when read. Writes accept a `Date` or seconds since epoch
(not milliseconds).

## Persisting changes

Changing a model property does nothing until you call `await model.save()`. `await model.delete()` removes it.
Ask for confirmation before bulk edits or deletions, and never delete without the user asking for it.

## Reserved names

The app injects `sdk.js` and then `const auth` and `const sdk` before your code. Their names already exist in the
page (mini app) or in the function that wraps your code (script), and **redeclaring one is a `SyntaxError`**
("Identifier ... has already been declared"): the code does not run at all, and nothing warns you when you test in
a normal browser, where the SDK is not injected.

**Never declare** these names (`const`, `let`, `var`, `class`, `function`, or a function parameter at the top level):

- Always, in scripts and mini apps: `sdk`, `auth`.
- In a **mini app**, also every top-level name of `sdk.js`: the full, generated list is in
  [`reserved-names.txt`](reserved-names.txt). It contains the models (`Wine`, `Rack`, `RackItem`, `Order`, `Color`,
  `Region`, `Period`, `Document`, `Collection`...), the core classes (`SDK`, `Authorization`, `Logger`, `SDKError`),
  the services (`UIService`...), the timeout constants and the internal names starting with `_`.

Many of these are natural names in a wine app (`Order`, `Wine`, `Rack`, `Color`, `Region`, `Period`, `Document`):
do not use them for your own classes, variables or functions. Prefix your own names or use clearer ones
(`wineCard`, `RackView`, `period`).

How to stay safe:

- **Mini app**: put **all** the page code in an IIFE, `(() => { ... })();`, or in a `<script type="module">`.
  Names declared inside are local and may shadow the globals without error. Still never declare `sdk` or `auth`, not
  even inside, because that would hide the real object.
- **Script**: the code already runs inside a function; only `sdk` and `auth` are taken. Do not declare them.
- `sdk` is also available as `window.sdk` / `globalThis.sdk` (the app assigns it). Outside PLOC (normal browser) it
  is missing: test with `typeof sdk === "undefined"` (or `!window.sdk`) before using it.
- Do not load `sdk.js` yourself in a mini app: the app has already injected it and the page would fail.
- The SDK is injected in the main frame only, not in iframes.

`reserved-names.txt` is generated from `sdk.js` when the SDK changes, so it always matches this SDK version.

## Not available / not public

- `sdk.bridge`, `Authorization`, `Logger`, `SDKError` internals and anything starting with `_` are not public API.
- For network access from the SDK, use `sdk.network` (`request`, `download`, `upload`, `fetchBase64`).

## Compatibility

The SDK ships inside the app: the API available depends on the app version (SDK 1.0.0 = PLOC 7.0 and later).
When in doubt, check `SDK.versionCode` or `await sdk.app.getInfo()`.
