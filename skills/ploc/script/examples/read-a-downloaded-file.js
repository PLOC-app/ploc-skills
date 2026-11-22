// Read a downloaded file
try {
    const file = await sdk.network.download("https://example.com/data.json");
    if (!file) {
        return "Download failed";
    }

    const text = await sdk.files.readText(file.path);
    if (text === null) {
        return "Could not read the file";
    }
    return JSON.parse(text);
} catch (error) {
    return "Failed: " + error.message;
}
