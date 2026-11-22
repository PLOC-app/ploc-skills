// Sync with Ploud
const ok = await sdk.ploud.syncNow();
if (!ok) {
    const info = await sdk.ploud.getInfo();
    return info.cellarLocked ? "Cellar locked, try again later" : "Sync not possible";
}

return "Sync started";
