// Enable automatic backup
const info = await sdk.backup.getInfo();
if (info.enabled) {
    return "Already enabled";
}

const ok = await sdk.backup.enable();
if (!ok) {
    await sdk.backup.open();
}
return ok;
