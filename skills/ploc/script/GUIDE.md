# Writing a PLOC script

A script is plain JavaScript run by the PLOC app. `sdk` is already defined (do not create it), the code runs in an
async context (top-level `await` works), and **what the script `return`s is its result**.

**Always read [`../sdk/GUIDE.md`](../sdk/GUIDE.md) first**: its catalog tells you which methods exist, and
[`../sdk/gotchas.md`](../sdk/gotchas.md) lists the usual mistakes (`Collection` has no `.length`, `await` everything, `return` arrays with `.toArray()`).

## Workflow

1. **Understand the goal.** Ask one question only if something blocks you (what should be returned or shown? which
   wines?). Otherwise pick sensible defaults and say which.
2. **Find the methods** in [`../sdk/catalog.json`](../sdk/catalog.json), and the closest example in [`examples/`](examples/).
   Start from the example when one fits.
3. **Write the script**:
   - no `import`, no `require`, no `sdk` declaration;
   - `await` every `sdk` call;
   - test results that can be `null` or `false` and return a short message;
   - end with `return <value>` (string, number, array, plain object) or a UI call (`sdk.dialog`, `sdk.ui`);
   - keep it short and readable, with comments only where the intent is not obvious.
4. **Protect the user's data.** For scripts that change or delete data (`save`, `delete`, `consume`, bulk edits), ask
   for confirmation with `sdk.dialog.confirm` first and say what will change. Read-only scripts need no confirmation.
5. **Explain briefly**: what it does, what it returns, and how to run it in PLOC. Mention app features it needs
   (Ploud enabled, backups, etc.).

## Reply format

Give the full script in one `js` block, then 2 to 4 lines of explanation. Do not add TypeScript or wrap it in a
function. To get editor autocompletion, the user can reference `sdk.d.ts` and `sdk-scripts.d.ts`
(copies in [`../sdk/`](../sdk/), originals in <https://github.com/PLOC-app/ploc-app-js-sdk>, folder `types/`).

More about the environment: [`runtime.md`](runtime.md).

## Fixing an existing script

Check, in this order: method names against the catalog, missing `await`, `.length` on a `Collection`, missing
`return`, unchecked `null` results, wrong argument shape (ids vs Collection, see gotchas).

## Examples

Ready-to-adapt scripts:

- [anonymous-user-id.js](examples/anonymous-user-id.js): Anonymous user id
- [app-info.js](examples/app-info.js): App info
- [ask-before-synchronizing.js](examples/ask-before-synchronizing.js): Ask before synchronizing
- [backup-status.js](examples/backup-status.js): Backup status
- [cellar-summary.js](examples/cellar-summary.js): Cellar summary
- [enable-automatic-backup.js](examples/enable-automatic-backup.js): Enable automatic backup
- [export-to-csv-and-share-the-files.js](examples/export-to-csv-and-share-the-files.js): Export to CSV and share the files
- [export-to-csv-and-upload-the-files.js](examples/export-to-csv-and-upload-the-files.js): Export to CSV and upload the files
- [find-a-wine.js](examples/find-a-wine.js): Find a wine
- [list-racks.js](examples/list-racks.js): List racks
- [list-wines.js](examples/list-wines.js): List wines
- [open-the-first-wine.js](examples/open-the-first-wine.js): Open the first wine
- [ploud-status.js](examples/ploud-status.js): Ploud status
- [print-only-some-wines-to-pdf.js](examples/print-only-some-wines-to-pdf.js): Print only some wines to PDF
- [print-the-cellar-book-to-pdf.js](examples/print-the-cellar-book-to-pdf.js): Print the cellar book to PDF
- [rack-occupancy.js](examples/rack-occupancy.js): Rack occupancy
- [read-a-downloaded-file.js](examples/read-a-downloaded-file.js): Read a downloaded file
- [restore-a-backup-from-a-url.js](examples/restore-a-backup-from-a-url.js): Restore a backup from a URL
- [search-a-wine-and-open-it.js](examples/search-a-wine-and-open-it.js): Search a wine and open it
- [storage-key-value.js](examples/storage-key-value.js): Storage (key/value)
- [sync-with-ploud.js](examples/sync-with-ploud.js): Sync with Ploud
- [upload-a-backup-file.js](examples/upload-a-backup-file.js): Upload a backup file
- [wine-details-with-its-country.js](examples/wine-details-with-its-country.js): Wine details with its country
- [wines-by-vintage.js](examples/wines-by-vintage.js): Wines by vintage
- [write-a-file-and-share-it.js](examples/write-a-file-and-share-it.js): Write a file and share it
