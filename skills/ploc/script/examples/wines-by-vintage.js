// Wines by vintage
const wines = await sdk.cellar.wine.getAll();
return wines
    .filter(w => w.vintage >= 2015)
    .sortBy("vintage", "desc")
    .map(w => w.vintage + " - " + w.name)
    .toArray();
