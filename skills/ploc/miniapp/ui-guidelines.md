# UI guidelines

A mini app should feel at home next to the PLOC app.

## Layout

- **Mobile first**, one column, comfortable on a 375 px wide screen. Use `box-sizing: border-box`, flexible widths
  and `rem`/`%` instead of fixed pixel widths.
- Page padding of 16 to 20 px. Add `padding-bottom: calc(20px + env(safe-area-inset-bottom))` for the home indicator.
- Touch targets of at least 44 px. Use `<button>`, not clickable `<div>`.
- Keep the first screen useful: a short title, a one-line summary (counts, state), then the main action.
- Avoid horizontal scrolling and hover-only interactions.

## Look

- System font: `-apple-system, system-ui, Arial, sans-serif`.
- Wine-themed accent (the examples use `#7b2d42`), light card surfaces with rounded corners (12 px) and a soft shadow.
- **Support dark mode** with `prefers-color-scheme` and CSS variables (see the template). Never hardcode text
  colors on a variable background.
- Language: write the UI in the user's language. Strings in one place, so they are easy to translate.

## Feedback

- Show a loading state while waiting for the SDK, and disable buttons during an action.
- Handle three states for every list: loading, empty, error. Empty is not an error: say what to do next.
- Confirm results with `sdk.dialog.toast`, and use `sdk.haptics` sparingly for key actions.
- Ask before destructive actions with `sdk.dialog.confirm`.
- Prefer `sdk.dialog` over `alert`/`confirm`/`prompt` of the browser.

## Navigation into PLOC

Link the page to the app instead of rebuilding its screens: `sdk.ui.openWine({ id })`, `sdk.ui.openRack`,
`sdk.ui.openWines`... (see the `ui.*` entries of the catalog).

## Safety and performance

- Insert data with `textContent` or DOM APIs, never `innerHTML` with wine names, comments or tasting notes
  (they are user-written).
- Limit rendered lists (for example 50 items, then "show more") for large cellars.
- Load heavy resources (3D, charts) lazily, and prefer a few small dependencies from a CDN with a pinned version, or
  none at all.
- Do not use `alert`, `window.open` popups or full-page redirects to another domain.
