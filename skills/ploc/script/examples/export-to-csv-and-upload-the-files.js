// Export to CSV and upload the files
// Replace the URL with a server you trust: the files contain your cellar data.
const baseUrl = "https://example.com/upload/";
const ok = await sdk.dialog.confirm("Upload your cellar CSV files to " + baseUrl + "?");
if (!ok) {
    return "Cancelled";
}

const files = await sdk.csv.createFiles();
if (!files) {
    await sdk.csv.open();
    return "Export failed";
}

for (const file of files) {
    await sdk.network.upload({
        path: file.path,
        url: baseUrl + file.path.split("/").pop(),
        method: "PUT"
    });
}
return files.length;
