// Ask before synchronizing
const ok = await sdk.dialog.confirm("Synchronize with Ploud now?");
if (!ok) {
    return "Cancelled";
}

return await sdk.ploud.syncNow();
