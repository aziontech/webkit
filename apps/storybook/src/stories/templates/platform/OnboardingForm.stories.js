import Avatar from '@aziontech/webkit/avatar'
import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Brand from '@aziontech/webkit/brand'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Label from '@aziontech/webkit/label'
import Link from '@aziontech/webkit/link'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import ProgressBar from '@aziontech/webkit/progress-bar'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Min from '@aziontech/webkit/svg/azion/min'
import Tag from '@aziontech/webkit/tag'
import { computed, reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const WEBKIT_SUBPATHS = {
  Avatar: 'avatar',
  BoxGridSelection: 'box-grid-selection',
  Brand: 'brand',
  Button: 'button',
  CardBox: 'card-box',
  Divider: 'divider',
  Drawer: 'drawer',
  DrawerClose: 'drawer-close',
  DrawerContent: 'drawer-content',
  DrawerOverlay: 'drawer-overlay',
  DrawerPortal: 'drawer-portal',
  DrawerTitle: 'drawer-title',
  FieldCheckbox: 'field-checkbox',
  FieldSelect: 'field-select',
  FieldSwitchBlock: 'field-switch-block',
  FieldText: 'field-text',
  GlobalHeader: 'global-header',
  HelperText: 'helper-text',
  Label: 'label',
  Link: 'link',
  Message: 'message',
  PanelContent: 'panel-content',
  PanelFooter: 'panel-footer',
  PanelHeader: 'panel-header',
  ProgressBar: 'progress-bar',
  SegmentedButton: 'segmented-button',
  Min: 'svg/azion/min',
  Tag: 'tag'
}

const importsFor = (template, vueNames, scriptLines) => [
  ...Object.entries(WEBKIT_SUBPATHS)
    .filter(([binding]) => new RegExp(`<${binding}[\\s/>.]`).test(template))
    .map(([binding, subpath]) => `import ${binding} from '@aziontech/webkit/${subpath}'`),
  `import { ${vueNames.join(', ')} } from 'vue'`,
  '',
  ...scriptLines
]

const quote = (text) =>
  text.includes("'") && !text.includes('"')
    ? `"${text}"`
    : `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const inner = '  '.repeat(depth + 1)
  const outer = '  '.repeat(depth)
  if (Array.isArray(value)) {
    const items = value.map((item) => literal(item, depth + 1))
    const inline = `[${items.join(', ')}]`
    if (inline.length <= 72 && !inline.includes('\n')) return inline
    return `[\n${items.map((item) => `${inner}${item}`).join(',\n')}\n${outer}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, entry]) =>
        `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key)}: ${literal(entry, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    if (inline.length <= 72 && !inline.includes('\n')) return inline
    return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
  }
  if (typeof value === 'string') return quote(value)
  return String(value)
}

const declare = (name, value) => `const ${name} = ${literal(value)}`

const EMAIL = 'myemail@azion.com'
const WORKSPACE_NAME = 'My Workspace'

const ACCENTS = [
  {
    value: 'orange',
    label: 'Orange',
    ariaLabel: 'Orange mark',
    colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
  },
  {
    value: 'yellow',
    label: 'Yellow',
    ariaLabel: 'Yellow mark',
    colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
  },
  {
    value: 'red',
    label: 'Red',
    ariaLabel: 'Red mark',
    colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
  },
  {
    value: 'green',
    label: 'Green',
    ariaLabel: 'Green mark',
    colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
  },
  {
    value: 'blue',
    label: 'Blue',
    ariaLabel: 'Blue mark',
    colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
  },
  {
    value: 'violet',
    label: 'Violet',
    ariaLabel: 'Violet mark',
    colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
  },
  {
    value: 'gray',
    label: 'Gray',
    ariaLabel: 'Gray mark',
    colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
  }
]

const PLANS = [
  {
    value: 'hobby',
    label: "I'm working on personal projects",
    description: 'Start free for personal projects and experimentation',
    ariaLabel: "I'm working on personal projects. Hobby plan, Free.",
    name: 'Hobby',
    severity: 'contrast',
    price: 'Free'
  },
  {
    value: 'pro',
    label: "I'm working on commercial projects",
    description: 'For growing applications with higher usage demand',
    ariaLabel: "I'm working on commercial projects. Pro plan, From $20/mo.",
    name: 'Pro',
    severity: 'info',
    price: 'From $20/mo'
  },
  {
    value: 'enterprise',
    label: "I'm running production at scale",
    description: 'Optimize costs with usage or spend commitments',
    ariaLabel: "I'm running production at scale. Enterprise plan, From $2.000/mo.",
    name: 'Enterprise',
    severity: 'primary',
    price: 'From $2.000/mo'
  }
]

const COMPLIANCE_FEATURES = [
  { title: 'DDoS Protection included' },
  { title: 'PCI DSS 4.0.1 Level 1' },
  { title: 'SOC 2 Type 2 / SOC 3' },
  { title: 'Universal Data Migration Service' }
]

const UPGRADES = {
  pro: {
    name: 'Pro',
    features: [
      { title: '100 Workloads', detail: 'then $0.10 per workload per month' },
      { title: '10M Application requests', detail: 'then as low as $0.90 per 1M' },
      { title: '50 hours Function compute time', detail: 'then $0.18 per hour' },
      { title: '10 GB Real-Time Events Storage', detail: 'then $0.10 per GB-month' },
      { title: '100 GB Object Storage', detail: 'then as low as $0.021 per GB-month' },
      { title: '1 GB SQL Database Storage', detail: 'then $0.75 per GB-month' },
      { title: '100M Firewall requests', detail: 'then as low as $0.30 per 1M' },
      ...COMPLIANCE_FEATURES
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' }
        ],
        total: { value: '$ 3.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 200' },
          { label: 'Subtotal', value: '$ 3.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 2.200', suffix: 'per month' }
        ],
        total: { value: '$ 2.200', suffix: 'per year' }
      }
    }
  },
  enterprise: {
    name: 'Enterprise',
    features: [
      { title: 'Unlimited Workloads' },
      { title: '1B Application requests', detail: 'then as low as $0.60 per 1M' },
      { title: '500 hours Function compute time', detail: 'then $0.12 per hour' },
      { title: '1 TB Real-Time Events Storage', detail: 'then $0.08 per GB-month' },
      { title: '10 TB Object Storage', detail: 'then as low as $0.015 per GB-month' },
      { title: '100 GB SQL Database Storage', detail: 'then $0.50 per GB-month' },
      { title: '1B Firewall requests', detail: 'then as low as $0.20 per 1M' },
      ...COMPLIANCE_FEATURES,
      { title: '99.99% uptime SLA' },
      { title: 'Named account team' }
    ],
    charge: {
      monthly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' }
        ],
        total: { value: '$ 24.000', suffix: 'per year' }
      },
      yearly: {
        rows: [
          { label: 'Next Charge Value', value: '$ 2.000' },
          { label: 'Subtotal', value: '$ 24.000', suffix: 'per month' },
          { label: 'Yearly Discount', value: '$ 4.800', suffix: 'per month' }
        ],
        total: { value: '$ 19.200', suffix: 'per year' }
      }
    }
  }
}

const PRICING_LINKS = [
  { label: 'Learn more about Pricing', href: '/site/pricing' },
  { label: 'Compare Plans', href: '/site/pricing#comparison' }
]

const PERIODS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const COUNTRY_OPTIONS = [
  { value: 'Brazil', label: 'Brazil' },
  { value: 'United States', label: 'United States' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Mexico', label: 'Mexico' }
]

const STATE_OPTIONS = [
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
  { value: 'Minas Gerais', label: 'Minas Gerais' },
  { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' }
]

const CITY_OPTIONS = [
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Campinas', label: 'Campinas' },
  { value: 'Santos', label: 'Santos' }
]

const ACCOUNT_ADDRESS = {
  country: 'Brazil',
  postalCode: '01310-100',
  state: 'São Paulo',
  city: 'São Paulo',
  line2: ''
}

const BLANK_ADDRESS = {
  country: undefined,
  postalCode: '',
  state: undefined,
  city: undefined,
  line2: ''
}

const BLANK_CARD = { holder: '', country: 'Brazil', number: '', expiry: '', code: '' }

const USAGE_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'study', label: 'Study' }
]

const ROLE_OPTIONS = [
  { value: 'software_developer', label: 'Software developer' },
  { value: 'devops_engineer', label: 'DevOps engineer' },
  { value: 'infrastructure_analyst', label: 'Infrastructure analyst' },
  { value: 'network_engineer', label: 'Network engineer' },
  { value: 'security_specialist', label: 'Security specialist' },
  { value: 'data_engineer', label: 'Data engineer' },
  { value: 'ai_ml_engineer', label: 'AI/ML engineer' },
  { value: 'iot_engineer', label: 'IoT engineer' },
  { value: 'team_lead', label: 'Team lead' },
  { value: 'other', label: 'Other' }
]

const accountInitials = (name) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

const marbleOf = (name, colors) => {
  let seed = 0
  for (let index = 0; index < name.length; index += 1) {
    seed = (seed << 5) - seed + name.charCodeAt(index)
    seed |= 0
  }
  seed = Math.abs(seed)
  const unit = (value, range, position) => {
    const magnitude = value % range
    if (position && Math.floor((value / 10 ** position) % 10) % 2 === 0) return -magnitude
    return magnitude
  }
  return [0, 1, 2].map((index) => {
    const value = seed * (index + 1)
    const scale = 1.2 + unit(value, 4) / 10
    return {
      fill: colors[(seed + index) % colors.length],
      transform: `translate(${unit(value, 8, 1)} ${unit(value, 8, 2)}) rotate(${unit(value, 360, 1)} 40 40) scale(${scale})`
    }
  })
}

const swatchOf = (item) => ({
  backgroundImage: `linear-gradient(135deg, ${item.colors.join(', ')})`
})

const DEFAULT_ORG_NAME = 'Your organization'
const DEFAULT_OWNER = EMAIL.split('@')[0]
const DEFAULT_MARBLE = marbleOf(DEFAULT_ORG_NAME, ACCENTS[0].colors)

const MARBLE_PATH_BACK =
  'M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z'
const MARBLE_PATH_FRONT =
  'M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z'

const marbleMarkup = (live) => {
  const fill = (index) =>
    live
      ? `:style="{ fill: marble[${index}].fill }"`
      : `style="fill: ${DEFAULT_MARBLE[index].fill}"`
  const transform = (index) =>
    live
      ? `:transform="marble[${index}].transform"`
      : `transform="${DEFAULT_MARBLE[index].transform}"`
  return `<span
  role="img"
  ${live ? ':aria-label="previewName"' : `aria-label="${DEFAULT_ORG_NAME}"`}
  class="inline-flex size-(--size-5) shrink-0 overflow-hidden rounded-(--shape-button)"
