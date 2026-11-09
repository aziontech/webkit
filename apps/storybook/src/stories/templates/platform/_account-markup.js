import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { literal } from './_forms-markup'

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

export const headingAction = ({ label, icon = 'pi pi-plus', click = '' }) =>
  `<Button label="${label}" icon="${icon}" kind="outlined" size="large" class="w-full md:w-auto"${
    click ? ` @click="${click}"` : ''
  } />`

const documentationAction = (href) =>
  `<Button label="Documentation" icon="pi pi-book" kind="outlined" href="${href}" target="_blank" size="large" class="w-full md:w-auto" />`

export const pageHeading = ({
  title,
  description,
  size = 'small',
  documentation = '',
  actions = ''
}) => {
  const trailing = [documentation ? documentationAction(documentation) : '', actions]
    .filter(Boolean)
    .join('\n')
  const actionsBlock = trailing
    ? `\n  <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">\n${indent(trailing, 2)}\n  </div>`
    : ''
  return `<header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 data-size="${size}" class="${HEADING_SIZE_CLASS}">${title}</h1>
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

export const section = ({ title, hint, body }) => `<section
  data-stacked
  class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
>
  <div
    data-stacked
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <button
        type="button"
        aria-label="Copy link to the ${title} section"
        class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
      >
        <i class="pi pi-link text-body-xs" aria-hidden="true" />
      </button>
      <h2 id="${slug(title)}" class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>
      <Hint text="${hint}" class="shrink-0" />
    </div>
  </div>
  <div
    data-open
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 overflow-hidden">
      <div
        data-open
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

const searchField = ({ placeholder, ariaLabel }) => `<InputText
  v-model="search"
  size="medium"
  placeholder="${placeholder}"
  aria-label="${ariaLabel}"
  class="min-w-36 grow basis-(--container-2xs)"
>
  <template #iconLeft>
    <i class="pi pi-search" aria-hidden="true" />
  </template>
</InputText>`

const FILTER_TRIGGER = `<div class="flex shrink-0 items-center">
  <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
</div>`

const REFRESH = `<Tooltip text="Refresh" class="shrink-0">
  <IconButton icon="pi pi-refresh" kind="outlined" size="medium" ariaLabel="Refresh" />
</Tooltip>`

const exportButton = (filename) => `<Tooltip text="Download CSV" class="shrink-0">
  <IconButton
    icon="pi pi-download"
    kind="outlined"
    size="medium"
    ariaLabel="Download CSV"
    @click="table?.exportCsv({ filename: '${filename}' })"
  />
</Tooltip>`

export const COLUMNS_POPOVER = `<Popover v-model:open="columnsOpen" placement="bottom-end" class="shrink-0">
  <Popover.Trigger>
    <Tooltip text="Columns" :disabled="columnsOpen">
      <IconButton icon="ai ai-column" kind="outlined" size="medium" ariaLabel="Columns" />
    </Tooltip>
  </Popover.Trigger>
  <Popover.Content>
    <div class="flex flex-col">
      <div class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
        <p class="text-label-md text-(--text-default)">Columns</p>
      </div>
      <div class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)">
        <label
          v-for="column in columnOptions"
          :key="column.id"
          class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
          :class="column.locked ? 'cursor-default text-(--text-muted)' : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'"
        >
          <Switch
            :model-value="isVisible(column.id)"
            :disabled="column.locked"
            @update:model-value="(value) => setVisible(column.id, !!value)"
          />
          <span class="min-w-0 truncate">{{ column.label }}</span>
          <span v-if="column.locked" class="ml-auto shrink-0 text-label-xs text-(--text-muted)">Always shown</span>
        </label>
      </div>
      <div v-if="hiddenCount" class="border-t border-(--border-default) p-(--spacing-xxs)">
        <Button label="Show all columns" kind="text" size="small" class="w-full" @click="showAll" />
      </div>
    </div>
  </Popover.Content>
</Popover>`

export const controlsHeader = ({
  placeholder,
  ariaLabel,
  filename,
  refresh = REFRESH
}) => `<header class="flex items-center gap-(--layout-group-gap)">
  <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
${indent(FILTER_TRIGGER, 2)}
${indent(searchField({ placeholder, ariaLabel }), 2)}
  </div>
  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
${indent(refresh, 2)}
${indent(exportButton(filename), 2)}
${indent(COLUMNS_POPOVER, 2)}
  </div>
</header>`

export const COLUMNS_SCRIPT = (initial = {}) => [
  `const columnVisibility = ref(${Object.keys(initial).length ? literal(initial) : '{}'})`,
  'const columnsOpen = ref(false)',
  'const columnOptions = columns',
  "  .filter((column) => column.kind !== 'action')",
  '  .map((column) => ({',
  '    id: column.accessorKey,',
  '    label: column.label ?? column.header,',
  '    locked: column.hideable === false',
  '  }))',
  'const isVisible = (id) => columnVisibility.value[id] !== false',
  'const setVisible = (id, visible) => {',
  '  const next = { ...columnVisibility.value }',
  '  if (visible) delete next[id]',
  '  else next[id] = false',
  '  columnVisibility.value = next',
  '}',
  'const hiddenCount = computed(() => columnOptions.filter((column) => !isVisible(column.id)).length)',
  'const showAll = () => {',
  '  columnVisibility.value = {}',
  '}'
]

export const useColumns = (columns, initial = {}) => {
  const columnVisibility = ref({ ...initial })
  const columnsOpen = ref(false)
  const columnOptions = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.accessorKey,
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => columnOptions.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }
  return {
    columnVisibility,
    columnsOpen,
    columnOptions,
    isVisible,
    setVisible,
    hiddenCount,
    showAll
  }
}

