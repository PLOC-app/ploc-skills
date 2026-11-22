// Export to CSV and share the files
const files = await sdk.csv.createFiles();
if (!files) {
    return "Export failed";
}

await sdk.ui.shareFiles(files.map(f => f.path));