>
  <svg
    viewBox="0 0 80 80"
    width="100%"
    height="100%"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <rect width="80" height="80" ${fill(0)} />
      <path
        filter="url(#onboarding-marble-blur)"
        ${transform(1)}
        ${fill(1)}
        d="${MARBLE_PATH_BACK}"
      />
      <path
        filter="url(#onboarding-marble-blur)"
        ${transform(2)}
        ${
          live
            ? `:style="{ fill: marble[2].fill, mixBlendMode: 'overlay' }"`
            : `style="fill: ${DEFAULT_MARBLE[2].fill}; mix-blend-mode: overlay"`
        }
        d="${MARBLE_PATH_FRONT}"
      />
    </g>
    <defs>
      <filter id="onboarding-marble-blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
</span>`
}

const PLACEHOLDER = 'rounded-(--shape-elements) bg-(--bg-placeholder)'

const navGroup = (widths, labelled) => `<div class="flex shrink-0 flex-col gap-(--spacing-sm)">
${labelled ? `  <span class="h-1.5 w-[28%] ${PLACEHOLDER}" />\n` : ''}  <span
    v-for="width in [${widths.map((width) => `'${width}'`).join(', ')}]"
    :key="width"
    class="flex items-center gap-(--spacing-sm)"
  >
    <span class="size-(--size-4) shrink-0 ${PLACEHOLDER}" />
    <span class="h-(--size-2) ${PLACEHOLDER}" :style="{ width }" />
  </span>
