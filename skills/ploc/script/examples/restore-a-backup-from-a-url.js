// Restore a backup from a URL
// Replace the URL with the backup you want to restore.
const ok = await sdk.dialog.confirm("Restore this backup? It replaces the current cellar.");
if (!ok) {
    return "Cancelled";
}

try {
    const file = await sdk.network.download("https://example.com/backup.co");
    if (!file) {
        return "Download failed";
    }

    return await sdk.backup.restoreBackupFile(file.path);
} catch (error) {
    return "Failed: " + error.message;
}
