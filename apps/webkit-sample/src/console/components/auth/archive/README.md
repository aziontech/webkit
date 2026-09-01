# Archive — auth components kept for reference, not mounted

Nothing in this folder is imported. These are implementations the team decided
against **while they were working**, kept whole because the reason they were
replaced was a design direction rather than a defect: reading the real file
answers "how did the previous one behave?" in a way a diff in the history does
not, and it is what a rebuild starts from if the direction reverses.

Imports are aliased (`@shared/…`), so nothing had to be re-pointed on the way in.

| File               | Was                                                                                                                                                                                                                                           | Replaced by                              | Why                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NetworkPanel.vue` | The art half of the signed-out split: the network claim as a headline, `ClaimChips` under it, and the pixel world map (`MapBanner` in its `panel` framing) as the ground. Its headline and chips were props, so a screen could quiet it down. | [`../AuthColumn.vue`](../AuthColumn.vue) | The signed-out screens collapse to ONE centred column inside the page frame, so there is no other half to fill. The panel was not the problem — the split was: it made a page whose whole task is a form read as a page about the network with a form beside it. The proof that stayed is the client strip at the column's floor, which costs one band. |
