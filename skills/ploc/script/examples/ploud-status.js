// Ploud status
const info = await sdk.ploud.getInfo();
if (info.status === sdk.ploud.STATUS.INACTIVE) {
    await sdk.ploud.open();
    return "Ploud is not enabled";
}

return info.lastSyncDate;
