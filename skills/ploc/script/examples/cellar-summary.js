// Cellar summary
const info = await sdk.cellar.getInfo();
if (info.empty) {
    return "Empty cellar";
}

return `${info.counts.bottles} bottles in ${info.counts.wines} wines`;
