# StickyScrollCode

A list of capabilities with the code that proves each one. The band pins under the site header while the page scrolls; as the reader scrolls, the open capability moves on and the code sample beside it changes to match.

Below `lg` it unpins into a plain list with the sample under each capability.

The band is the `StickyScrollCode` component from `@aziontech/webkit/sticky-scroll-code`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `StickyStack`, `CodeBlock`, `TextureMaterial` and `Button`.

## Examples

### Default

The "Everything You Need to Build and Deploy" band for the Web Apps page: five capabilities, from deploying with the CLI to querying metrics over GraphQL, each with a one-file code sample. Each capability carries its own docs button under its description, shown only while it is open.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `items[]` are the capabilities in reading order, each a `title` and a `description`.
- `items[].action` is the capability's own button, with `label`, `href` and `trailing`; it shows under the description while the capability is open. Leave it out to drop the button.
- `items[].code` is the one-file sample: `fileName`, `fileIcon`, `language`, the `code` itself and the `copyAriaLabel` that names its copy button.

Example:

Site JSON: [`site-default.json`](./site-default.json)
