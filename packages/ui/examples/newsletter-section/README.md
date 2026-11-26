# NewsletterSection

The close whose ask is a subscribe form. It is `NewsletterSection` from `@aziontech/webkit/newsletter-section`.

## Examples

### Default

The Blog and Resource Hub close. The headline sits large on the lead side and the ask labels the email field, over a strip lit by the pixelated primary wave, then the tall closing frame. An empty field and a malformed address each show their message under the field. The block never sends: a valid address fires `submit`, and the page posts it and sets the outcome back.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band's id for in-page links, `contact` by convention.
- `eyebrow` is the overline, `description` the large headline on the lead side, and `title` the ask that labels the email field and names the band.
- `form` is the copy of the form: the field `placeholder`, the `submitLabel`, the `successMessage` that replaces the form once the address is sent, the `errorMessage` shown under the form when it is not, and the `requiredMessage` and `invalidMessage` shown under the field.
- The block emits `submit` with the event and `{ email }` on a valid address and never posts it. The site posts the address to its newsletter service, sets `loading` while it waits, then `submitted` on success or `failed` on failure. `loading`, `submitted` and `failed` are not in the JSON; the site owns them.

Example:

Site JSON: [`site-default.json`](./site-default.json)
