# Script runtime

- `sdk` is provided by the app (a ready `SDK` instance). Do not write `new SDK(...)` or declare `sdk` in a script.
- The app also declares `const auth` in the same function: **do not declare `auth` either** (a common name for an
  HTTP header or token). Both would be a `SyntaxError`. See [`../sdk/gotchas.md`](../sdk/gotchas.md#reserved-names).
- The script body is wrapped in an `async` function: top-level `await` and `return` work.
- A script has no visible page. For visible output use the returned value, `sdk.dialog` and `sdk.ui`; do not rely
  on `document` or CSS.
- The returned value is the script result. Return plain data: strings, numbers, booleans, arrays and plain objects.
  Convert Collections with `.toArray()` and models with the fields you need.
- `sdk.storage` is shared with every script and mini app and synchronized with the cellar: prefix keys with the
  script name.
- Avoid loading relations in a loop over the whole cellar when you can load them once.

## Typical shapes

```js
// Read and report
const wines = await sdk.cellar.wine.getAll();
return wines.filter(w => w.bottles > 0).map(w => w.name).toArray();
```

```js
// Ask, then act
const ok = await sdk.dialog.confirm("Do it?");
if (!ok) {
    return "Cancelled";
}
// ...
```

```js
// File output
const file = await sdk.files.writeText("report.csv", csv);
if (file) {
    await sdk.ui.shareFiles(file.path);
}
```