const optionIcon = (icon) =>
  icon
    ? `>
  <template #left>
    <i class="${icon}" aria-hidden="true" />
  </template>
</Dropdown.Option>`
    : ' />'

const dropdownOption = ({ value, label, icon }) =>
  `<Dropdown.Option value="${value}" label="${label}"${optionIcon(icon)}`

const dropdownGroup = ({ options, when = '' }) =>
  `<Dropdown.Group${when ? ` v-if="${when}"` : ''}>
${indent(options.map(dropdownOption).join('\n'))}
</Dropdown.Group>`

export const rowActions = ({ label, groups, handler, when = '' }) => `<Dropdown${
  when ? ` v-if="${when}"` : ''
} placement="bottom-end" @select="(event, value) => ${handler}(event, value, row)">
  <Dropdown.Trigger>
    <Tooltip text="${label}">
      <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="${label}" />
    </Tooltip>
  </Dropdown.Trigger>
${indent(groups.map(dropdownGroup).join('\n'))}
</Dropdown>`

export const lastModifiedCell = (
  expression
) => `<div v-if="${expression}" class="flex min-w-0 items-center gap-(--spacing-xs)">
  <span class="truncate text-body-sm text-(--text-muted)">{{ ${expression} }}</span>
</div>`

export const deleteDialog = ({
  heading,
  description
}) => `<Dialog v-model:open="deleteOpen" size="medium">
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>${heading}</DialogTitle>
        <DialogClose />
      </PanelHeader>
      <PanelContent class="flex flex-col gap-(--spacing-md)">
        <Message severity="warning" label="Once confirmed, this action can't be reversed." />
        <p class="m-0 text-body-sm text-(--text-muted)">
          ${description}
          <a href="#" class="text-link">Help Center</a>
          for more details.
        </p>
        <p id="delete-confirm-label" class="m-0 flex flex-wrap items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)">
          <span>To confirm, type</span>
          <Tooltip text="Copy to clipboard" class="max-w-full">
            <button
              type="button"
              class="inline-flex max-w-full cursor-pointer items-center rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-overlay) px-(--spacing-xxs) text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
              :aria-label="copied ? 'Copied ' + pendingName : 'Copy ' + pendingName + ' to the clipboard'"
              @click="copyName"
            >
              <span class="truncate">{{ pendingName }}</span>
              <i
                :class="copied ? 'pi pi-check' : 'pi pi-copy'"
                class="ml-(--spacing-xxs) shrink-0 text-body-xs text-(--text-default)"
                aria-hidden="true"
              />
              <span
                :data-shown="copied || null"
                class="grid min-w-0 grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-shown:grid-cols-[1fr] motion-reduce:transition-none"
              >
                <span class="min-w-0 overflow-hidden">
                  <span class="block whitespace-nowrap pl-(--spacing-xxs) text-body-xs text-(--text-default)">Copied</span>
                </span>
              </span>
            </button>
          </Tooltip>
          <span>in the box below:</span>
        </p>
        <InputText
          v-model="confirmation"
          aria-labelledby="delete-confirm-label"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" size="medium" @click="deleteOpen = false" />
        <Button
          class="w-full md:w-auto"
          label="Delete"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

export const DELETE_IMPORTS = [
  webkitImport('Dialog', 'dialog'),
  webkitImport('DialogClose', 'dialog-close'),
  webkitImport('DialogContent', 'dialog-content'),
  webkitImport('DialogOverlay', 'dialog-overlay'),
  webkitImport('DialogPortal', 'dialog-portal'),
  webkitImport('DialogTitle', 'dialog-title'),
  webkitImport('Message', 'message'),
  webkitImport('PanelContent', 'panel-content'),
  webkitImport('PanelFooter', 'panel-footer'),
  webkitImport('PanelHeader', 'panel-header')
]

export const DELETE_SCRIPT = (rowsName) => [
  'const deleteOpen = ref(false)',
  'const pendingDelete = ref(null)',
  "const confirmation = ref('')",
  'const copied = ref(false)',
  "const pendingName = computed(() => pendingDelete.value?.name ?? '')",
  'const canDelete = computed(',
  '  () => confirmation.value.trim().length > 0 && confirmation.value.trim() === pendingName.value',
  ')',
  'const askDelete = (row) => {',
  '  pendingDelete.value = row',
  "  confirmation.value = ''",
  '  copied.value = false',
  '  deleteOpen.value = true',
  '}',
  'const copyName = async () => {',
  '  await navigator.clipboard.writeText(pendingName.value)',
  '  copied.value = true',
  '  setTimeout(() => (copied.value = false), 2000)',
  '}',
  'const confirmDelete = () => {',
  '  if (!canDelete.value) return',
  `  ${rowsName}.value = ${rowsName}.value.filter((row) => row.id !== pendingDelete.value.id)`,
  '  deleteOpen.value = false',
  '}'
]

export const useDeleteDialog = (rows) => {
  const deleteOpen = ref(false)
  const pendingDelete = ref(null)
  const confirmation = ref('')
  const copied = ref(false)
  const pendingName = computed(() => pendingDelete.value?.name ?? '')
  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === pendingName.value
  )
  const askDelete = (row) => {
    pendingDelete.value = row
    confirmation.value = ''
    copied.value = false
    deleteOpen.value = true
  }
  const copyName = async () => {
    await globalThis.navigator.clipboard.writeText(pendingName.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  const confirmDelete = () => {
    if (!canDelete.value) return
    rows.value = rows.value.filter((row) => row.id !== pendingDelete.value.id)
    deleteOpen.value = false
  }
  return {
    deleteOpen,
    pendingDelete,
    confirmation,
    copied,
    pendingName,
    canDelete,
    askDelete,
    copyName,
    confirmDelete
  }
}

export const listPage = ({ heading, lead = '', body, after = '' }) =>
  `<div class="min-h-0 flex-1 overflow-auto">
  <section class="layout-column layout-boundary flex min-w-0 flex-col">