</div>`

const wireMarkup = (live) => `<div
  class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
>
  <figure
    class="pointer-events-none absolute inset-y-0 left-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
    aria-hidden="true"
  >
    <div
      class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
    >
      <Min class="size-(--size-5) shrink-0" />

      <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
${indent(marbleMarkup(live), 4)}
        <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
          ${live ? '{{ previewName }}' : DEFAULT_ORG_NAME}
        </span>
      </span>

      <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <Avatar label="${accountInitials(WORKSPACE_NAME)}" size="small" kind="square" class="size-(--size-5) shrink-0" />
        <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
          ${WORKSPACE_NAME}
        </span>
      </span>

      <span class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
        <span class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)" />
        <span class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)" />
        <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <div
        class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
      >
        <span class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)" />

${indent(navGroup(['58%', '76%', '48%', '66%'], false), 4)}

        <span class="h-px w-full shrink-0 bg-(--border-muted)" />

${indent(navGroup(['70%', '44%', '80%', '54%'], true), 4)}

${indent(navGroup(['62%', '78%', '50%'], true), 4)}

        <div
          class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
        >
          <Avatar ${live ? ':label="accountInitials(ownerName)"' : `label="${accountInitials(DEFAULT_OWNER)}"`} size="medium" kind="square" />
          <span class="flex min-w-0 flex-col">
            <span class="truncate text-label-sm text-(--text-default)">${live ? '{{ ownerName }}' : DEFAULT_OWNER}</span>
            <span class="truncate text-body-xs text-(--text-muted)">${EMAIL}</span>
          </span>
        </div>
      </div>

      <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
        <div class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <p class="truncate text-heading-sm text-(--text-default)">
              Hello, ${live ? '{{ ownerName }}' : DEFAULT_OWNER}
            </p>
            <p class="truncate text-body-sm text-(--text-muted)">
              ${WORKSPACE_NAME} · no workloads yet
            </p>
          </div>

          <div class="grid grid-cols-4 gap-(--spacing-md)">
            <span
              v-for="tile in 4"
              :key="tile"
              class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
            >
              <span class="h-(--size-2) w-2/3 ${PLACEHOLDER}" />
              <span class="h-(--size-3) w-1/2 ${PLACEHOLDER}" />
            </span>
          </div>

          <div
            class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
          >
            <span
              class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
            >
              <span class="h-(--size-2) w-[28%] ${PLACEHOLDER}" />
              <span class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)" />
            </span>
            <span
              v-for="row in 7"
              :key="row"
              class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
            >
              <span class="h-(--size-2) flex-1 ${PLACEHOLDER}" />
              <span class="h-(--size-2) w-[18%] ${PLACEHOLDER}" />
              <span class="h-(--size-2) w-[10%] ${PLACEHOLDER}" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </figure>
