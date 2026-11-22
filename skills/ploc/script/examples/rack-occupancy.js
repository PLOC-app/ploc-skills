// Rack occupancy
const racks = await sdk.cellar.rack.getAll();
const report = [];
for (const rack of racks) {
    const items = rack.rackItems ?? [];
    const filled = items.filter(item => item.isNotEmpty()).length;
    report.push(rack.name + ": " + filled + " / " + rack.rows * rack.columns);
}

return report;
