import { computed, reactive, ref, toValue } from 'vue'

import { indent } from '../../_shared/markup'

const quote = (text) =>
  `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n')}'`

export const literal = (value, depth = 0) => {
  if (typeof value === 'string') return quote(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const inner = '  '.repeat(depth + 1)
  const outer = '  '.repeat(depth)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${inner}${literal(item, depth + 1)}`).join(',\n')}\n${outer}]`
  }
  const entries = Object.entries(value).map(
    ([key, item]) =>
      `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key)}: ${literal(item, depth + 1)}`
  )
  if (entries.length === 0) return '{}'
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && inline.length + inner.length <= 100) return inline
  return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
}

export const declare = (name, value) => `const ${name} = ${literal(value)}`

export const HEADER_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'"
]

export const headerComponents = ({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }) => ({
  Avatar,
  Brand,
  Breadcrumb,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  IconButton
})

export const itemComponents = (
  Item,
  parts = ['List', 'Media', 'Content', 'Title', 'Description', 'Actions']
) => Object.fromEntries([['Item', Item], ...parts.map((part) => [`Item.${part}`, Item[part]])])

export const creationHeader = ({ backLabel = '', crumbs = true } = {}) => {
  const left = [
    backLabel
      ? `<IconButton icon="pi pi-chevron-left" aria-label="${backLabel}" kind="outlined" size="small" />`
      : '',
    `<GlobalHeader.Brand>
  <a
    href="/home"
    aria-label="Azion home"
    class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
  >
    <Brand kind="default" size="small" />
  </a>
</GlobalHeader.Brand>`,
    crumbs ? '<Breadcrumb :items="breadcrumb" />' : ''
  ].filter(Boolean)

  return `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
${indent(left.join('\n'), 2)}
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    <button
      type="button"
      aria-label="Account settings"
      class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
    >
      <Avatar label="myemail@azion.com" size="medium" kind="square" />
    </button>
  </GlobalHeader.Right>
</GlobalHeader>`
}

export const pageHeading = ({ title, description = '', titleId = '', size = 'small' }) => {
  const id = titleId ? ` id="${titleId}"` : ''
  const lead = description
    ? `\n    <p class="text-pretty text-body-sm text-(--text-muted)">\n${indent(description, 3)}\n    </p>`
    : ''
  return `<header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1${id} data-size="${size}" class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg">${title}</h1>
    </div>${lead}
  </div>
</header>`
}

const HEADING_ROW = 'group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)'

const SECTION_CLASS =
  'grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)'

const sectionIcon = (icon) =>
  icon
    ? `\n  <i class="${icon} shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />`
    : ''

const hintLine = (hint) => (hint ? `\n  <Hint text="${hint}" class="shrink-0" />` : '')

export const section = ({ title = '', hint = '', icon = '', aside = '', body }) => {
  const heading = title
    ? `<div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
  <div class="${HEADING_ROW}">
    <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
      <span class="flex items-center gap-(--spacing-xs)">${indent(sectionIcon(icon), 3)}
        ${title}
      </span>
    </h2>${indent(hintLine(hint), 1)}
  </div>${aside ? `\n${indent(aside, 1)}` : ''}
</div>\n`
    : ''
  return `<section class="${SECTION_CLASS}">
${indent(`${heading}<div class="flex min-w-0 flex-col gap-(--spacing-lg)">\n${indent(body, 1)}\n</div>`, 1)}
</section>`
}

export const collapsibleSection = ({
  title,
  icon = '',
  hint = '',
  regionId,
  open,
  body
}) => `<section class="${SECTION_CLASS}">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="${HEADING_ROW}">
      <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <button
          type="button"
          :aria-expanded="${open}"
          aria-controls="${regionId}"
          :data-state="${open} ? 'open' : 'closed'"
          class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          @click="${open} = !${open}"
        >${indent(sectionIcon(icon), 4)}
          ${title}
          <i
            class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      </h2>${indent(hintLine(hint), 2)}
    </div>
  </div>
  <div
    id="${regionId}"
    :data-open="${open} || null"
    :inert="!${open} || undefined"
    :aria-hidden="!${open} || undefined"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 overflow-hidden">
      <div
        :data-open="${open} || null"
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`

export const flushCard = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows, 3)}
    </Item.List>
  </template>
