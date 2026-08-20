# Archive — list components kept for reference, not mounted

Nothing in this folder is imported. These are implementations the team decided
against **while they were working**, kept whole because the reason they were
replaced was a design direction rather than a defect: reading the real file
answers "how did the previous one behave?" in a way a diff in the history does
not, and it is what a rebuild starts from if the direction reverses.

Relative imports have been re-pointed one level up so the files still resolve if
one is mounted again; they are otherwise untouched.

| File            | Was                                                                                                                                                                                                                                    | Replaced by                                | Why                                                                                                                                                                                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FilterBar.vue` | Narrowing as a ROW OF PILLS in its own row under the controls: a dashed `Add Filter` pill that opened the panel, plus one chip per field held for the life of the page — filled with its value and a `×` when applied, outlined and recessed when merely on offer. | [`../FilterButton.vue`](../FilterButton.vue) | The offer chips spent a whole row saying nothing: a four-field list opened with four recessed pills under the search advertising a vocabulary the panel already lists. What earned its place was the applied half, so that is what stayed — one plain `Filter` button (badged when anything is applied) plus a chip per APPLIED cut, all in the controls row beside the search. The panel itself survives whole. |
