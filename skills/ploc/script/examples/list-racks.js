// List racks
const racks = await sdk.cellar.rack.getAll();
return racks.map(r => r.name).toArray();