</div>`

const onboardingPage = ({ step, title, description, body, live }) => {
  const last = step === 3
  return `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console" class="shrink-0">
    <GlobalHeader.Brand>
      <a
        href="/site/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <Button label="Documentation" kind="outlined" size="medium" icon="pi pi-book" href="/site/docs" />
    </GlobalHeader.Right>
  </GlobalHeader>

  <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
    <div
      class="mx-auto grid w-full max-w-(--container-7xl) flex-1 grid-cols-1 items-center gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto lg:px-(--spacing-xl)"
    >
      <div class="mx-auto flex w-full max-w-(--container-xl) flex-col lg:my-auto">
        <CardBox :padded="false" class="w-full">
          <template #content>
            <ProgressBar
              :value="${step}"
              :max="3"
              size="small"
              shape="flat"
              class="shrink-0"
              aria-label="Step ${step} of 3"
            />

            <div
              class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
            >
              <form
                class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                aria-labelledby="onboarding-title"
                novalidate
                @submit.prevent="submitted = true"
              >
                <button type="submit" class="sr-only" aria-hidden="true" tabindex="-1" />

                <header class="flex flex-col gap-(--spacing-xs)">
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <p class="text-label-sm text-(--text-muted)">Step ${step} of 3</p>
                    <h1
                      id="onboarding-title"
                      tabindex="-1"
                      class="text-heading-sm text-(--text-default) focus:outline-none"
                    >
                      ${title}
                    </h1>
                  </div>
                  <p class="text-body-sm text-(--text-muted)">${description}</p>
                </header>

                <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                  <legend class="sr-only">${title}</legend>

                  <div class="animate-fade-in motion-reduce:animate-none">
${indent(body, 10)}
                  </div>
                </fieldset>

                <div class="flex items-center gap-(--spacing-sm)">
${step > 1 ? '                  <Button label="Back" kind="outlined" size="large" />\n' : ''}                  <Button
                    label="${last ? 'Create Organization' : 'Continue'}"
                    kind="primary"
                    size="large"
                    class="flex-1"
                    @click="submitted = true"
                  />
                </div>
              </form>
            </div>
          </template>
        </CardBox>
      </div>

      <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-mr-(--spacing-xl)">
${indent(wireMarkup(live), 4)}
      </div>
    </div>
  </main>
</div>`
}

const ORGANIZATION_BODY = `<div class="flex flex-col gap-(--spacing-lg)">
  <FieldText
    v-model="fullName"
    label="Your full name"
    input-id="onboarding-full-name"
    name="fullName"
    size="large"
    placeholder="Jane Doe"
    autocomplete="name"
    :required="submitted && !fullName.trim()"
    :helper-text="submitted && !fullName.trim() ? 'This field is required.' : 'How Azion Console will greet you.'"
  />

  <FieldText
    v-model="organizationName"
    label="Organization name"
    input-id="onboarding-org-name"
    name="organizationName"
    size="large"
    placeholder="Acme Inc."
    :required="submitted && !organizationName.trim()"
    :helper-text="submitted && !organizationName.trim() ? 'This field is required.' : 'Usually your company. Everyone you invite will see it.'"
  />

  <div class="flex flex-col gap-(--spacing-xs)">
    <Label>Organization mark</Label>
    <BoxGridSelection
      v-model="accent"
      :items="accents"
      aria-label="Organization mark"
      class="grid w-full grid-cols-4 sm:grid-cols-7"
    >
      <template #default="{ item }">
        <span class="flex flex-col items-center gap-(--spacing-xs)">
          <span class="size-(--size-8) rounded-full" :style="swatchOf(item)" />
          <span class="text-body-xs text-(--text-muted)">{{ item.label }}</span>
        </span>
      </template>
    </BoxGridSelection>
    <HelperText label="Generated from the organization's name. Select its color." />
  </div>
