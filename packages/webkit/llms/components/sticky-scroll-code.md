# Sticky Scroll Code

> The developer-capabilities band of a product page: a large section title over a sticky stack whose claims scroll past a pinned media frame, the open claim showing its one-file code sample on the pixelate texture and its own button under its description. It is a page section — the site places it from a `{ _id: 'sticky-scroll-code', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `sticky-stack`, `texture-material`, `code-block` and `button`. Which claim is open is scroll-driven state owned by `sticky-stack`.

- Import: `import StickyScrollCode from '@aziontech/webkit/sticky-scroll-code'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [sticky-scroll-code.json](https://github.com/aziontech/webkit/blob/main/.specs/sticky-scroll-code.json)

## When to use

- To walk a developer through several capabilities, each proven by a short file, while the page scrolls.

## Do

- Keep each sample short enough to read in the pinned frame.
- Give every item a `code`; the item's `action` is optional and shows only while the item is open.

## Don’t

- For one claim beside one sample → use `code-split`.
- For a walkthrough shown by illustrations → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sticky-stack](sticky-stack.md) — the pinned, scroll-driven run of claims this section renders through.
- [code-block](code-block.md) — the one-file sample each claim shows.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `StickyScrollCodeItem[]` | `[]` | false | The capabilities, in reading order; each is `{ title, description, code, action? }` where `code` is the one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the open item. |

## States

- Visual states: `default`; the open item, its progress and the pinned frame are scroll-driven state owned by `sticky-stack`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; an item's button renders only when it has an `action`

## Accessibility

- Visible focus: owned by `code-block` (copy button) and `button`.
- Keyboard map: `Tab` reaches each open item's copy button and button.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each sample's copy button is named by its `copyAriaLabel`, or the code block's own name when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `sticky-stack` and `code-block`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the sample's line entrance is owned by `code-block`.
- Touch target ≥40×40 px — not applicable to the small item button, which is supplementary to the item's copy.

## Examples

### Default

```vue
<script setup>
  import StickyScrollCode from '@aziontech/webkit/sticky-scroll-code'

  const items = [
    {
      title: 'Automated deployment via Git or CLI',
      description:
        'Run one command from the project you already have, or connect the repository and let every push to the branch ship itself.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'deploy.sh',
        fileIcon: 'ai ai-azion-cli',
        language: 'bash',
        code: '# Ship the project in front of you\nazion deploy\n\n# Or link the repo once, and every push to main deploys\nazion link --preset next\ngit push origin main\n\n# Then roll back if it should not have gone out\nazion rollback --to previous',
        copyAriaLabel: 'Copy the deploy.sh sample'
      }
    },
    {
      title: 'Compatibility with modern web frameworks',
      description:
        'Next, Nuxt, Astro, Svelte and twenty more build through a preset the CLI detects, so the config file stays this short.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'azion.config.js',
        fileIcon: 'ai-cor ai-js',
        language: 'javascript',
        code: "import { defineConfig } from 'azion'\n\nexport default defineConfig({\n  build: {\n    entry: 'src/index.ts',\n    worker: true,\n    preset: 'next'\n  },\n  functions: [\n    { name: 'storefront', path: '.edge/worker.js' }\n  ]\n})",
        copyAriaLabel: 'Copy the azion.config.js sample'
      }
    },
    {
      title: 'APIs for automation and integration',
      description:
        'Everything the console does is a call you can make yourself, so a workload can be created by the pipeline that needed it.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'create-workload.sh',
        fileIcon: 'ai ai-azion-cli',
        language: 'bash',
        code: '# Create the workload the pipeline just built for\ncurl -X POST https://api.azion.com/v4/workloads \\\n  -H "Authorization: Token $AZION_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "name": "storefront",\n    "domains": ["storefront.example.com"]\n  }\'',
        copyAriaLabel: 'Copy the create-workload.sh sample'
      }
    },
    {
      title: 'Infrastructure as code with Terraform',
      description:
        'Declare workloads, applications and domains in the provider and apply them under the same review as the rest of your estate.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'main.tf',
        fileIcon: 'ai-cor ai-terraform',
        language: 'hcl',
        code: 'resource "azion_application" "storefront" {\n  name                    = "storefront"\n  edge_functions          = true\n  application_accelerator = true\n}\n\nresource "azion_workload" "storefront" {\n  name    = "storefront"\n  domains = ["storefront.example.com"]\n\n  application {\n    id = azion_application.storefront.id\n  }\n}',
        copyAriaLabel: 'Copy the main.tf sample'
      }
    },
    {
      title: 'Metrics and events via GraphQL API',
      description:
        'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform too.',
      action: {
        label: 'Docs',
        href: 'https://www.azion.com/en/documentation/devtools/',
        trailing: true
      },
      code: {
        fileName: 'requests.graphql',
        fileIcon: 'ai-cor ai-graphql',
        language: 'graphql',
        code: 'query RequestsByStatus($begin: DateTime!, $end: DateTime!) {\n  httpMetrics(\n    limit: 100\n    filter: { tsRange: { begin: $begin, end: $end } }\n    groupBy: [status]\n  ) {\n    status\n    requests: sum(field: requests)\n    p95: percentile(field: requestTime, percentile: 95)\n  }\n}',
        copyAriaLabel: 'Copy the requests.graphql sample'
      }
    }
  ]
</script>

<template>
  <StickyScrollCode
    eyebrow="Ship It"
    title="Everything You Need to Build and Deploy"
    description="Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves."
    :items="items"
  />
</template>
```
