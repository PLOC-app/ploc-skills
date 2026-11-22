// Print only some wines to PDF
const wines = await sdk.cellar.wine.find("Margaux");
if (wines.isEmpty) {
    return "No wine found";
}

// createFile expects an array of ids (a Collection would print everything)
const file = await sdk.pdf.createFile(wines.toArray().map(w => w.id));
if (file) {
    await sdk.ui.shareFiles(file.path);
}
