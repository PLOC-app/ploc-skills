# Building a PLOC mini app

A mini app is a **web page** (HTML, CSS, JavaScript) that PLOC opens in its own screen and that can use the PLOC SDK
to read and act on the user's cellar.

**Always read [`../sdk/GUIDE.md`](../sdk/GUIDE.md) first**: the catalog says which methods exist and
[`../sdk/gotchas.md`](../sdk/gotchas.md) lists the usual mistakes. Never call a method that is not in the catalog.

## The two required meta tags

PLOC reads them when the mini app opens and uses them to display it. A mini app without them has no proper name or icon.

```html
<meta name="ploc:name" content="Tonight's pick">
<meta name="ploc:icon" content="puzzle">
```

- `ploc:name`: the name shown in PLOC (not `<title>`). Keep it short.
- `ploc:icon`: the name of an icon from [`icons.md`](icons.md), without `.svg`. Use only
  names from that list. When nothing fits, use `puzzle`.
- Changing one of them is picked up by the app the next time the mini app is opened: do not change them without reason.

PLOC refreshes them once per session and only when the user is signed in to a PLOC account, so a user without a
connected account will not see the name and icon update.

## Workflow

1. **Clarify the idea** in one or two questions at most: what should the user see or do, from which data (wines,
   racks, tasting notes...), read-only or editing?
2. **Pick the SDK calls** in the catalog before designing the screen, so the design only needs data that exists.
3. **Start from** [`template.html`](template.html) (or the closest of [`examples/`](examples/)).
   Keep it **a single HTML file** with inline CSS and JS unless the user already has a project.
4. **Write the page** following [`structure.md`](structure.md) and
   [`ui-guidelines.md`](ui-guidelines.md).
5. **Check**: meta tags present and valid icon, every `sdk` call awaited and in the catalog, `Collection` used
   correctly, empty and error states handled, user data inserted with `textContent` (not `innerHTML`).
6. **Explain** how to publish it: the page must be served over HTTPS on a domain the user controls, then added
   in PLOC (Mini apps). See [`structure.md`](structure.md).

## Rules

- Mobile first: the page runs in a phone webview.
- **Reserved names**: put all the page code in an IIFE and never declare `sdk`, `auth` or a name of the SDK
  (`Order`, `Wine`, `Rack`, `Color`, `Period`, `Collection`...): the page would not load.
  See [`../sdk/gotchas.md`](../sdk/gotchas.md#reserved-names).
- Handle the case where `sdk` is not available (page opened in a normal browser) with a clear message.
- Never put secrets or API keys in the page: it is public once hosted.
- Do not modify or delete user data without an explicit action from the user, and confirm destructive actions with
  `sdk.dialog.confirm`.
- Links to other sites open in the system browser; navigation inside the app stays on the mini app's own domain.

## Examples

- [`examples/tonight.html`](examples/tonight.html): picks a random wine to open, with a color filter, history kept with `sdk.storage`.
- [`examples/dashboard.html`](examples/dashboard.html): dashboard of wines, purchases and consumptions (KPIs, period filter, charts in plain HTML/CSS, demo data outside PLOC). Good model for any read-only mini app that aggregates `sdk.cellar.order` and `sdk.cellar.wine`.
- [`examples/cave-3d.html`](examples/cave-3d.html): 3D view of the racks, with a demo dataset when `sdk` is missing.