</CardBox>`

const ROW_CLASS = {
  field: 'items-start',
  compact: 'items-start',
  wide: 'flex-col items-stretch gap-(--spacing-sm)'
}

const ACTIONS_CLASS = {
  field: 'flex-1 justify-end max-w-(--container-3xs)',
  compact: 'justify-end',
  wide: 'w-full justify-start'
}

export const fieldRow = ({ title, description = '', kind = 'field', control, message = '' }) => {
  const text = description ? `\n    <Item.Description>${description}</Item.Description>` : ''
  const inner =
    kind === 'compact'
      ? control
      : `<div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">\n${indent(control, 1)}${message ? `\n${indent(message, 1)}` : ''}\n</div>`
  return `<Item size="small" class="${ROW_CLASS[kind]}">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${text}
  </Item.Content>
  <Item.Actions class="${ACTIONS_CLASS[kind]}">
${indent(inner, 2)}
  </Item.Actions>
</Item>`
}

export const createPage = ({
  title,
  titleId,
  description,
  body,
  start = '',
  saveLabel = 'Save',
  backLabel
}) => {
  const startSlot = start
    ? `\n${indent(`<div class="flex min-w-0 items-center gap-(--spacing-sm)">\n${indent(start, 1)}\n</div>`, 3)}`
    : ''
  return `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
${indent(creationHeader({ backLabel }), 1)}

  <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
    <form class="flex min-h-full flex-col" aria-labelledby="${titleId}" novalidate @submit.prevent="submit">
      <div class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(pageHeading({ title, description, titleId }), 4)}

        <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
          <legend class="sr-only">${title}</legend>

${indent(body, 5)}
        </fieldset>
      </div>

      <footer class="pointer-events-none sticky bottom-0 z-10 flex justify-center px-(--spacing-md) pt-(--spacing-xl) pb-(--spacing-lg)">
        <div class="pointer-events-auto flex max-w-full items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) py-(--spacing-xs) pr-(--spacing-xs) pl-(--spacing-xs) shadow-lg">${startSlot}
          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <Button type="button" label="Cancel" kind="outlined" size="medium" />
            <Button label="${saveLabel}" kind="primary" size="medium" type="submit" />
          </div>
        </div>
      </footer>
    </form>
  </main>
</div>`
}

export const stepRail = (
  ariaLabel
) => `<aside class="hidden h-full w-64 shrink-0 overflow-auto border-r border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block">
  <Stepper v-model="current" aria-label="${ariaLabel}" class="h-full">
    <Stepper.Step
      v-for="entry in steps"
      :key="entry.value"
      :value="entry.value"
      :title="entry.title"
      :description="entry.value === current ? entry.description : ''"
      :state="entry.state"
      :disabled="entry.disabled"
    />
  </Stepper>
</aside>`

export const iconTile = (
  icon,
  size = '8'
) => `<span class="flex size-${size} shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
  <i class="${icon} text-body-md leading-none text-(--text-default)" aria-hidden="true" />
</span>`

export const PAGE_SIZE = 5
export const LOAD_LATENCY_MS = 420
export const WIRE_WIDTHS = ['62%', '48%', '70%', '54%', '44%']
export const WIRE_SUB_WIDTHS = ['84%', '66%', '78%', '58%', '72%']

export const usePicker = (options, noun, initial = {}) => {
  const query = ref('')
  const chosen = ref(initial.chosen ?? '')
  const message = ref(initial.message ?? '')
  const shown = ref(PAGE_SIZE)
  const loading = ref(initial.loading ?? false)

  const chosenIndex = options.findIndex((option) => option.value === chosen.value)
  if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

  const paged = computed(() => options.length > PAGE_SIZE)
  const matches = computed(() => {
    const text = query.value.trim().toLowerCase()
    if (!text) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(text) ||
        String(option.description ?? '')
          .toLowerCase()
          .includes(text)
    )
  })
  const visible = computed(() => matches.value.slice(0, shown.value))
  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  const summary = computed(() => {
    if (loading.value) return `Loading ${nextBatch.value} more ${noun}s`
    if (query.value.trim() && !matches.value.length) return `No ${noun} matches ${query.value}`
    if (remaining.value) return `${visible.value.length} of ${matches.value.length} ${noun}s`
    return query.value.trim()
      ? `${matches.value.length} of ${options.length} ${noun}s`
      : `${options.length} ${noun}s`
  })

  const loadMore = () => {
    if (loading.value || !remaining.value) return
    loading.value = true
    setTimeout(() => {
      shown.value += PAGE_SIZE
      loading.value = false
    }, LOAD_LATENCY_MS)
  }

  return reactive({
    query,
    chosen,
    message,
    loading,
    paged,
    matches,
    visible,
    remaining,
    nextBatch,
    summary,
    loadMore
  })
}

