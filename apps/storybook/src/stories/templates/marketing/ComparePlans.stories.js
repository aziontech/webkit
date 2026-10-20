import Button from '@aziontech/webkit/button'
import Hint from '@aziontech/webkit/hint'
import Link from '@aziontech/webkit/link'
import Overline from '@aziontech/webkit/overline'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    highlighted: false,
    action: { label: 'Start for free', kind: 'outlined', href: '/signup' }
  },
  {
    id: 'pro',
    name: 'Pro',
    highlighted: true,
    action: { label: 'Start with Pro', kind: 'secondary', href: '/signup' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    highlighted: false,
    action: { label: 'Contact us', kind: 'outlined', href: '#contact' }
  }
]

const SECTIONS = [
  {
    eyebrow: 'Managed infrastructure',
    title: 'Azion Platform',
    description: 'Running modern workloads on a global infrastructure.',
    rows: [
      { label: 'Global infrastructure', group: true, values: ['', '', ''] },
      { label: '100+ data centers', values: [true, true, true] },
      {
        label: 'Automatic routing with load balancing and failover',
        values: [true, true, true]
      },
      { label: 'Management', group: true, values: ['', '', ''] },
      {
        label: 'Workspaces (Multi-Org)',
        hint: 'A workspace is an isolated set of resources, users and billing inside your organization.',
        values: ['1 Workspace', '1 Workspace', 'Custom']
      },
      { label: 'Users', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Access security', group: true, values: ['', '', ''] },
      {
        label: 'Role-Based Access Control (RBAC)',
        hint: 'Gives each user only the permissions their role needs, instead of full account access.',
        values: ['Team level', 'Team level', 'Team and workspace levels']
      },
      {
        label: 'Multi-Factor Authentication (MFA)',
        hint: 'Requires a second factor beyond the password when signing in.',
        values: [true, true, true]
      },
      { label: 'Login OAuth (Google, GitHub)', values: [true, true, true] },
      {
        label: 'SAML Single Sign-On (SSO)',
        hint: 'Lets your team sign in through your own identity provider instead of Azion credentials.',
        values: [true, true, true]
      },
      { label: 'Workloads', group: true, values: ['', '', ''] },
      {
        label: 'Workloads',
        hint: 'A workload is the domain and TLS configuration that exposes an application or firewall to the internet.',
        values: ['10 included', '20 included', 'Custom']
      },
      { label: 'Data transfer', values: ['1 TB / mo included', '2 TB / mo included', 'Custom'] },
      { label: 'Requests', values: ['10M / mo included', '20M / mo included', 'Custom'] },
      { label: 'TLS encryption', values: [true, true, true] },
      {
        label: 'Mutual TLS (mTLS)',
        hint: 'Requires the client to present a certificate too, not just the server.',
        values: [true, true, true]
      },
      {
        label: 'Certificate Manager',
        hint: 'Where TLS certificates are issued, imported and renewed for your workloads.',
        group: true,
        values: ['', '', '']
      },
      { label: "Let's Encrypt certificate", values: [true, true, true] },
      { label: 'Bring your own certificate', values: [true, true, true] },
      { label: 'Developer tools', group: true, values: ['', '', ''] },
      { label: 'CLI, API, GraphQL API, Terraform', values: [true, true, true] }
    ]
  },
  {
    eyebrow: 'Build',
    title: 'Azion Applications',
    description: 'Build, run and scale applications globally.',
    rows: [
      { label: 'Applications', group: true, values: ['', '', ''] },
      {
        label: 'Rules Engine',
        hint: 'Conditional rules that change how a request is handled, evaluated at request and response time.',
        values: [true, true, true]
      },
      { label: 'Rules per application', values: ['10 included', '20 included', 'Custom'] },
      { label: 'Redirects', values: [true, true, true] },
      {
        label: 'Reverse proxy using Connectors',
        hint: 'Connectors define the origins an application fetches from, including headers and failover.',
        values: [true, true, true]
      },
      { label: 'Functions', group: true, values: ['', '', ''] },
      {
        label: 'Compute time',
        hint: 'The total execution time your functions consume, billed by the hour.',
        values: ['8 hours / mo included', '10 hours / mo included', 'Custom']
      },
      { label: 'Requests', values: ['3M / mo included', '10M / mo included', 'Custom'] },
      { label: 'Cache', group: true, values: ['', '', ''] },
      {
        label: 'Purges',
        hint: 'A purge invalidates cached content before its TTL expires.',
        values: ['1,000 / mo included', '2,000 / mo included', 'Custom']
      },
      {
        label: 'Tiered Cache',
        hint: 'Adds a second cache layer between the network and your origin, so fewer requests reach it.',
        values: [true, true, true]
      },
      {
        label: 'Application Accelerator',
        hint: 'Extends caching and routing control to dynamic content and APIs.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Data transfer', values: ['1 TB / mo included', '2 TB / mo included', 'Custom'] },
      {
        label: 'Custom Cache Keys',
        hint: 'Choose which parts of a request — query string, cookies, headers — make two responses distinct.',
        values: [true, true, true]
      },
      { label: 'Path Rewrites', values: [true, true, true] },
      {
        label: 'Image Processor',
        hint: 'Resizes, crops and converts images on the fly from a single stored original.',
        group: true,
        values: ['', '', '']
      },
      { label: 'Images', values: ['5,000 / mo included', '10,000 / mo included', 'Custom'] },
      {
        label: 'AI Inference',
        hint: 'Runs model inference on the same distributed network, close to the user.',
        group: true,
        tag: 'Preview',
        values: ['', '', '']
      },
      {
        label: 'Preview access',
        values: ['On request (subject to approval)', 'On request (subject to approval)', 'Custom']
      }
    ]
  },
  {
    eyebrow: 'Azion Platform',
    title: 'Compliance',
    description: 'Compliance that protects your business.',
    rows: [
      {
        label: 'PCI DSS 4.0.1 Level 1 Service Provider',
        hint: 'Azion is assessed annually as a Level 1 service provider under PCI DSS 4.0.1.',
        group: true,
        values: ['—', '—', true]
      },
      {
        label: 'SOC 2 Type 2 / SOC 3',
        hint: "Independent audit of Azion's security, availability and confidentiality controls over time.",
        group: true,
        values: ['—', '—', true]
      },
      {
        label: 'FIPS 140-2 Level 3',
        hint: 'Cryptographic keys are held in hardware validated to FIPS 140-2 Level 3.',
        group: true,
        values: ['—', '—', 'Included with Secure Key Store (paid add-on)']
      }
    ]
  },
  {
    eyebrow: 'Contractual commitments',
    title: 'Commit and Save',
    description: 'Commit up front and save more.',
    rows: [
      {
        label: 'Capacity Reservation',
        hint: 'Commit to a usage volume up front in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      },
      {
        label: 'Savings Plan',
        hint: 'Commit to a spend amount over a 1, 2 or 3 year term in exchange for a lower unit price.',
        group: true,
        values: ['—', '—', 'Available']
      }
    ]
  }
]

const DEFAULT_PLAN = PLANS.find((plan) => plan.highlighted).id

const planName = (id) => PLANS.find((plan) => plan.id === id)?.name ?? ''

const labelHead = (label) => label.slice(0, label.lastIndexOf(' ') + 1)

const labelTail = (label) => label.slice(label.lastIndexOf(' ') + 1)

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
  "import Hint from '@aziontech/webkit/hint'",
  "import Link from '@aziontech/webkit/link'",
  "import Overline from '@aziontech/webkit/overline'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Select from '@aziontech/webkit/select'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { ref } from 'vue'",
  '',
  `const plans = ${literal(PLANS)}`,
  '',
  `const sections = ${literal(SECTIONS)}`,
  '',
  `const visiblePlan = ref(${quoted(DEFAULT_PLAN)})`,
  '',
  "const planName = (id) => plans.find((plan) => plan.id === id)?.name ?? ''",
  '',
  "const labelHead = (label) => label.slice(0, label.lastIndexOf(' ') + 1)",
  '',
  "const labelTail = (label) => label.slice(label.lastIndexOf(' ') + 1)"
]

const components = {
  Button,
  Hint,
  Link,
  Overline,
  SectionContainer,
  SectionGap,
  SectionModule,
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  Tag
}

const TEMPLATE = inColumn(`<SectionModule id="comparison" :divided="false" :padded="false">
  <table class="w-full table-auto border-separate border-spacing-0 text-left lg:table-fixed">
    <caption class="sr-only">
      Feature and included-usage comparison across the Hobby, Pro and Enterprise plans.
    </caption>
    <thead>
      <tr>
        <th
          scope="col"
          class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
        >
          <span class="text-overline-md text-(--text-muted) max-lg:sr-only">Features</span>
          <Select
            v-model="visiblePlan"
            :display-value="planName"
            size="large"
            class="w-full lg:hidden"
          >
            <Select.Trigger aria-label="Plan being compared" />
            <Select.Content>
              <Select.Option v-for="plan in plans" :key="plan.id" :value="plan.id">
                {{ plan.name }}
              </Select.Option>
            </Select.Content>
          </Select>
        </th>
        <th
          v-for="plan in plans"
          :key="plan.id"
          scope="col"
          :data-folded="plan.id !== visiblePlan || null"
          class="sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal max-lg:data-folded:hidden"
        >
          <span
            v-if="plan.highlighted"
            class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-(--border-selected)"
            aria-hidden="true"
          />
          <div class="flex h-full flex-col items-start gap-(--spacing-sm)">
            <span class="text-heading-md text-(--text-default) max-lg:sr-only">{{ plan.name }}</span>
            <Button
              :label="plan.action.label"
              :kind="plan.action.kind"
              size="large"
              class="w-full"
              :href="plan.action.href"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-for="(section, sectionIndex) in sections" :key="section.title">
      <tr>
        <th
          scope="colgroup"
          colspan="4"
          :data-ruled="sectionIndex > 0 || null"
          class="border-b border-(--border-default) p-(--spacing-lg) pt-(--spacing-xl) text-left font-normal data-ruled:border-t"
        >
          <Overline prefix="//" class="mb-(--spacing-xs)">{{ section.eyebrow }}</Overline>
          <span class="block text-heading-lg text-(--text-default)">{{ section.title }}</span>
          <span class="mt-(--spacing-xs) block max-w-md text-body-sm text-(--text-muted) md:text-body-md">
            {{ section.description }}
          </span>
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
          <span>
            <template v-if="row.hint">{{ labelHead(row.label) }}<span class="whitespace-nowrap">{{ labelTail(row.label) }}<Hint :text="row.hint" class="ml-(--spacing-xxs) align-middle" /></span></template>
            <template v-else>{{ row.label }}</template>
            <Tag
              v-if="row.tag"
              :label="row.tag"
              severity="secondary"
              size="small"
              class="ml-(--spacing-xs) align-middle"
            />
          </span>
        </th>
        <td
          v-for="(plan, planIndex) in plans"
          :key="plan.id"
          :data-folded="plan.id !== visiblePlan || null"
          class="border-l border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-ruled/row:border-t max-lg:data-folded:hidden"
        >
          <template v-if="row.values[planIndex] === true">
            <i class="pi pi-check text-body-sm text-(--success-contrast)" aria-hidden="true" />
            <span class="sr-only">Included</span>
          </template>
          <template v-else-if="row.values[planIndex] === '—'">
            <span class="text-(--text-muted)" aria-hidden="true">—</span>
            <span class="sr-only">Not included</span>
          </template>
          <span v-else-if="row.values[planIndex]">{{ row.values[planIndex] }}</span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="border-y border-(--border-default) px-(--spacing-lg) py-(--spacing-md)">
          <Link
            label="See on-demand pricing"
            href="https://www.azion.com/en/documentation/products/pricing/"
            target="_blank"
            icon="pi pi-arrow-right"
            size="medium"
          />
        </td>
      </tr>
    </tfoot>
  </table>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/ComparePlans',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The plan-by-plan feature matrix that follows the plan cards on the Pricing page: one column per plan, one band per product, and the allowance each plan includes on every row. It is a real `table` with one `tbody` per product, so a screen reader announces each allowance with its row and its plan. A cell is a tick (included), an em dash (not included) or the stated allowance, and the two glyphs carry their meaning in `sr-only` text; a `Hint` defines the terms a row names but does not explain. The plan header is sticky at `top-14`, the height of the site’s sticky nav, with the recommended plan marked by an accent bar on its top edge. Below `lg` the matrix narrows to the feature column and one plan, picked with a `Select` in the header; the other columns are hidden, not duplicated, which is why the table is `table-auto` until `lg` and `table-fixed` from there. For the Support page’s tier comparison, use CompareSupportTiers. Built from `SectionModule`, `Select`, `Button`, `Overline`, `Hint`, `Tag` and `Link`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const PlanMatrix = {
  render: () => ({
    components,
    setup: () => ({
      plans: PLANS,
      sections: SECTIONS,
      visiblePlan: ref(DEFAULT_PLAN),
      planName,
      labelHead,
      labelTail
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise across four of the Pricing page’s nine product sections: Azion Platform, Azion Applications, Compliance, and Commit and Save, which between them use every kind of cell. The rows are data, so a page adds the other sections to `sections` without touching the markup. Each plan’s button repeats the action of its card above the matrix, and the closing row hands off to the on-demand rates. Narrow the canvas below 1024px to see the plan picker; it opens on Pro, the recommended plan.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