${indent(heading, 2)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">${
      lead ? `\n${indent(lead, 3)}` : ''
    }
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(body, 4)}
      </section>
    </section>
  </section>${after ? `\n${indent(after)}` : ''}
</div>`

export const tableCard = ({ rows, extra = '', cells }) => `<CardBox :padded="false">
  <template #content>
    <TableRoot
      ref="table"
      v-model:globalFilter="search"
      v-model:columnVisibility="columnVisibility"
      :data="${rows}"
      :columns="columns"
      row-key="id"
      enable-sorting${extra}
      :border="false"
    >
${indent(cells.join('\n'), 3)}
    </TableRoot>
  </template>
</CardBox>`

export const PAGINATED = '\n      paginated\n      :page-size="10"'

export const LIST_SCRIPT = ["const search = ref('')", 'const table = ref(null)']

export const useList = () => ({ search: ref(''), table: ref(null) })

export const LIST_IMPORTS = [
  webkitImport('Button', 'button'),
  webkitImport('CardBox', 'card-box'),
  webkitImport('IconButton', 'icon-button'),
  webkitImport('InputText', 'input-text'),
  webkitImport('Popover', 'popover'),
  webkitImport('Switch', 'switch'),
  webkitImport('TableRoot', 'table-root'),
  webkitImport('Tooltip', 'tooltip')
]

export const webkitImports = (lines) => [...new Set(lines)].sort()