export const PICKER_SCRIPT = [
  `const PAGE_SIZE = ${PAGE_SIZE}`,
  declare('wireWidths', WIRE_WIDTHS),
  declare('wireSubWidths', WIRE_SUB_WIDTHS),
  '',
  'const usePicker = (options, noun, initial = {}) => {',
  "  const query = ref('')",
  "  const chosen = ref(initial.chosen ?? '')",
  "  const message = ref(initial.message ?? '')",
  '  const shown = ref(PAGE_SIZE)',
  '  const loading = ref(initial.loading ?? false)',
  '',
  '  const chosenIndex = options.findIndex((option) => option.value === chosen.value)',
  '  if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE',
  '',
  '  const paged = computed(() => options.length > PAGE_SIZE)',
  '  const matches = computed(() => {',
  '    const text = query.value.trim().toLowerCase()',
  '    if (!text) return options',
  '    return options.filter(',
  '      (option) =>',
  '        option.label.toLowerCase().includes(text) ||',
  "        String(option.description ?? '').toLowerCase().includes(text)",
  '    )',
  '  })',
  '  const visible = computed(() => matches.value.slice(0, shown.value))',
  '  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))',
  '  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))',
  '',
  '  const summary = computed(() => {',
  "    if (loading.value) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'",
  "    if (query.value.trim() && !matches.value.length) return 'No ' + noun + ' matches ' + query.value",
  "    if (remaining.value) return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'",
  '    return query.value.trim()',
  "      ? matches.value.length + ' of ' + options.length + ' ' + noun + 's'",
  "      : options.length + ' ' + noun + 's'",
  '  })',
  '',
  '  const loadMore = () => {',
  '    if (loading.value || !remaining.value) return',
  '    loading.value = true',
  '    setTimeout(() => {',
  '      shown.value += PAGE_SIZE',
  '      loading.value = false',
  `    }, ${LOAD_LATENCY_MS})`,
  '  }',
  '',
  '  return reactive({',
  '    query,',
  '    chosen,',
  '    message,',
  '    loading,',
  '    paged,',
  '    matches,',
  '    visible,',
  '    remaining,',
  '    nextBatch,',
  '    summary,',
  '    loadMore',
  '  })',
  '}'
]

export const pickerList = ({ picker, noun, icon }) => `<div
  v-if="${picker}.paged || ${picker}.message"
  :data-field-invalid="${picker}.message || null"
  class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
>
  <InputText v-if="${picker}.paged" v-model="${picker}.query" size="large" class="w-full" placeholder="Search ${noun}s" aria-label="Search ${noun}s">
    <template #iconLeft>
      <i class="pi pi-search" aria-hidden="true" />
    </template>
  </InputText>

  <HelperText v-if="${picker}.message" kind="required">{{ ${picker}.message }}</HelperText>
</div>

<div class="border-t border-(--border-default)">
  <Item.List>
    <Item v-for="option in ${picker}.visible" :key="option.value" as-child size="small">
      <button
        type="button"
        class="w-full text-left data-[selected]:bg-(--bg-selected)"
        :data-selected="option.value === ${picker}.chosen || null"
        :aria-pressed="option.value === ${picker}.chosen"
        @click="${picker}.chosen = option.value"
      >
        <Item.Media>
${indent(iconTile(icon), 5)}
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ option.label }}</Item.Title>
          <Item.Description>{{ option.description }}</Item.Description>
        </Item.Content>
        <Item.Actions>
          <i v-if="option.value === ${picker}.chosen" class="pi pi-check shrink-0 text-(--text-default)" aria-hidden="true" />
        </Item.Actions>
      </button>
    </Item>

    <template v-if="${picker}.loading">
      <Item v-for="index in ${picker}.nextBatch" :key="'wire-' + index" size="small" aria-hidden="true">
        <Item.Media>
          <Skeleton kind="shape" width="2rem" height="2rem" />
        </Item.Media>
        <Item.Content class="gap-(--spacing-xs)">
          <Skeleton :width="wireWidths[(index - 1) % wireWidths.length]" height="0.875rem" />
          <Skeleton :width="wireSubWidths[(index - 1) % wireSubWidths.length]" height="0.75rem" />
        </Item.Content>
      </Item>
    </template>
  </Item.List>

  <div v-if="${picker}.remaining" class="border-t border-(--border-default) p-(--spacing-xxs)">
    <Button
      type="button"
      :label="'Load ' + ${picker}.nextBatch + ' more'"
      kind="text"
      size="small"
      class="w-full"
      :loading="${picker}.loading"
      @click="${picker}.loadMore"
    />
  </div>

  <p v-if="!${picker}.matches.length" class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)">
    No ${noun} matches “{{ ${picker}.query }}”. Create one instead, or clear the search.
  </p>

  <span class="sr-only" role="status">{{ ${picker}.summary }}</span>
</div>`

