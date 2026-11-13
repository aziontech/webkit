import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'

export { declare, literal } from './_forms-markup'

export const compound = (name, root, parts) =>
  Object.fromEntries([[name, root], ...parts.map((part) => [`${name}.${part}`, root[part]])])

export const VUE_IMPORT = (names) => `import { ${names.join(', ')} } from 'vue'`

export const webkitImport = (binding, subpath) =>
  `import ${binding} from '@aziontech/webkit/${subpath}'`

export const pageMain = (panel) => `<main class="flex h-screen flex-col bg-(--bg-canvas)">
  <div class="flex min-h-0 flex-1 flex-col">
${indent(panel, 2)}
  </div>
</main>`

const HEADING_SIZE_CLASS =
  'text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg'

const documentationAction = (href) =>
  `<Button label="Documentation" icon="pi pi-book" kind="outlined" href="${href}" target="_blank" size="medium" class="w-full md:w-auto" />`

export const pageHeading = ({
  title,
  description,
  size = 'small',
  documentation = '',
  actions = '',
  titleId = ''
}) => {
  const trailing = [documentation ? documentationAction(documentation) : '', actions]
    .filter(Boolean)
    .join('\n')
  const actionsBlock = trailing
    ? `\n  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">\n${indent(trailing, 2)}\n  </div>`
    : ''
  return `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1${titleId ? ` id="${titleId}"` : ''} data-size="${size}" class="${HEADING_SIZE_CLASS}">${title}</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">${description}</p>
  </div>${actionsBlock}
</header>`
}

const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const ANCHOR_BUTTON = (title) => `<button
  type="button"
  aria-label="Copy link to the ${title} section"
  class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
>
  <i class="pi pi-link text-body-xs" aria-hidden="true" />
</button>`

const sectionIcon = (icon) =>
  icon
    ? `\n  <i class="${icon} shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />`
    : ''

const sectionTitle = ({ title, icon, collapsible, regionId }) =>
  collapsible
    ? `<button
  type="button"
  :aria-expanded="${collapsible}"
  aria-controls="${regionId}"
  :data-state="${collapsible} ? 'open' : 'closed'"
  class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
  @click="${collapsible} = !${collapsible}"
>${sectionIcon(icon)}
  ${title}
  <i
    class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
    aria-hidden="true"
  />
</button>`
    : `<span class="flex items-center gap-(--spacing-xs)">${sectionIcon(icon)}${icon ? `\n  ${title}\n` : title}</span>`

const sectionHint = ({ hint, hintBinding }) => {
  if (hintBinding) return `\n      <Hint :text="${hintBinding}" class="shrink-0" />`
  return hint ? `\n      <Hint text="${hint}" class="shrink-0" />` : ''
}

const sectionRegion = ({ collapsible, regionId }) =>
  collapsible
    ? `<div
    id="${regionId}"
    :data-open="${collapsible} || null"
    :inert="!${collapsible} || undefined"
    :aria-hidden="!${collapsible} || undefined"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div data-collapsible class="min-w-0 data-collapsible:overflow-hidden">
      <div
        :data-open="${collapsible} || null"`
    : `<div
    data-open
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 data-collapsible:overflow-hidden">
      <div
        data-open`

export const section = ({
  title,
  hint = '',
  hintBinding = '',
  body,
  anchor = true,
  icon = '',
  collapsible = '',
  regionId = ''
}) => `<section
  data-stacked
  class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
>
  <div
    data-stacked
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">${
      anchor ? `\n${indent(ANCHOR_BUTTON(title), 3)}` : ''
    }
      <h2${anchor ? ` id="${slug(title)}"` : ''} class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
${indent(sectionTitle({ title, icon, collapsible, regionId }), 4)}
      </h2>${sectionHint({ hint, hintBinding })}
    </div>
  </div>
  ${sectionRegion({ collapsible, regionId })}
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`

const rowDescription = (description) =>
  description ? `\n    <Item.Description>${description}</Item.Description>` : ''

export const fieldRow = (title, description, control) => `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${rowDescription(description)}
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}
    </div>
  </Item.Actions>
</Item>`

export const compactRow = (title, description, control) => `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${rowDescription(description)}
  </Item.Content>
  <Item.Actions class="justify-end">
${indent(control, 2)}
  </Item.Actions>
</Item>`

export const wideRow = (
  title,
  description,
  control
) => `<Item size="small" class="flex-col items-stretch gap-(--spacing-sm)">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${rowDescription(description)}
  </Item.Content>
  <Item.Actions class="w-full justify-start">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}
    </div>
  </Item.Actions>
</Item>`

export const flushCard = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows.join('\n'), 3)}
    </Item.List>
  </template>
</CardBox>`

export const SAVE_BAR = `<Transition
  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
  leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  leave-to-class="translate-y-2 opacity-0"
>
  <footer v-if="dirty || saving" class="sticky bottom-0 z-10 h-0 shrink-0">
    <div class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14">
      <div class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0">
        <div class="flex min-w-0 items-start gap-(--spacing-xs)">
          <i class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
          <p class="min-w-0 text-body-sm text-(--text-default)">You have unsaved changes.</p>
        </div>
        <div class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)">
          <Button type="button" label="Discard" kind="outlined" size="medium" :disabled="saving" @click="discard" />
          <Button label="Save" kind="primary" size="medium" :loading="saving" @click="save" />
        </div>
      </div>
    </div>
  </footer>
</Transition>`

export const SAVED_FORM_SCRIPT = [
  'const saving = ref(false)',
  'const baseline = ref(JSON.stringify(form))',
  'const dirty = computed(() => JSON.stringify(form) !== baseline.value)',
  'const save = () => {',
  '  saving.value = true',
  '  setTimeout(() => {',
  '    baseline.value = JSON.stringify(form)',
  '    saving.value = false',
  '  }, 900)',
  '}',
  'const discard = () => Object.assign(form, JSON.parse(baseline.value))'
]

export const useSavedForm = (initial) => {
  const form = reactive(structuredClone(initial))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }
  const discard = () => Object.assign(form, JSON.parse(baseline.value))
  return { form, saving, dirty, save, discard }
}

