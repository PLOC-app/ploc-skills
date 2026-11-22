// Anonymous user id
const account = await sdk.account.getInfo("my-script");
if (!account.connected) {
    await sdk.account.open();
    return "Not connected";
}

return account.id;