const fieldHelper = (description, message) => {
  if (message) return `:helper-text="${message} || '${description.replaceAll("'", "\\'")}'"`
  return description ? `helper-text="${description}"` : ''
}

export const fieldStack = ({
  id,
  label,
  hint = '',
  required = false,
  description = '',
  message = '',
  control = '',
  group = false,
  className = '',
  field = 'FieldText',
  model = '',
  placeholder = '',
  options = '',
  iconRight = '',
  when = ''
}) => {
  if (!control) {
    const attrs = [
      when ? `v-if="${when}"` : '',
      `input-id="${id}"`,
      `v-model="${model}"`,
      `label="${label}"`,
      'size="large"',
      options ? `:options="${options}"` : '',
      placeholder ? `placeholder="${placeholder}"` : '',
      required && message ? `:required="!!${message}"` : '',
      fieldHelper(description, message),
      className ? `class="${className}"` : ''
    ].filter(Boolean)
    const open = `<${field}\n${attrs.map((attr) => `  ${attr}`).join('\n')}`
    if (!iconRight) return `${open}\n/>`
    return `${open}\n>\n  <template #iconRight>\n${indent(iconRight, 2)}\n  </template>\n</${field}>`
  }
  const helper = message
    ? `\n<HelperText id="${id}-helper" :kind="${message} ? 'required' : 'helper'">\n  {{ ${message} || '${description.replaceAll("'", "\\'")}' }}\n</HelperText>`
    : description
      ? `\n<HelperText id="${id}-helper" kind="helper">\n  ${description}\n</HelperText>`
      : ''
  const labelAttrs = [
    group ? `id="${id}-label"` : `for="${id}"`,
    required && message ? `:required="!!${message}"` : '',
    hint ? `hint="${hint}"` : ''
  ].filter(Boolean)
  return `<div${when ? ` v-if="${when}"` : ''}${message ? ` :data-field-invalid="!!${message} || null"` : ''} class="flex w-full min-w-0 flex-col gap-(--spacing-xs)${className ? ` ${className}` : ''}">
  <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
    <Label ${labelAttrs.join(' ')}>
      ${label}
    </Label>
  </div>
${indent(control, 1)}${indent(helper, 1)}
</div>`
}

