# PhotoMarquee

A looping row of photos under a section title, for showing places and people, like the offices on Careers. Every photo keeps its own proportions at one shared height, so portrait and landscape shots sit in the same row.

The loop pauses on hover and keyboard focus. Under reduced motion it stops, and the row scrolls by hand. Screen readers hear each photo once: the copy that closes the loop is hidden from them.

The band is the `PhotoMarquee` component from `@aziontech/webkit/photo-marquee`; it composes `SectionModule`, `SectionTitle` and `FrameBox`, with the `animate-brand-marquee` utility.

## Stories

### Default

The six office photos Careers runs, at ten seconds per photo.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `photos[].src` is a path in the site's `public/` folder.
- `width` and `height` set the photo's proportions.
- `duration` is how many seconds one full pass takes; left at `0`, each photo adds ten seconds.
- `title`, `description` and `descriptionWidth` fill the horizontal section title; `ariaLabel` names the scrolling region.

Example:

Site JSON: [`site-default.json`](./site-default.json)
