// Upload a backup file
// Replace the URL with a server you trust: the backup contains the whole cellar.
const url = "https://example.com/upload";
const ok = await sdk.dialog.confirm("Upload a full backup of your cellar to " + url + "?");
if (!ok) {
    return "Cancelled";
}

try {
    const file = await sdk.backup.createBackupFile();
    if (!file) {
        return "Backup failed";
    }

    const res = await sdk.network.upload({ path: file.path, url, method: "PUT" });
    return res ? res.status : "Upload failed";
} catch (error) {
    return "Failed: " + error.message;
}
