// Wine details with its country
const wine = await sdk.cellar.wine.findFirst("Margaux");
if (!wine) {
    return "Wine not found";
}

const country = await wine.getCountry();
const region = await wine.getRegion();
return {
    name: wine.name,
    vintage: wine.vintage,
    bottles: wine.bottles,
    country: country?.name,
    region: region?.name
};
