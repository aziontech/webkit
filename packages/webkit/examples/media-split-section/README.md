# MediaSplitSection

One claim beside its picture, on its own frame: copy on one side, the media on a raised surface on the other. It is the single-band cousin of MediaSplitStackSection, for a page that makes one point and moves on.

The media cell sits on the small pixelate texture, fading toward the top. With `size="large"` the headline is set at `heading-xl` and centred beside the media. With one action the whole band links to it; with two the band stays unlinked and the reader picks a button.

The band is the `MediaSplitSection` component from `@aziontech/webkit/media-split-section`; it composes `Module` and a `framed` `MediaSplit`, with a scene (a `ConsoleMockup` widget among them) or an `Illustration` from the illustration registry in the media cell. The media is required; code goes in `FeatureScrollSection` and a request-flow diagram in `ConsoleShowcaseSection`.

## Examples

### Our values

From the Careers page: the four values in one large, centred band with no actions, beside `BrandGlobeScene`, the bare globe turning behind the Azion mark. With no action the band is not a link.

Example: [`site-values.vue`](./site-values.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `eyebrow`, `title` and `description` fill the copy cell.
- `size` sets the type scale: `large` sets the headline at `heading-xl` and centres the copy beside the media; `medium`, the default, aligns it to the top of the media.
- `orientation` is `horizontal` (the default) or `vertical`, which stacks the media under the copy; `texture` picks the texture under the media (`pixelate` by default).
- `anchor` is the band's id for in-page links.
- The media is required and is one of `scene` (`{ component, props? }`, naming a webkit scene asset such as `BrandGlobeScene`, `SpinningGlobe` or `ConsoleMockup`, and the props bound onto it; not `Diagram`), `widget` (a `ConsoleMockup` name) or `illustration` (a registry name) with `illustrationAriaLabel`. When several are set, that order decides. Code and request-flow diagrams do not go in this band.
- `primaryAction` and `secondaryAction` are optional, each a `label`, an `href`, an optional `target`, an optional `trailing` chevron, an optional leading `icon` and an optional `variant` (`secondary`, `outline` or `ghost`) that wins over the drawn one: one renders outlined with the chevron and makes the whole band a link to it (set `linked` to `false` when the media holds controls), two leave the band unlinked. A band showing code is never a link.

Example:

Site JSON: [`site-values.json`](./site-values.json)
