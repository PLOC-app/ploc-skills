// Storage (key/value)
// Shared by all scripts and synchronized with the cellar:
// prefix keys with your script name, and prefer small separate keys.
const runs = await sdk.storage.get("my-script.runs", 0);
await sdk.storage.set("my-script.runs", runs + 1);

if (!(await sdk.storage.has("my-script.config"))) {
    await sdk.storage.set("my-script.config", { enabled: true });
}

return runs + 1;
