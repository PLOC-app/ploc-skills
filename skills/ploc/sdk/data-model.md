# Data model

Every model is reached through `sdk.cellar.<repository>` (`get(id)`, `getAll()`, `find(text)`, `findFirst(text)`).
Models share `id`, `timestamp`, `timeCreated`, `save()` and `delete()`.
Full declarations with every field: [`sdk.d.ts`](sdk.d.ts) (same folder).

```
Wine ──┬─ country, region, appellation, classification, color, bottleFormat, owner   (ids: countryId, regionId...)
       ├─ orders[]        purchases and consumptions        (Order → vendor, wine)
       ├─ tastingNotes[]                                    (TastingNotes → wine)
       ├─ rackItems[]     where the bottles are stored      (RackItem → rack, wine)
       └─ documents[]     photos and files                  (image, coverImage)

Rack ── rackItems[] (row, column), intervals[]
Region → Country      Appellation → Region
```

## Wine

Main fields: `name`, `vintage`, `bottles` (number of bottles in the cellar), `note`, `isFavorite`, `degree`,
`estimatePrice`, `comments`, `cuvee`, `tags`, `grapes`, `reference`, `latitude`/`longitude`.
Periods (`Period` with numeric `from` and `to`, or `null`/missing when not set): `apogee` and `drinkPeriod`
(drinking window), and `service`, the **serving temperature range in °C** (for example `{ from: 9, to: 10 }` for a
champagne, `{ from: 16, to: 18 }` for a red).

Relations, each with an id and an async getter:
`getCountry()`, `getRegion()`, `getAppellation()`, `getClassification()`, `getColor()`, `getBottleFormat()`,
`getOwner()`. Writes accept a model or an id: `wine.color = color` or `wine.color = "COLOR_ID"`.

The other models that point to a wine are reached with async methods, each returning a `Collection`:
`getRacks()` (racks holding the wine), `getTastingNotes()` and `getOrders()` (purchases and consumptions). They
throw `INVALID_PARAMS` for a wine without id. They are the same as `find({ wineId: wine.id })` on the matching
repository.

```js
const wine = await sdk.cellar.wine.findFirst("Margaux");
const racks = await wine.getRacks();
const notes = await wine.getTastingNotes();
return { racks: racks.map(r => r.name).toArray(), notes: notes.count, orders: (await wine.getOrders()).count };
```

`bottles` is the number of bottles currently in the cellar: filter on `bottles > 0` to get the wines you still own.

## Order

A purchase or a consumption of a wine. Fields: `date`, `purchases`, `consumptions`, `unitPrice`, `amount`,
`currency`, `comments`, `occasion`, `wineId`, `vendorId`.
`Order.OCCASION`: `NONE`, `ENJOY`, `PARTY`, `GIFT`, `SALE`, `LOST`, `VINDREDI`, `BECAUSE`, `INVENTORY`, `EPHEMERAL_COVID`.

## TastingNotes

Fields: `date`, `note`, `mood`, `comments`, `place`, `meals`, `people`, `vintage`, `color`, `template`, `wineId`.
`TastingNotes.MOOD`: `NONE`, `NASTY`, `BLAH`, `ANGRY`, `BANAL`, `SURPRISED`, `HAPPY`, `LOVE`.
`TastingNotes.TEMPLATES`: `SIMPLE`, `EXPERT`.

## Rack and RackItem

`Rack`: `name`, `rows`, `columns`, `model`, `comments`, `rackItems`, `intervals`.
Helpers: `getRackItem(row, column)`, `addRackItemAt(row, column, wine?)`, `findRackItemByQrCode`, `findRackItemByTag`,
`populateRackItems()`, `isValidPosition(row, column)`.

`RackItem` is one slot: `row`, `column`, `wine`, `rack`, `tags`, `qrCode`, `shape`, `display`.
`isEmpty()` / `isNotEmpty()`, `consume()` (take the bottle out), `store(wine)` (put a saved wine in).
Rack positions are **0-based** (`0 <= row < rows`): `addRackItemAt` throws on an invalid position, so check `isValidPosition` first.

## Reference models

| Model | Notes |
|---|---|
| `Country`, `Region`, `Appellation` | geography, `Region` belongs to a country, `Appellation` to a region |
| `Grape`, `Classification`, `Color`, `BottleFormat` | `name` plus a few display fields |
| `Vendor`, `Owner` | both extend `Contact` (`contact`, `address1`, `city`, `phone`, `email`, `website`, `countryId`...) |
| `Document` | file or image attached to a wine or tasting note (`filename`, `width`, `height`, `getBase64()`) |
| `Parameter` | cellar setting (`type`, `value`) |

## Typical reads

```js
const wine = await sdk.cellar.wine.findFirst("Margaux");
const [country, color] = [await wine.getCountry(), await wine.getColor()];
const orders = wine.orders ?? [];
const slots = (wine.rackItems ?? []).filter(i => i.isNotEmpty());
```

Check the exact field names of a model in [`sdk.d.ts`](sdk.d.ts) before using one that is not listed here.
