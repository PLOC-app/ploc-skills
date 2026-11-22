// Search a wine and open it
const text = await sdk.dialog.prompt({
    title: "Search",
    message: "Wine name?",
    placeholder: "Margaux"
});
if (!text) {
    return "Cancelled";
}

const wine = await sdk.cellar.wine.findFirst(text);
if (!wine) {
    await sdk.dialog.alert("No wine found for \"" + text + "\".");
    return;
}

await sdk.ui.openWine(wine.id);