</div>`

const CARD_BRAND_MARK = `<span
  class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-[#2548a0]"
  aria-hidden="true"
>
  <svg
    width="22"
    height="7"
    viewBox="0 0 22 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="block"
    focusable="false"
  >
    <g clip-path="url(#card-brand-visa-clip)">
      <path
        d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="card-brand-visa-clip">
        <rect width="22" height="7" fill="white" />
      </clipPath>
    </defs>
  </svg>
</span>`

const PAYMENT_METHOD_CARD = `<CardBox title="Payment Method" :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) px-(--spacing-lg) py-(--spacing-lg)">
      <div
        v-if="!editing"
        class="flex min-h-14 flex-wrap items-center gap-(--spacing-md) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
      >
${indent(CARD_BRAND_MARK, 4)}
        <p class="min-w-0 flex-1 text-label-md text-(--text-default)">
          Ended with {{ card.last4 }}
        </p>
        <Button label="Change" kind="outlined" size="small" @click="startEditing" />
      </div>

      <template v-else>
        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
          <legend class="sr-only">Payment Method</legend>

          <FieldText
            v-model="card.holder"
            label="Cardholder's full name"
            input-id="payment-holder"
            name="cardholderName"
            size="large"
            placeholder="Jane A. Doe"
            autocomplete="cc-name"
          />

          <FieldSelect
            v-model="card.country"
            label="Country/Region"
            :options="countryOptions"
            input-id="payment-country"
            size="large"
          />

          <FieldText
            v-model="card.number"
            label="Credit card number"
            input-id="payment-number"
            name="cardNumber"
            size="large"
            placeholder="1234 5678 9012 3456"
            autocomplete="cc-number"
            inputmode="numeric"
          />

          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
            <FieldText
              v-model="card.expiry"
              label="Expiration Date (MM/YY)"
              input-id="payment-expiry"
              name="cardExpiry"
              size="large"
              placeholder="08 / 26"
              autocomplete="cc-exp"
              inputmode="numeric"
            />
            <FieldText
              v-model="card.code"
              label="Security Code (CVC/CVV)"
              input-id="payment-code"
              name="cardSecurityCode"
              size="large"
              placeholder="999"
              autocomplete="cc-csc"
              inputmode="numeric"
            />
          </div>

          <Message
            severity="info"
            size="small"
            label="Sensitive data is handled by a PCI-compliant payment partner."
          />
        </fieldset>

        <div class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:justify-end">
          <Button class="w-full sm:w-auto" label="Cancel" kind="outlined" size="medium" @click="editing = false" />
          <Button class="w-full sm:w-auto" label="Update" kind="primary" size="medium" @click="updateCard" />
        </div>
      </template>
    </div>
  </template>
</CardBox>`

const ADDRESS_CARD = `<CardBox title="Address information" :padded="false">
  <template #content>
    <fieldset
      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 px-(--spacing-lg) py-(--spacing-lg)"
    >
      <legend class="sr-only">Address information</legend>

      <FieldCheckbox
        v-model="address.useAccountInformation"
        label="Use the same information as my account"
        description="Uncheck to bill this organization at a different address."
        input-id="upgrade-same-address"
        name="useAccountInformation"
      />

      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
        <FieldSelect
          v-model="address.country"
          label="Country"
          :options="countryOptions"
          input-id="upgrade-country"
          placeholder="Select an option"
          size="large"
        />
        <FieldText
          v-model="address.postalCode"
          label="Postal Code"
          input-id="upgrade-postal-code"
          name="postalCode"
          size="large"
          placeholder="00000-000"
          autocomplete="postal-code"
        />
        <FieldSelect
          v-model="address.state"
          label="State/Region"
          :options="stateOptions"
          input-id="upgrade-state"
          placeholder="Select an option"
          size="large"
        />
        <FieldSelect
          v-model="address.city"
          label="City"
          :options="cityOptions"
          input-id="upgrade-city"
          placeholder="Select an option"
          size="large"
        />
      </div>

      <FieldText
        v-model="address.line2"
        label="Apartment, floor, etc."
        input-id="upgrade-address-line-2"
        name="addressLine2"
        size="large"
        placeholder="Optional"
        autocomplete="address-line2"
      />
    </fieldset>
  </template>
