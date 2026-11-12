# Code Split

> The claim-beside-its-code band of a product page: a framed media split whose copy states the claim, with one or two large buttons under it, and whose media is a code sample on the pixelate texture, cut off by the frame's bottom rule. It is a page section — the site places it from a `{ _id: 'code-split', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `code-block` and `button`. One tab draws a filename bar; several draw a tab strip, and a tab that carries an `icon` shows that mark beside its label.

- Import: `import CodeSplit from '@aziontech/webkit/code-split'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [code-split.json](https://github.com/aziontech/webkit/blob/main/.specs/code-split.json)

## When to use

- When the argument of a product page is a config file or a handler a developer can read, like Functions, Application Accelerator or AI Gateway.

## Do

- Keep the sample short enough to read in the cell; the frame cuts off whatever runs past it.
- Give every tab a `code`; a tab without one is skipped.
- Use `primaryAction` alone for one destination, and add `secondaryAction` only for a second, distinct one.

## Don’t

- For a terminal session under a headline → use `cli-terminal`.
- For a run of capabilities, each with its own sample, pinned while the page scrolls → use `sticky-scroll-code`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the copy-beside-media band this section renders through.
- [code-block](code-block.md) — the tabbed code sample in the media cell.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `codeTabs` | `CodeSplitTab[]` | `[]` | false | The files of the code sample, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark drawn beside the tab label. A tab without `code` is skipped. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the sample's copy button; empty keeps the code block's own. |
| `primaryAction` | `CodeSplitAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. |
| `secondaryAction` | `CodeSplitAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. |

## States

- Visual states: `default`; the tab strip, copy button and buttons own their hover and focus states
- Empty: when `title` is empty the band renders nothing; when no tab carries `code` the media cell is left out
- One tab draws a filename bar, several draw a tab strip; a tab mark renders only when some tab carries an `icon`

## Accessibility

- Visible focus: owned by `code-block` (tabs, copy button) and `button`.
- Keyboard map: `Tab` reaches the tabs, the copy button and the buttons; arrow keys move between tabs (owned by `code-block`); `Enter` follows a button.
- ARIA: the band is a plain `div`; the named landmark is `media-split`'s own section (labelled by `title`), so no second landmark is added; tab marks are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split`, `code-block` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the sample's line entrance is owned by `code-block`.
- Touch target ≥40×40 px: the large buttons.

## Examples

### Default

```vue
<script setup>
  import CodeSplit from '@aziontech/webkit/code-split'

  const codeTabs = [
    {
      label: 'cache-settings.json',
      value: 'cache-settings',
      language: 'json',
      code: '{\n  "cache_settings": {\n    "name": "api-cache",\n    "browser_cache_settings": {\n      "ttl": 60\n    },\n    "cdn_cache_settings": {\n      "ttl": 30\n    },\n    "cache_key": {\n      "query_string": "whitelist",\n      "query_string_fields": ["user_id", "category"],\n      "cookie": "whitelist",\n      "cookie_names": ["session_id", "region"]\n    },\n    "methods": ["GET", "POST", "OPTIONS"],\n    "stale_cache": true\n  }\n}',
      fileName: 'cache-settings.json',
      fileIcon: 'ai ai-json'
    }
  ]

  const primaryAction = {
    label: 'Learn more',
    href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/',
    trailing: true
  }
</script>

<template>
  <CodeSplit
    title="From basic caching to advanced acceleration"
    description="Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content."
    :code-tabs="codeTabs"
    copy-aria-label="Copy the cache settings sample"
    :primary-action="primaryAction"
  />
</template>
```
