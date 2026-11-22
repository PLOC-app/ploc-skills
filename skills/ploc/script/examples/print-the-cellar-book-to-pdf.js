// Print the cellar book to PDF
const file = await sdk.pdf.createFile();
if (!file) {
    return "Print failed";
}

await sdk.ui.shareFiles(file.path);
