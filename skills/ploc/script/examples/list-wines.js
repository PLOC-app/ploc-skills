// List wines
const wines = await sdk.cellar.wine.getAll();
for (const w of wines) {
    console.log(w.name);
}
return wines.count + " wines";
