# JobPosting

The body of a careers posting page. The description runs down the page in rows, one per section of the posting, each a heading with its paragraphs and bullet lists. From the large breakpoint a rail beside it restates the posting (its area, its title and its facets) and stays on screen with the link to the application while the description scrolls. The application form follows, and a dialog confirms a sent application with a way back to the open positions.

The band is the `JobPosting` component from `@aziontech/webkit/job-posting`. Place it under a `hero-band` (`variant: 'title-band'`) that carries the posting's title and an action pointing at `#apply`. It never sends the form: it validates on submit, emits `submit` with the DOM event and the values, and the site sends the application and sets `loading`, `submitted` or `failed`.

## Examples

### Default

The posting with four description sections, four facets and the application form with text, email, phone, URL and file fields.

Example: [`default.vue`](./default.vue)

### States

The failure alert under the form (`failed`) and a button that opens the confirmation dialog (`submitted`).

Example: [`states.vue`](./states.vue)

### Site

The posting page body under its title band.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON, after the title band. `_id` picks the block and `props` are bound straight onto it:

- `area`, `title` and `facets` (`label`, `icon`) fill the rail; `applyLabel` is its button, which links to `#` plus `form.anchor`.
- `sections[]` are the description rows: a `title` and `blocks`, each `{ variant: 'text', text }` or `{ type: 'list', items }`.
- `form` is the application form: `title`, `description`, `submitLabel`, `anchor` and `fields` (`name`, `type` of `text`, `email`, `phone`, `url` or `file`, `label`, `required`, `helper`, `accept`).
- `messages` holds the field messages, the failure alert, the confirmation dialog copy and the browse button label.
- `secondaryAction` is the dialog's link back to the open positions.
- The page handles `submit`: a file field's value is its file name, and the file itself is in `new FormData(event.target)`.

Site JSON: [`site-default.json`](./site-default.json)
