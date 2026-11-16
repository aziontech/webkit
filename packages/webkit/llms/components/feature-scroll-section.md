# Feature Scroll Section

> The walkthrough band of a product page: a large section title over one screen per feature. From the large breakpoint up the features scroll through a sticky stack — the copy advances while the feature's live scene or illustration stays pinned in a framed, textured stage with one small action under each step (a step may pin a one-file code sample instead, for a code-led walkthrough); below it the same features are a three-column grid of media tiles. It is a page section — the site places it from a `{ _id: 'feature-scroll-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `registration-frame`, `card-grid`, `media-tile`, `illustration`, `code-block`, `sticky-stack`, `texture`, `button` and the webkit scene assets (a `ConsoleMockup` console fragment, most often).

- Import: `import FeatureScrollSection from '@aziontech/webkit/feature-scroll-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [feature-scroll-section.json](feature-scroll-section.json)

## When to use

- Use FeatureScrollSection for the product-page walkthrough, one pinned screen (scene or code) per feature.
- To walk through four to six capabilities of one product, each with a picture of its own.
- To walk through capabilities each shown by the file you would write: give each item a `code` sample. It is the only code slot of a product page.

## Do

- Four to six items; the stack needs enough steps to earn the scroll.
- Give every item a `scene`, a `code` sample or an `illustration`; it is the pinned picture on large screens and the tile media on small ones. On a product page prefer a `scene` naming a `ConsoleMockup` (`{ component: 'ConsoleMockup', props: { name } }`): it shows the console itself.
- Keep `action` to a short label such as "Docs" — it sits under the step copy at the small size.

## Don’t

- For three reasons with no scroll story → use `feature-tiles-section`.
- For one claim beside one code sample → use `media-split-section` with `codeTabs`, but not on product pages, where code goes here.
- In a hand-built SFC that needs its own media slot → use `sticky-stack` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sticky-stack](sticky-stack.md) — the scroll engine the large layout runs on.
- [media-tile](media-tile.md) — the cell the small layout renders each feature with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `FeatureScrollSectionItem[]` | `[]` | false | The features, in order; each is `{ title, description, scene?, code?, illustration?, action? }` where `scene` is `{ component, props? }` naming a webkit scene asset (drawn live in the stack, still in the grid), `code` is a one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` drawn when no scene is set, `illustration` is a registry name drawn when neither is set, and `action` is `{ label, href, trailing?, target?, variant? }` rendered as a small button under the step, secondary unless `variant` says otherwise. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`
- Below the large breakpoint the features render as a three-column grid of media tiles; from it up they render as a sticky stack whose active step is `sticky-stack`'s own
- Empty: when `items` is empty the band renders nothing — not the header, not the frames
- Media: an item's `scene` wins over its `code`, which wins over its `illustration`; a `code` sample is a one-file `code-block` with line numbers, typed in once in the stack and loaded on demand; in the stack the scene receives `active` for the open step only, so a console fragment plays its beat while its step is open and rests on its settled frame otherwise; in the grid every scene is drawn still (`active: false`) in a 20rem window. A scene name that is not registered draws nothing.

## Accessibility

- Visible focus: owned by the composed `button`.
- Keyboard map: `Tab` reaches each step's action and a code sample's copy button; `Enter` follows it; the stack's own progression is scroll-driven and never traps focus.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the step headings are `sticky-stack`'s and `media-tile`'s; the texture layer and the pinned illustration are decorative; a scene carries its own semantics (a `ConsoleMockup` is a decorative console picture).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the step transition belongs to `sticky-stack`, which carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the per-step action is a small `button` on the large layout only, where pointer precision is available.

## Examples

### Default

```vue
<script setup>
  import FeatureScrollSection from '@aziontech/webkit/feature-scroll-section'
</script>

<template>
  <FeatureScrollSection
    eyebrow="Workloads"
    title="Everything a workload does, one screen at a time"
    description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
    :items="[
      {
        title: 'Every workload on one list',
        description:
          'See each workload with its domain, status and last deployment, so what is live is never a question.',
        illustration: 'traffic-and-cost-bar-chart',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Read the deployment topology',
        description:
          'The domains, the application and the firewall a workload serves, drawn as one chain.',
        illustration: 'global-network',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Domains and TLS, handled',
        description:
          'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
        illustration: 'dns-protection',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Ship a version in seconds',
        description:
          'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
        illustration: 'fastest-path-to-live-website',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Gradual rollouts and instant rollback',
        description:
          'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
        illustration: 'preview',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      }
    ]"
  />
</template>
```

### Live scenes

```vue
<script setup>
  import FeatureScrollSection from '@aziontech/webkit/feature-scroll-section'
</script>

<template>
  <FeatureScrollSection
    eyebrow="Workloads"
    title="Everything a workload does, one screen at a time"
    description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
    :items="[
      {
        title: 'Every workload on one list',
        description:
          'See each workload with its domain, status and last deployment, so what is live is never a question.',
        scene: { component: 'ConsoleMockup', props: { name: 'workloads-list' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Read the deployment topology',
        description:
          'The domains, the application and the firewall a workload serves, drawn as one chain.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-topology' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Domains and TLS, handled',
        description:
          'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-domains' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Ship a version in seconds',
        description:
          'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-deploy' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Gradual rollouts and instant rollback',
        description:
          'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
        scene: { component: 'ConsoleMockup', props: { name: 'workload-rollout-rows' } },
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      }
    ]"
  />
</template>
```

### Code

```vue
<script setup>
  import FeatureScrollSection from '@aziontech/webkit/feature-scroll-section'

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
        fileIcon: 'ai-color ai-javascript',
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
        fileIcon: 'ai-color ai-terraform',
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
        trailing: true,
        target: '_blank'
      },
      code: {
        fileName: 'requests.graphql',
        fileIcon: 'ai-color ai-graphql',
        language: 'graphql',
        code: 'query RequestsByStatus($begin: DateTime!, $end: DateTime!) {\n  httpMetrics(\n    limit: 100\n    filter: { tsRange: { begin: $begin, end: $end } }\n    groupBy: [status]\n  ) {\n    status\n    requests: sum(field: requests)\n    p95: percentile(field: requestTime, percentile: 95)\n  }\n}',
        copyAriaLabel: 'Copy the requests.graphql sample'
      }
    }
  ]
</script>

<template>
  <FeatureScrollSection
    anchor="ship-it"
    eyebrow="Ship It"
    title="Everything You Need to Build and Deploy"
    description="Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves."
    :items="items"
  />
</template>
```
