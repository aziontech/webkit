import vercelExtendedMono from '@aziontech/webkit/assets/vercel-extended-mono.svg'
import vercelExtendedReversed from '@aziontech/webkit/assets/vercel-extended-reversed.svg'
import Brand from '@aziontech/webkit/brand'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import vercelExtendedMono from '@aziontech/webkit/assets/vercel-extended-mono.svg'",
  "import vercelExtendedReversed from '@aziontech/webkit/assets/vercel-extended-reversed.svg'",
  "import Brand from '@aziontech/webkit/brand'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  Brand,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const CAPABILITIES = [
  {
    capability: 'Delivery, compute, storage, and security on one platform',
    azion: 'full',
    vercel: 'partial'
  },
  { capability: 'Git-connected builds and preview deployments', azion: 'full', vercel: 'full' },
  {
    capability: 'Delivery rules changed without redeploying the application',
    azion: 'full',
    vercel: 'partial'
  },
  { capability: 'JavaScript and WebAssembly runtime', azion: 'full', vercel: 'full' },
  { capability: 'Cold-start-free function execution', azion: 'full', vercel: 'partial' },
  { capability: 'AI inference on the platform', azion: 'full', vercel: 'partial' },
  { capability: 'Distributed key-value store', azion: 'full', vercel: 'partial' },
  { capability: 'S3-compatible object storage', azion: 'full', vercel: 'partial' },
  { capability: 'Distributed SQL database with vector search', azion: 'full', vercel: 'none' },
  { capability: 'Managed WAF for applications and APIs', azion: 'full', vercel: 'full' },
  { capability: 'API discovery and protection', azion: 'full', vercel: 'partial' },
  { capability: 'Bot management', azion: 'full', vercel: 'full' },
  { capability: 'DDoS protection included with delivery', azion: 'full', vercel: 'full' },
  { capability: 'Network-layer firewall', azion: 'full', vercel: 'none' },
  { capability: 'Tiered caching and origin offload', azion: 'full', vercel: 'partial' },
  { capability: 'Image and video optimization', azion: 'full', vercel: 'partial' },
  { capability: 'Authoritative DNS', azion: 'full', vercel: 'full' },
  { capability: 'Load balancing across multi-cloud origins', azion: 'full', vercel: 'none' },
  {
    capability: 'Accelerate and protect origins hosted elsewhere',
    azion: 'full',
    vercel: 'none'
  },
  { capability: 'Real-time metrics and event search', azion: 'full', vercel: 'full' },
  { capability: 'Log streaming to third-party tools', azion: 'full', vercel: 'full' },
  { capability: 'Real-user monitoring', azion: 'full', vercel: 'full' },
  { capability: 'Published pay-as-you-go pricing', azion: 'full', vercel: 'full' }
]

const SUPPORT_MARKUP = {
  full: `<i class="pi pi-check text-body-sm text-(--success-contrast)" aria-hidden="true" />
<span class="sr-only">Full support</span>`,
  none: `<span class="text-(--text-muted)" aria-hidden="true">—</span>
<span class="sr-only">Not available</span>`,
  partial: '<span>Partial support</span>'
}

const supportCell = (level) => `<td
  class="border-l border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-[first]/row:border-t-0"
>
${indent(SUPPORT_MARKUP[level])}
</td>`

const row = (entry, index) => `<tr${index === 0 ? ' data-first' : ''} class="group/row">
  <th
    scope="row"
    class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[first]/row:border-t-0"
  >
    ${entry.capability}
  </th>
${indent(supportCell(entry.azion))}
${indent(supportCell(entry.vercel))}
</tr>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="left" eyebrow="Comparison" title="How Azion compares with Vercel" />
  </template>

  <table class="w-full table-auto border-separate border-spacing-0 text-left lg:table-fixed">
    <caption class="sr-only">
      Capability-by-capability comparison of Azion and Vercel.
    </caption>
    <thead>
      <tr>
        <th
          scope="col"
          class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
        >
          <span class="text-overline-md text-(--text-muted)">Capability</span>
        </th>
        <th
          scope="col"
          aria-label="Azion"
          class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) text-center align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
        >
          <Brand kind="default" size="small" class="[&>svg]:h-3! sm:[&>svg]:h-4!" />
          <span class="sr-only">Azion</span>
        </th>
        <th
          scope="col"
          aria-label="Vercel"
          class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
        >
          <img
            :src="vercelExtendedReversed"
            alt="Vercel"
            decoding="async"
            class="mx-auto h-3 w-auto max-w-full object-contain sm:h-4 hidden [[data-theme=dark]_&]:block"
          />
          <img
            :src="vercelExtendedMono"
            alt="Vercel"
            decoding="async"
            class="mx-auto h-3 w-auto max-w-full object-contain sm:h-4 block [[data-theme=dark]_&]:hidden"
          />
          <span class="sr-only">Vercel</span>
        </th>
      </tr>
    </thead>
    <tbody>
${each(CAPABILITIES, row, 3)}
    </tbody>
  </table>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/ComparisonTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A capability-by-capability matrix of Azion against one competitor, as a real `table` so a screen reader announces each row with its column. A tick marks full support, an em dash marks absence, and anything in between is stated as text; the two glyphs carry their meaning in `sr-only` text. The header row is sticky at `top-14`, the height of the site’s sticky nav, so the column names stay on screen past the first rows. The Vercel Alternative landing page carries it; the Pricing page’s plan matrix is the same form across three plans, and ships as `ComparePlans`. Built from `SectionModule` and `SectionTitle`, with `Brand` for the Azion column and the competitor’s logo asset for the other.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const AzionVsVercel = {
  render: () => ({
    components,
    setup: () => ({ vercelExtendedMono, vercelExtendedReversed }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All twenty-three rows of the Vercel comparison. The Vercel logo ships as two files, the reversed one for the dark theme and the mono one for light, and CSS shows one per theme.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
