# InvestorMarks

The company's investors as a row of linked marks under a centered title, like the backers on About. Each mark sits in its own cell and opens the investor's website in a new tab.

On hover and keyboard focus the mark lifts and a "Visit website" line rises under it. Under reduced motion both stay put. Each mark carries a light and a dark logo, so it reads in either theme.

The band is the `InvestorMarks` component from `@aziontech/webkit/investor-marks`; it composes `SectionModule`, `SectionTitle`, `FrameBox` and `BentoGrid`.

## Stories

### Default

The two investors About runs: monashees+ and Qualcomm Ventures.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `items[].logo` is the mark drawn on the dark theme, `logoLight` the one drawn on the light theme.
- `items[].href` is the investor's website, opened in a new tab.
- `linkLabel` is the line revealed under a mark, and the lead of its link's accessible name.

Example:

Site JSON: [`site-default.json`](./site-default.json)
