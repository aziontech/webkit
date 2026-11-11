# RecognitionMarquee

A looping row of analyst recognitions under a section title. Each card is a quote from a report, signed by the firm's logo with the report's name and date. Home shows it after "Why Azion".

The loop pauses on hover and keyboard focus. Under reduced motion it stops, and the row scrolls by hand. Screen readers hear each card once: the copy that closes the loop is hidden from them.

The band is the `RecognitionMarquee` component from `@aziontech/webkit/recognition-marquee`; it composes `SectionModule`, `SectionTitle`, `FrameBox` and `Quote`, with the `animate-brand-marquee` utility.

## Examples

### Default

The seven recognitions Home runs, at twelve seconds per card. Each firm's logo has a reversed file for dark and a color file for light; G2 uses one color file on both.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow` and `title` fill the section title.
- `items[]` takes the quote `text`, `reportName`, `date`, `firmName` and the firm `logo`.
- `logoLight` adds a color file for the light theme; without it, `logo` serves both.
- `duration` is how many seconds one full pass takes; left at `0`, each card adds twelve seconds.
- `ariaLabel` names the scrolling region for screen readers.

Example:

Site JSON: [`site-default.json`](./site-default.json)
