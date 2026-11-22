// Write a file and share it
const csv = "name;vintage\nChâteau Margaux;2015\n";
const file = await sdk.files.writeText("wines.csv", csv);
if (!file) {
    return "Write failed";
}

// Do not delete the file here: the share sheet may still be using it.
await sdk.ui.shareFiles(file.path);
