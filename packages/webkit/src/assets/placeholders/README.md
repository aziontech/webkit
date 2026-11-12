# Placeholders

WebKit ships brand media — client and partner logos, compliance badges, illustrations, the two
client story photographs — because a section draws them the same way on every site. It does
**not** ship editorial media: office and team photos, blog covers, article banners, product
screenshots and screen recordings. Those are the consumer's content, change with every page, and
would put megabytes in every install.

The components already take that media as data (`PhotoMarquee` `photos[].src`, `ArticleCards` and
`ArticleHighlight` `items[].image`, `ArticleBody` `banner`, `DocFrame` `src`). So an example still
runs as pasted, it passes a neutral stand-in from this folder:

```
placeholder-image.svg   any photo, cover, banner or screenshot
placeholder-clip.webm   any screen recording (2 s, loops)
```

- `placeholder-image.svg` is 3:2 by default and fills any box: `object-cover` crops it, a
  `h-auto` frame takes its ratio. Its translucent grey reads on both themes.
- `placeholder-clip.webm` is a dark frame with a play mark and a progress bar, 10 KB.
- Import them like any asset (`import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'`)
  and replace them with the app's own media. A list that keys on the URL (`PhotoMarquee`) needs a
  distinct URL per item: append a fragment (`placeholderImage + '#office-desks'`).

Never point an example, block or consumer screen at `/marketing-components/…` or `/media/…`: only
azion.com and the WebKit docs site served those paths. The lint rule
`webkit/no-root-relative-asset` flags them and names the import when
`../site-assets.json` maps the URL to a shipped file.