</CardBox>`

const UPGRADE_DRAWER = `<Drawer :open="upgradeOpen" size="large" side="right" @update:open="onOpenChange">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="upgrade ? 'Upgrade to ' + upgrade.name : 'Upgrade'"
        novalidate
        @submit.prevent="confirmUpgrade"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upgrade to {{ upgrade?.name }}</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-(--spacing-xl)"
          >
            <aside v-if="upgrade" class="flex flex-col gap-(--spacing-md)">
              <div class="flex flex-col gap-(--spacing-xs)">
                <h3
                  class="flex shrink-0 items-center px-(--spacing-xs) text-label-lg text-(--text-default) lg:min-h-[calc(var(--spacing-sm)*2+var(--spacing-10)+1px)] lg:border-t lg:border-t-transparent lg:py-(--spacing-sm)"
                >
                  What's included
                </h3>

                <ul class="m-0 flex list-none flex-col p-0">
                  <li
                    v-for="feature in upgrade.features"
                    :key="feature.title"
                    class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xs) odd:bg-(--bg-mask)"
                  >
                    <i
                      class="pi pi-check mt-0.5 shrink-0 text-body-xs leading-none text-(--success-contrast)"
                      aria-hidden="true"
                    />
                    <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-md text-(--text-default)">{{ feature.title }}</span>
                      <span v-if="feature.detail" class="text-body-xs text-(--text-muted)">{{ feature.detail }}</span>
                    </span>
                  </li>
                </ul>
              </div>

              <div class="flex flex-col gap-(--spacing-xs)">
                <Divider />
                <Link
                  v-for="link in pricingLinks"
                  :key="link.label"
                  :label="link.label"
                  :href="link.href"
                  target="_blank"
                  size="small"
                  class="ml-(--spacing-xs) w-fit"
                />
              </div>
            </aside>

            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <CardBox :padded="false">
                <template #header>
                  <p class="text-label-lg text-(--text-default)">Charged</p>
                  <SegmentedButton v-model="period" :options="periods" aria-label="Billing period" />
                </template>

                <template #content>
                  <div v-if="charge" class="flex flex-col">
                    <div class="flex flex-col gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-lg)">
                      <div
                        v-for="row in charge.rows"
                        :key="row.label"
                        class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
                      >
                        <span class="text-body-sm text-(--text-muted)">{{ row.label }}</span>
                        <span class="flex items-baseline gap-(--spacing-xs)">
                          <span class="text-label-md text-(--text-default)">{{ row.value }}</span>
                          <span v-if="row.suffix" class="text-body-sm text-(--text-muted)">{{ row.suffix }}</span>
                        </span>
                      </div>
                    </div>

                    <Divider />

                    <div
                      class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm) px-(--spacing-lg) py-(--spacing-lg)"
                    >
                      <span class="text-heading-xs text-(--text-default)">Total</span>
                      <span class="flex items-baseline gap-(--spacing-xs)">
                        <span class="text-heading-xs text-(--text-default)">{{ charge.total.value }}</span>
                        <span class="text-body-sm text-(--text-muted)">{{ charge.total.suffix }}</span>
                      </span>
                    </div>
                  </div>
                </template>
              </CardBox>

${indent(PAYMENT_METHOD_CARD, 7)}

${indent(ADDRESS_CARD, 7)}
            </div>
          </div>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            @click="onOpenChange(false)"
          />
          <Button
            class="w-full md:w-auto"
            label="Upgrade"
            kind="primary"
            size="medium"
            @click="confirmUpgrade"
          />
          <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">Upgrade</button>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const PLAN_BODY = `<div class="flex flex-col gap-(--spacing-xs)">
  <BoxGridSelection
    :model-value="pendingPlanId || plan"
    :items="plans"
    class="flex-col"
    aria-label="Plan"
    @update:model-value="selectPlan"
  >
    <template #default="{ item }">
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-body-sm text-(--text-default)">{{ item.label }}</span>
          <span class="text-body-xs text-(--text-muted)">{{ item.description }}</span>
        </div>
        <div class="flex shrink-0 flex-col items-end gap-(--spacing-xxs)">
          <Tag :label="item.name" :severity="item.severity" size="small" rounded />
          <span class="text-label-sm text-(--text-muted)">
            {{ item.price }}
          </span>
        </div>
      </div>
    </template>
  </BoxGridSelection>

  <HelperText v-if="submitted && !plan" kind="required" label="Select a plan to continue." />

${indent(UPGRADE_DRAWER)}
</div>`

const PROFILE_BODY = `<div class="flex flex-col gap-(--spacing-lg)">
  <div class="flex flex-col gap-(--spacing-xs)">
    <Label required>How are you planning to use Azion?</Label>
    <BoxGridSelection
      v-model="usage"
      :items="usageOptions"
      aria-label="How are you planning to use Azion?"
    />
    <HelperText v-if="submitted && !usage" kind="required" label="Select one to continue." />
  </div>

  <div class="flex flex-col gap-(--spacing-xs)">
    <Label required>What best describes your role?</Label>
    <BoxGridSelection
      v-model="role"
      :items="roleOptions"
      aria-label="What best describes your role?"
    />
    <HelperText v-if="submitted && !role" kind="required" label="Select one to continue." />
  </div>

  <FieldSwitchBlock
    v-model="session"
    label="Schedule an onboarding session with an Azion expert"
    description="A 30-minute call to create your first workload. We'll email you to schedule it."
  />