export const APPLICATION_OPTIONS = [
  { value: 'azion-site', label: 'azion-site', description: 'Astro · aziontech/azion-site' },
  {
    value: 'black-friday-2025',
    label: 'black-friday-2025',
    description: 'Next.js · aziontech/black-friday-2025'
  },
  {
    value: 'black-friday-2026',
    label: 'black-friday-2026',
    description: 'Next.js · aziontech/black-friday-2026'
  },
  { value: 'azion-docs', label: 'azion-docs', description: 'Astro · aziontech/azion-docs' },
  {
    value: 'azion-docs-next',
    label: 'azion-docs-next',
    description: 'Next.js · aziontech/azion-docs-next'
  },
  {
    value: 'webkit-sample-vue',
    label: 'webkit-sample-vue',
    description: 'Vue · gab-az/webkit-sample-vue'
  },
  { value: 'hello-edge', label: 'hello-edge', description: 'JavaScript · ' },
  { value: 'edgeflow-site', label: 'edgeflow-site', description: 'HTML · edgeflow/edgeflow-site' },
  { value: 'edgeflow-docs', label: 'edgeflow-docs', description: 'HTML · ' },
  { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
  { value: 'analytics-edge', label: 'analytics-edge', description: 'Next.js · ' },
  {
    value: 'react-dashboard',
    label: 'react-dashboard',
    description: 'React · acme/react-dashboard'
  },
  { value: 'docs-portal', label: 'docs-portal', description: 'Vue · ' },
  { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · shopco/ecommerce-v2' },
  { value: 'ecommerce-storefront', label: 'ecommerce-storefront', description: 'Nuxt · ' },
  { value: 'marketing-site', label: 'marketing-site', description: 'Astro · acme/marketing-site' },
  { value: 'blog-platform', label: 'blog-platform', description: 'Astro · ' },
  { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
  { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · ' }
]

export const APPLICATION_MODES = [
  { label: 'Existing application', value: 'existing' },
  { label: 'New application', value: 'new' }
]

export const applicationBindingCard = ({
  mode = 'mode',
  name = 'name',
  picker = 'applicationPicker'
} = {}) => `<CardBox :padded="false" title="Application">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
      <p class="text-body-sm text-(--text-muted)">
        What this workload serves on each environment, so one workload can serve different applications on Production and Preview.
      </p>
      <SegmentedButton v-model="${mode}" :options="applicationModes" size="large" fluid aria-label="Where the application comes from" />

      <p v-if="${mode} === 'existing'" class="text-body-sm text-(--text-muted)">
        The release serves the latest ready version of the selected application, and an older one can be pinned from the deployment.
      </p>

${indent(
  fieldStack({
    id: 'application-name',
    label: 'Name',
    required: true,
    description: 'Lowercase letters, numbers, and hyphens.',
    message: `${picker}.message`,
    className: 'pb-(--spacing-md)',
    model: name,
    placeholder: 'my-application',
    when: `${mode} === 'new'`
  }),
  3
)}
    </div>

    <div v-if="${mode} === 'existing'" class="min-w-0 pt-(--spacing-md)">
${indent(pickerList({ picker, noun: 'application', icon: 'ai ai-edge-application' }), 3)}
    </div>
  </template>
</CardBox>`

export const wizardPage = ({ title, titleId, description, backLabel, body, heading = '' }) => {
  const headingBlock = indent(pageHeading({ title, description, titleId }), 1)
  return `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
${indent(creationHeader({ backLabel }), 1)}

  <div class="flex min-h-0 flex-1">
${indent(stepRail(title), 2)}

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 min-w-0 flex-1 flex-col">
      <form class="flex min-h-0 flex-1 flex-col" aria-labelledby="${titleId}" novalidate @submit.prevent="advance">
        <div class="min-h-0 flex-1 overflow-y-auto scrollbar-gutter-both">
          <div class="flex min-h-full flex-col pb-(--layout-section-gap)">
            <div${heading ? ` v-if="${heading}"` : ''} class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)">
${indent(headingBlock, 6)}
            </div>

            <p class="layout-column-form layout-boundary-inline pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
              Step {{ Math.min(stepIndex + 1, steps.length) }} of {{ steps.length }}
            </p>

            <fieldset class="layout-column-form layout-boundary-inline flex min-w-0 flex-col border-0 p-0 pt-(--layout-section-gap)">
              <legend class="sr-only">${title}</legend>

              <div class="relative">
                <div :key="current" class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none">
${indent(body, 9)}
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <footer v-if="stepIndex > 0 || nextLabel" class="shrink-0 bg-linear-to-b from-transparent to-(--bg-canvas) pb-(--spacing-lg) pt-(--spacing-xl)">
          <div class="layout-column-form layout-boundary-inline flex w-full items-center gap-(--spacing-md)">
            <Button v-if="stepIndex > 0" key="back" type="button" label="Back" kind="outlined" size="medium" @click="goBack" />
            <Button v-if="nextLabel" key="next" class="ms-auto" :label="nextLabel" kind="primary" size="medium" type="submit" />
          </div>
        </footer>
      </form>
    </main>
  </div>
</div>`
}

export const WIZARD_RAIL_SCRIPT = [
  'const steps = computed(() =>',
  '  wizardSteps.map((entry, position) => ({',
  '    value: entry.id,',
  '    title: entry.label,',
  "    description: entry.description ?? '',",
  "    state: position < stepIndex.value ? 'complete' : 'upcoming',",
  '    disabled: position > stepIndex.value',
  '  }))',
  ')',
  '',
  'const current = computed({',
  '  get: () => wizardSteps[stepIndex.value].id,',
  '  set: (value) => {',
  '    const position = wizardSteps.findIndex((entry) => entry.id === value)',
  '    if (position !== -1 && position < stepIndex.value) stepIndex.value = position',
  '  }',
  '})',
  '',
  'const goBack = () => {',
  '  if (stepIndex.value > 0) stepIndex.value -= 1',
  '}'
]

export const useWizardRail = (wizardSteps, stepIndex) => {
  const steps = computed(() =>
    toValue(wizardSteps).map((entry, position) => ({
      value: entry.id,
      title: entry.label,
      description: entry.description ?? '',
      state: position < stepIndex.value ? 'complete' : 'upcoming',
      disabled: position > stepIndex.value
    }))
  )
  const current = computed({
    get: () => toValue(wizardSteps)[stepIndex.value].id,
    set: (value) => {
      const position = toValue(wizardSteps).findIndex((entry) => entry.id === value)
      if (position !== -1 && position < stepIndex.value) stepIndex.value = position
    }
  })
  const goBack = () => {
    if (stepIndex.value > 0) stepIndex.value -= 1
  }
  return { steps, current, goBack }
}
