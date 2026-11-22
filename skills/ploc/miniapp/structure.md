# Mini app structure and hosting

## What a mini app is

A web page served over **HTTPS** and added to PLOC by its URL. PLOC opens it in its own screen, injects the SDK in
the page, and asks the user to allow what the mini app may do.

What the apps (iOS and Android) enforce:

- the page must be on `https` (port 443);
- navigation stays on the **same domain** as the mini app; links to other `http(s)`, `mailto:` and `tel:` URLs open
  outside the mini app (system browser, mail, phone), and other schemes are ignored;
- the user needs a connected PLOC account for the mini app name and icon to be refreshed;
- after the first load, PLOC reads `ploc:name` and `ploc:icon` and updates the mini app entry if they changed.

## Files

One HTML file is enough:

```
index.html     all markup, CSS and JS inline
```

For something larger, keep static files next to it (`app.js`, `style.css`, images) on the same domain. Avoid build
steps unless the user already has a toolchain.

## Page skeleton

See [`template.html`](template.html). Required parts:

1. `<meta name="viewport" ... viewport-fit=cover>` for mobile.
2. `ploc:name` and `ploc:icon` meta tags (see [`icons.md`](icons.md)).
3. An `init()` that checks `sdk` is available, loads data, renders, and catches errors.

Wrap the page code in an IIFE `(() => { ... })();` so its names cannot collide with the SDK globals (see below).

## The `sdk` object and reserved names

- PLOC injects `sdk.js`, then `const auth` and `const sdk`, in the main frame before the page runs. Use `sdk`
  directly: `await sdk.cellar.getInfo()`.
- Do **not** declare `sdk` or `auth`, and none of the top-level names of `sdk.js` (`Order`, `Wine`, `Rack`, `Color`,
  `Period`, `Collection`...): the page would fail with a `SyntaxError`. The full list and the rules are in
  [`../sdk/gotchas.md`](../sdk/gotchas.md#reserved-names).
- `sdk` is also available as `window.sdk` / `globalThis.sdk`. Outside PLOC it is missing: test with
  `typeof sdk === "undefined"`.
- In a normal browser, `sdk` is missing. Guard with `typeof sdk === "undefined"` and show a message, or fall back to
  demo data (see `examples/dashboard.html`).
- Do not load `sdk.js` yourself in the page: the app has already injected it.
- The SDK is not injected in iframes.

## Data and state

- Read data with `sdk.cellar.*` (see the catalog). `Collection` rules apply (`.count`, `.toArray()`, no `.length`).
- Keep the mini app state in `sdk.storage` (shared key/value store synchronized with the cellar). **Prefix keys**
  with the mini app name (`"tonight.history"`) and keep values small.
- Use `localStorage` only for purely local UI preferences.
- Cache what is expensive (for example lookups per wine) in a `Map` instead of calling the SDK in a loop.

## Hosting

Any static HTTPS host works (GitHub Pages, Netlify, Cloudflare Pages, a personal server). The URL is what the user
adds in PLOC. The page is public to anyone who has the URL: **no secrets, no private data in the files**; the cellar
data only reaches the page through the SDK, inside the app.

Public mini apps shared by the community: <https://github.com/PLOC-app/ploc-miniapps>.

## Testing

1. **Layout**: open the file in a desktop browser (mobile viewport). `sdk` is missing, so the page must show its
   fallback or demo data.
2. **Logic and data**: open it from PLOC on a device with a test cellar.
3. Check dark mode and a small screen.