</div>`

const ORGANIZATION_TEMPLATE = onboardingPage({
  step: 1,
  title: 'Create your organization',
  description:
    'Everything you deploy on Azion lives inside an organization. Yours is created once, here, and you can invite people into it afterwards.',
  body: ORGANIZATION_BODY,
  live: true
})

const PLAN_TEMPLATE = onboardingPage({
  step: 2,
  title: 'Select your plan',
  description:
    'What you are building decides the plan. You can change it later from Billing. Nothing here is locked in.',
  body: PLAN_BODY,
  live: false
})

const PROFILE_TEMPLATE = onboardingPage({
  step: 3,
  title: 'Tell us about your work',
  description:
    'Two answers, and they only shape what we recommend you next. Neither changes your plan or what you can do.',
  body: PROFILE_BODY,
  live: false
})

const ORGANIZATION_SCRIPT = [
  declare('accents', ACCENTS),
  `const email = '${EMAIL}'`,
  '',
  "const fullName = ref('')",
  "const organizationName = ref('')",
  "const accent = ref('orange')",
  'const submitted = ref(false)',
  '',
  `const accountInitials = ${accountInitials}`,
  '',
  `const marbleOf = ${marbleOf}`,
  '',
  `const swatchOf = ${swatchOf}`,
  '',
  `const previewName = computed(() => organizationName.value.trim() || '${DEFAULT_ORG_NAME}')`,
  "const ownerName = computed(() => fullName.value.trim() || email.split('@')[0])",
  'const marble = computed(() =>',
  '  marbleOf(',
  '    previewName.value,',
  '    (accents.find((item) => item.value === accent.value) ?? accents[0]).colors',
  '  )',
  ')'
]

const PLAN_SCRIPT = [
  declare('plans', PLANS),
  declare('upgrades', UPGRADES),
  declare('pricingLinks', PRICING_LINKS),
  declare('periods', PERIODS),
  declare('countryOptions', COUNTRY_OPTIONS),
  declare('stateOptions', STATE_OPTIONS),
  declare('cityOptions', CITY_OPTIONS),
  declare('accountAddress', ACCOUNT_ADDRESS),
  declare('blankAddress', BLANK_ADDRESS),
  declare('blankCard', BLANK_CARD),
  '',
  'const plan = ref()',
  "const pendingPlanId = ref('')",
  'const upgradeOpen = ref(false)',
  'const submitted = ref(false)',
  "const period = ref('yearly')",
  'const editing = ref(false)',
  "const card = reactive({ last4: '8888', ...blankCard })",
  'const address = reactive({ useAccountInformation: true, ...accountAddress })',
  '',
  'const upgrade = computed(() => upgrades[pendingPlanId.value])',
  'const charge = computed(() => upgrade.value?.charge[period.value] ?? null)',
  '',
  'watch(',
  '  () => address.useAccountInformation,',
  '  (useAccount) => Object.assign(address, useAccount ? accountAddress : blankAddress)',
  ')',
  '',
  'const selectPlan = (value) => {',
  '  submitted.value = false',
  "  if (value === 'hobby') {",
  '    plan.value = value',
  '    return',
  '  }',
  '  pendingPlanId.value = value',
  "  period.value = 'yearly'",
  '  editing.value = false',
  '  Object.assign(address, { useAccountInformation: true, ...accountAddress })',
  '  upgradeOpen.value = true',
  '}',
  '',
  'const onOpenChange = (isOpen) => {',
  '  upgradeOpen.value = isOpen',
  "  if (!isOpen) pendingPlanId.value = ''",
  '}',
  '',
  'const confirmUpgrade = () => {',
  '  plan.value = pendingPlanId.value',
  '  onOpenChange(false)',
  '}',
  '',
  'const startEditing = () => {',
  '  Object.assign(card, blankCard)',
  '  editing.value = true',
  '}',
  '',
  'const updateCard = () => {',
  "  const digits = card.number.replace(/\\D/g, '')",
  '  if (digits.length >= 4) card.last4 = digits.slice(-4)',
  '  editing.value = false',
  '}'
]

const PROFILE_SCRIPT = [
  declare('usageOptions', USAGE_OPTIONS),
  declare('roleOptions', ROLE_OPTIONS),
  '',
  'const usage = ref()',
  'const role = ref()',
  'const session = ref(false)',
  'const submitted = ref(false)'
]

const organizationState = () => {
  const fullName = ref('')
  const organizationName = ref('')
  const accent = ref('orange')
  const previewName = computed(() => organizationName.value.trim() || DEFAULT_ORG_NAME)
  const ownerName = computed(() => fullName.value.trim() || DEFAULT_OWNER)
  const marble = computed(() =>
    marbleOf(
      previewName.value,
      (ACCENTS.find((item) => item.value === accent.value) ?? ACCENTS[0]).colors
    )
  )
  return {
    accents: ACCENTS,
    fullName,
    organizationName,
    accent,
    submitted: ref(false),
    accountInitials,
    swatchOf,
    previewName,
    ownerName,
    marble
  }
}

const planState = () => {
  const plan = ref()
  const pendingPlanId = ref('')
  const upgradeOpen = ref(false)
  const submitted = ref(false)
  const period = ref('yearly')
  const editing = ref(false)
  const card = reactive({ last4: '8888', ...BLANK_CARD })
  const address = reactive({ useAccountInformation: true, ...ACCOUNT_ADDRESS })

  const upgrade = computed(() => UPGRADES[pendingPlanId.value])
  const charge = computed(() => upgrade.value?.charge[period.value] ?? null)

  watch(
    () => address.useAccountInformation,
    (useAccount) => Object.assign(address, useAccount ? ACCOUNT_ADDRESS : BLANK_ADDRESS)
  )

  const selectPlan = (value) => {
    submitted.value = false
    if (value === 'hobby') {
      plan.value = value
      return
    }
    pendingPlanId.value = value
    period.value = 'yearly'
    editing.value = false
    Object.assign(address, { useAccountInformation: true, ...ACCOUNT_ADDRESS })
    upgradeOpen.value = true
  }

  const onOpenChange = (isOpen) => {
    upgradeOpen.value = isOpen
    if (!isOpen) pendingPlanId.value = ''
  }

  const confirmUpgrade = () => {
    plan.value = pendingPlanId.value
    onOpenChange(false)
  }

  const startEditing = () => {
    Object.assign(card, BLANK_CARD)
    editing.value = true
  }

  const updateCard = () => {
    const digits = card.number.replace(/\D/g, '')
    if (digits.length >= 4) card.last4 = digits.slice(-4)
    editing.value = false
  }

  return {
    plans: PLANS,
    pricingLinks: PRICING_LINKS,
    periods: PERIODS,
    countryOptions: COUNTRY_OPTIONS,
    stateOptions: STATE_OPTIONS,
    cityOptions: CITY_OPTIONS,
    plan,
    pendingPlanId,
    upgradeOpen,
    submitted,
    period,
    editing,
    card,
    address,
    upgrade,
    charge,
    selectPlan,
    onOpenChange,
    confirmUpgrade,
    startEditing,
    updateCard
  }
}

const profileState = () => ({
  usageOptions: USAGE_OPTIONS,
  roleOptions: ROLE_OPTIONS,
  usage: ref(),
  role: ref(),
  session: ref(false),
  submitted: ref(false)
})

const components = {
  Avatar,
  BoxGridSelection,
  Brand,
  Button,
  CardBox,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  FieldCheckbox,
  FieldSelect,
  FieldSwitchBlock,
  FieldText,
  GlobalHeader,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  HelperText,
  Label,
  Link,
  Message,
  Min,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ProgressBar,
  SegmentedButton,
  Tag
}

const meta = {
  title: 'Templates/Platform/Account/OnboardingForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The /signup/onboarding screen, frame included: the signed-out `GlobalHeader` over a two-column grid whose left column is a `CardBox` with a flat `ProgressBar`, the step counter and heading, the step’s fields and a Back / Continue row, and whose right column, from `lg` up, is a wireframe of the console the new organization will open into. The console shows one step at a time; each story here is one of the three. Built from `FieldText`, `BoxGridSelection` under a `Label` with a `HelperText`, `FieldSwitchBlock`, `Tag`, `Avatar` and `Button`; picking a paid plan opens the upgrade `Drawer` with `SegmentedButton`, `FieldSelect`, `FieldCheckbox`, `Link` and `Message`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Organization = {
  render: () => ({ components, setup: organizationState, template: ORGANIZATION_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Step 1 of 3: full name, organization name and the organization mark, with the wireframe’s organization name, mark and owner following what is typed.'
      },
      source: {
        code: toSfc(
          importsFor(ORGANIZATION_TEMPLATE, ['computed', 'ref'], ORGANIZATION_SCRIPT),
          ORGANIZATION_TEMPLATE
        )
      }
    }
  }
}

export const Plan = {
  render: () => ({ components, setup: planState, template: PLAN_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Step 2 of 3: the three plans as full-width rows; Hobby selects directly, while Pro or Enterprise opens the upgrade drawer and only selects once Upgrade is pressed.'
      },
      source: {
        code: toSfc(
          importsFor(PLAN_TEMPLATE, ['computed', 'reactive', 'ref', 'watch'], PLAN_SCRIPT),
          PLAN_TEMPLATE
        )
      }
    }
  }
}

export const Profile = {
  render: () => ({ components, setup: profileState, template: PROFILE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Step 3 of 3: the usage and role questions, the onboarding-session switch and the Create Organization action.'
      },
      source: {
        code: toSfc(importsFor(PROFILE_TEMPLATE, ['ref'], PROFILE_SCRIPT), PROFILE_TEMPLATE)
      }
    }
  }
}
