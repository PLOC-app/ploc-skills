// Open the first wine
const wine = (await sdk.cellar.wine.getAll()).first;
if (!wine) {
    return "No wine";
}

await sdk.ui.openWine({ id: wine.id });
