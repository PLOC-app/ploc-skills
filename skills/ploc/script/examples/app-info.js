// App info
const app = await sdk.app.getInfo();
return app.name + " " + app.version + " (" + app.platform + ")";
