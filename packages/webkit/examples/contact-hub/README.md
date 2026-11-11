# ContactHub

The band under the Contact title band. Sales and Support sit side by side, each with its scope in one sentence and the action that actually reaches that team. A row of self-serve channels follows under them.

Support carries a second link to the system status page, so a reader can check for an incident before opening a ticket. The Contact page renders this band.

The band is the `ContactHub` component from `@aziontech/webkit/contact-hub`; it composes `SectionModule`, `FrameBox`, `CardGrid`, `CardGridCell`, `Topic` and `Button`.

## Examples

### Default

Sales and Support lanes over three self-serve channels: emergency attack mitigation, the Discord community and the documentation.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `lanes[]` are the two teams side by side, each an `icon`, a `title` and a one-sentence `description`, with an `action` (`label`, `href`, `trailing`) on its floor.
- A lane's `statusLink` (`label`, `href`, `target`) adds the system status link beside its action.
- `channels[]` are the self-serve links under the lanes, each an `icon`, a `title`, a `description`, an `href` and an optional `target` (`_blank` opens a new tab).

Example:

Site JSON: [`site-default.json`](./site-default.json)
