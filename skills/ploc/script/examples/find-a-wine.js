// Find a wine
const results = await sdk.cellar.wine.find("Margaux");
return results.map(w => w.name).toArray();
