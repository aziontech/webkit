import Button from '@aziontech/webkit/button'
import Link from '@aziontech/webkit/link'
import Overline from '@aziontech/webkit/overline'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import { ref } from 'vue'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const PRICING = 'https://www.azion.com/en/documentation/products/pricing/'

const TIERS = [
  {
    id: 'developer',
    name: 'Developer',
    description: 'Ideal for exploring the platform independently.',
    highlighted: false,
    action: { label: 'Start Free', kind: 'outlined', href: '/signup' }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Ideal for teams that need support from specialists.',
    highlighted: false,
    action: { label: 'Contact Us', kind: 'outlined', href: '/contact' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Ideal for organizations that require advanced support and ongoing services.',
    highlighted: true,
    action: { label: 'Contact Us', kind: 'secondary', href: '/contact' }
  },
  {
    id: 'mission-critical',
    name: 'Mission-Critical',
    description: 'Ideal for mission-critical operations that need priority and proactive support.',
    highlighted: false,
    action: { label: 'Contact Us', kind: 'outlined', href: '/contact' }
  }
]

const heading = (label) => ({ label, group: true, values: ['', '', '', ''] })

const SECTIONS = [
  {
    eyebrow: 'Support',
    title: 'Get assistance when it matters most',
    link: { label: 'See Pricing', href: `${PRICING}#support` },
    rows: [
      heading('Self-service support'),
      { label: 'Learning Center', values: [true, true, true, true] },
      { label: 'Azion Copilot (AI)', values: [true, true, true, true] },
      heading('Technical Support'),
      { label: 'Community Support (Discord)', values: [true, true, true, true] },
      { label: '24/7 support via ticket and email', values: ['—', true, true, true] },
      { label: 'Phone and video support', values: ['—', '—', true, true] },
      { label: 'Slack channel', values: ['—', '—', 'Paid add-on', 'Paid add-on'] },
      heading('First response time'),
      { label: 'General guidance', values: ['—', '< 24 hours', '< 24 hours', '< 12 hours'] },
      { label: 'System impaired', values: ['—', '< 12 hours', '< 12 hours', '< 12 hours'] },
      {
        label: 'Production system impaired',
        values: ['—', '< 4 hours', '< 4 hours', '< 2 hours']
      },
      { label: 'Production system down', values: ['—', '< 2 hours', '< 1 hour', '< 30 minutes'] },
      { label: 'Business system down', values: ['—', '—', '< 15 minutes', '< 15 minutes'] }
    ]
  },
  {
    eyebrow: 'Professional Services',
    title: 'Move faster with specialist guidance',
    link: { label: 'See Pricing', href: `${PRICING}#professional-services` },
    rows: [
      {
        label: 'Integration Services',
        group: true,
        values: ['—', '5 hours/year included', '20 hours/year included', '60 hours/year included']
      },
      {
        label: 'Best Practices Review',
        group: true,
        values: ['—', 'Paid add-on', '20 hours/year included', '40 hours/year included']
      },
      {
        label: 'Business Events Support',
        group: true,
        values: ['—', '—', '1 event per year', '100 hours/year included']
      },
      {
        label: 'Technical Account Manager',
        group: true,
        values: ['—', '—', 'Paid add-on', '20 hours/month included']
      },
      {
        label: 'Instructor-Led Training',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      },
      {
        label: 'Managed Configuration Service',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      },
      {
        label: 'Security Response Team',
        group: true,
        values: ['—', '—', 'Paid add-on', 'Paid add-on']
      }
    ]
  }
]

const DEFAULT_TIER = TIERS.find((tier) => tier.highlighted).id

const tierName = (id) => TIERS.find((tier) => tier.id === id)?.name ?? ''

const quoted = (text) =>
  text.includes("'") && !text.includes('"') ? `"${text}"` : `'${text.replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  if (typeof value === 'string') return quoted(value)
  if (value === null || typeof value !== 'object') return String(value)
  const entries = Array.isArray(value)
    ? value.map((item) => literal(item, depth + 1))
    : Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const [open, close] = Array.isArray(value) ? ['[', ']'] : ['{ ', ' }']
  const inline = `${open}${entries.join(', ')}${close}`
  if (!inline.includes('\n') && inline.length + depth * 2 <= 96) return inline
  const pad = '  '.repeat(depth + 1)
  return `${open.trim()}\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${'  '.repeat(depth)}${close.trim()}`
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Link from '@aziontech/webkit/link'",
  "import Overline from '@aziontech/webkit/overline'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Select from '@aziontech/webkit/select'",
  "import { ref } from 'vue'",
  '',
  `const tiers = ${literal(TIERS)}`,
  '',
  `const sections = ${literal(SECTIONS)}`,
  '',
  `const visibleTier = ref(${quoted(DEFAULT_TIER)})`,
  '',
  "const tierName = (id) => tiers.find((tier) => tier.id === id)?.name ?? ''"
]

const components = {
  Button,
  Link,
  Overline,
  SectionContainer,
  SectionGap,
  SectionModule,
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption
}

const TEMPLATE = inColumn(`<SectionModule id="tiers" :divided="false" :padded="false">
  <table class="w-full table-auto border-separate border-spacing-0 text-left lg:table-fixed">
    <caption class="sr-only">
      Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers.
    </caption>
    <thead>
      <tr>
        <th
          scope="col"
          class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
        >
          <span class="text-overline-md text-(--text-muted) max-lg:sr-only">Support</span>
          <Select
            v-model="visibleTier"
            :display-value="tierName"
            size="large"
            class="w-full lg:hidden"
          >
            <Select.Trigger aria-label="Tier being compared" />
            <Select.Content>
              <Select.Option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                {{ tier.name }}
              </Select.Option>
            </Select.Content>
          </Select>
        </th>
        <th
          v-for="tier in tiers"
          :key="tier.id"
          scope="col"
          :data-folded="tier.id !== visibleTier || null"
          class="sticky top-14 z-20 h-px border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal max-lg:data-folded:hidden"
        >
          <span
            v-if="tier.highlighted"
            class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
            aria-hidden="true"
          />
          <div class="flex h-full flex-col items-start justify-between gap-(--spacing-sm)">
            <div class="flex flex-col gap-(--spacing-sm) max-lg:sr-only">
              <span class="text-heading-md text-(--text-default)">{{ tier.name }}</span>
              <span class="text-body-sm text-(--text-muted)">{{ tier.description }}</span>
            </div>
            <Button
              :label="tier.action.label"
              :kind="tier.action.kind"
              size="large"
              class="w-full"
              :href="tier.action.href"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-for="(section, sectionIndex) in sections" :key="section.title">
      <tr>
        <th
          scope="colgroup"
          colspan="5"
          :data-ruled="sectionIndex > 0 || null"
          class="border-b border-(--border-default) p-(--spacing-lg) pt-(--spacing-xl) text-left font-normal data-ruled:border-t"
        >
          <Overline prefix="//" class="mb-(--spacing-xs)">{{ section.eyebrow }}</Overline>
          <span class="block text-heading-lg text-(--text-default)">{{ section.title }}</span>
        </th>
      </tr>
      <tr
        v-for="(row, rowIndex) in section.rows"
        :key="rowIndex"
        :data-lead="row.group || null"
        :data-ruled="(row.group && rowIndex > 0) || null"
        class="group/row"
      >
        <th
          scope="row"
          class="border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-muted) group-data-lead/row:text-(--text-default) group-data-ruled/row:border-t"
        >
          {{ row.label }}
        </th>
        <td
          v-for="(tier, tierIndex) in tiers"
          :key="tier.id"
          :data-folded="tier.id !== visibleTier || null"
          class="border-l border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-ruled/row:border-t max-lg:data-folded:hidden"
        >
          <template v-if="row.values[tierIndex] === true">
            <i class="pi pi-check text-body-sm text-(--success-contrast)" aria-hidden="true" />
            <span class="sr-only">Included</span>
          </template>
          <template v-else-if="row.values[tierIndex] === '—'">
            <span class="text-(--text-muted)" aria-hidden="true">—</span>
            <span class="sr-only">Not included</span>
          </template>
          <span v-else-if="row.values[tierIndex]">{{ row.values[tierIndex] }}</span>
        </td>
      </tr>
      <tr>
        <td
          colspan="5"
          :data-closing="sectionIndex === sections.length - 1 || null"
          class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) data-closing:border-b"
        >
          <Link
            :label="section.link.label"
            :href="section.link.href"
            target="_blank"
            icon="pi pi-arrow-right"
            size="medium"
          />
        </td>
      </tr>
    </tbody>
  </table>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/CompareSupportTiers',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The tier-by-tier comparison on the Support page: one column per support tier, one band per service family, and what each tier includes on every row. It is the support counterpart of ComparePlans, which compares the pricing plans: the same real `table` with one `tbody` per band, the same three kinds of cell (a tick, an em dash, or the stated allowance, with `sr-only` text on the two glyphs), the same sticky header at `top-14` with an accent bar on the recommended tier, and the same narrow layout that folds to one tier picked with a `Select`. Where it differs: the first column is headed `Support`, each tier states who it is for under its name, and each band closes on its own link to the matching section of the pricing documentation instead of one link for the whole table. Built from `SectionModule`, `Select`, `Button`, `Overline` and `Link`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const TierMatrix = {
  render: () => ({
    components,
    setup: () => ({
      tiers: TIERS,
      sections: SECTIONS,
      visibleTier: ref(DEFAULT_TIER),
      tierName
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Developer, Business, Enterprise and Mission-Critical across the Support band (self-service, technical support and first response time) and the Professional Services band. Developer is the free tier, so its button starts a free account; the other three hand off to the contact page, with Enterprise as the recommended tier. Narrow the canvas below 1024px to see the tier picker; it opens on Enterprise.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
