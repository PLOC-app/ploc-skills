# Mini app icons

The `ploc:icon` meta tag takes the **name of one of the icons below**, without the `.svg` extension.
PLOC reads it when the mini app opens and updates the icon shown in the app if the value changed.

```html
<meta name="ploc:name" content="My wine rack">
<meta name="ploc:icon" content="wine-rack">
```

- Use only names from this list. Any other value is not a valid icon.
- The SVG files are in [`icons/`](icons/): `wine-rack` is `wine-rack.svg`.
- Icons are 28×28 monochrome line icons. PLOC tints them, so their color does not matter.
- Pick the icon closest to what the mini app does. When nothing fits, use `puzzle`.

## Choosing an icon

| Preview | Name | Suggested for |
|:---:|---|---|
| <img src="icons/bottle.svg" width="28" height="28" alt="bottle"> | `bottle` | wines, a bottle list, a bottle detail |
| <img src="icons/bottle-cutout.svg" width="28" height="28" alt="bottle-cutout"> | `bottle-cutout` | bottle photo with the background removed |
| <img src="icons/bottle-retouch.svg" width="28" height="28" alt="bottle-retouch"> | `bottle-retouch` | editing or improving bottle photos |
| <img src="icons/cutout.svg" width="28" height="28" alt="cutout"> | `cutout` | background removal, image cropping |
| <img src="icons/retouch.svg" width="28" height="28" alt="retouch"> | `retouch` | photo editing |
| <img src="icons/camera.svg" width="28" height="28" alt="camera"> | `camera` | taking or scanning photos |
| <img src="icons/label.svg" width="28" height="28" alt="label"> | `label` | wine labels, label recognition |
| <img src="icons/barcode.svg" width="28" height="28" alt="barcode"> | `barcode` | barcode scanning or lookup |
| <img src="icons/qr-code.svg" width="28" height="28" alt="qr-code"> | `qr-code` | QR codes, sharing a link |
| <img src="icons/wine-rack.svg" width="28" height="28" alt="wine-rack"> | `wine-rack` | racks, cellar layout, storage locations |
| <img src="icons/rack-arch.svg" width="28" height="28" alt="rack-arch"> | `rack-arch` | arch-shaped racks |
| <img src="icons/rack-honeycomb.svg" width="28" height="28" alt="rack-honeycomb"> | `rack-honeycomb` | honeycomb-shaped racks |
| <img src="icons/cube-3d.svg" width="28" height="28" alt="cube-3d"> | `cube-3d` | 3D views, 3D cellar |
| <img src="icons/tasting.svg" width="28" height="28" alt="tasting"> | `tasting` | tasting notes, tasting sessions |
| <img src="icons/tasting-add.svg" width="28" height="28" alt="tasting-add"> | `tasting-add` | adding a tasting note |
| <img src="icons/food-pairing.svg" width="28" height="28" alt="food-pairing"> | `food-pairing` | food and wine pairing |
| <img src="icons/decanting.svg" width="28" height="28" alt="decanting"> | `decanting` | decanting, serving advice |
| <img src="icons/peak-drinking.svg" width="28" height="28" alt="peak-drinking"> | `peak-drinking` | drinking window, wines at their peak |
| <img src="icons/quiz.svg" width="28" height="28" alt="quiz"> | `quiz` | quizzes, wine knowledge games |
| <img src="icons/smart-search.svg" width="28" height="28" alt="smart-search"> | `smart-search` | search, finding a wine |
| <img src="icons/ai.svg" width="28" height="28" alt="ai"> | `ai` | AI assistant, suggestions, recommendations |
| <img src="icons/stats.svg" width="28" height="28" alt="stats"> | `stats` | statistics, charts, cellar overview |
| <img src="icons/stats-file.svg" width="28" height="28" alt="stats-file"> | `stats-file` | statistics reports, exports of figures |
| <img src="icons/checklist.svg" width="28" height="28" alt="checklist"> | `checklist` | to-do lists, wishlists, inventory checks |
| <img src="icons/import.svg" width="28" height="28" alt="import"> | `import` | importing data |
| <img src="icons/print.svg" width="28" height="28" alt="print"> | `print` | printing, labels and sheets to print |
| <img src="icons/shop.svg" width="28" height="28" alt="shop"> | `shop` | buying, vendors, orders, shopping list |
| <img src="icons/club.svg" width="28" height="28" alt="club"> | `club` | wine clubs, subscriptions |
| <img src="icons/heart.svg" width="28" height="28" alt="heart"> | `heart` | favorites |
| <img src="icons/nutshell.svg" width="28" height="28" alt="nutshell"> | `nutshell` | summaries, quick overviews |
| <img src="icons/code.svg" width="28" height="28" alt="code"> | `code` | scripts, developer tools |
| <img src="icons/puzzle.svg" width="28" height="28" alt="puzzle"> | `puzzle` | anything else, default choice |

These usages are suggestions based on the icon names. The only hard rule is that the name must exist in the list.
