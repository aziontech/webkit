import Avatar from '@aziontech/webkit/avatar'
import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import CalendarRoot from '@aziontech/webkit/calendar-root'
import CardBox from '@aziontech/webkit/card-box'
import Chip from '@aziontech/webkit/chip'
import CopyButton from '@aziontech/webkit/copy-button'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import Dropdown from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Link from '@aziontech/webkit/link'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, nextTick, ref, toValue, watch } from 'vue'

import { indent } from '../../_shared/markup'

const VUE = { computed, nextTick, ref, toValue, watch }

const COMPONENTS = {
  Avatar,
  Badge,
  Button,
  CalendarRoot,
  CardBox,
  Chip,
  CopyButton,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  Dropdown,
  EmptyState,
  IconButton,
  InputText,
  Link,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Popover,
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const NATIVE = new Set(['Transition', 'TransitionGroup'])

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const tagsOf = (markup) =>
  [...new Set([...markup.matchAll(/<([A-Z][\w.]*)/g)].map((match) => match[1]))].filter(
    (tag) => !NATIVE.has(tag)
  )

export const componentsFor = (markup) =>
  Object.fromEntries(
    tagsOf(markup).map((tag) => {
      const [root, part] = tag.split('.')
      return [tag, part ? COMPONENTS[root]?.[part] : COMPONENTS[root]]
    })
  )

export const scriptOf = (markup, body) => {
  const roots = [...new Set(tagsOf(markup).map((tag) => tag.split('.')[0]))].sort()
  const vue = Object.keys(VUE).filter((name) => new RegExp(`\\b${name}\\(`).test(body))
  return [
    ...roots.map((name) => `import ${name} from '@aziontech/webkit/${kebab(name)}'`),
    ...(vue.length ? [`import { ${vue.join(', ')} } from 'vue'`] : []),
    '',
    ...body.split('\n')
  ]
}

export const runScript = (body) => {
  const names = [...new Set([...body.matchAll(/^(?:const|let) (\w+)/gm)].map((match) => match[1]))]
  return new Function(...Object.keys(VUE), `${body}\nreturn { ${names.join(', ')} }`)(
    ...Object.values(VUE)
  )
}

export const pageHeading = ({
  title,
  description,
  action = ''
}) => `<header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1
        data-size="medium"
        class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
      >
        ${title}
      </h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">
      ${description}
    </p>
  </div>${
    action
      ? `\n  <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">\n${indent(action, 2)}\n  </div>`
      : ''
  }
</header>`

export const page = (main) => `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
${indent(main)}
</div>`

export const RELATIVE_TIME = `const relativeTime = (input) => {
  if (!input) return ''
  const then = input instanceof Date ? input : new Date(input)
  const ms = then.getTime()
  if (Number.isNaN(ms)) return ''
  const diff = Math.max(0, Date.now() - ms)
  const sec = Math.round(diff / 1000)
  if (sec < 45) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return min + ' min ago'
  const hour = Math.round(min / 60)
  if (hour < 24) return hour + (hour === 1 ? ' hour' : ' hours') + ' ago'
  const day = Math.round(hour / 24)
  if (day < 7) return day + (day === 1 ? ' day' : ' days') + ' ago'
  if (day < 30) {
    const week = Math.round(day / 7)
    return week + (week === 1 ? ' week' : ' weeks') + ' ago'
  }
  const month = Math.round(day / 30)
  if (month < 12) return month + (month === 1 ? ' month' : ' months') + ' ago'
  const year = Math.round(day / 365)
  return year + (year === 1 ? ' year' : ' years') + ' ago'
}`

export const FILTER_SCRIPT = `const isApplied = (state, field) => Boolean(state[field.id]?.length)

const summarize = (field, values = []) => {
  if (!values.length) return null
  const first = field.options?.find((option) => option.value === values[0])
  if (first) return { label: first.label, extra: values.length - 1 }
  const label = field.formatValue ? field.formatValue(values[0]) : String(values[0])
  return { label, extra: values.length - 1 }
}

const summarizeText = (field, values = []) => {
  const parts = summarize(field, values)
  if (!parts) return ''
  return parts.extra ? parts.label + ' +' + parts.extra : parts.label
}

const pickedAvatars = (field, values = [], max = 3) =>
  (field.options ?? [])
    .filter((option) => values.includes(option.value) && 'avatar' in option)
    .slice(0, max)

const toggleValue = (state, field, value) => {
  const current = state[field.id] ?? []
  if (field.kind === 'range') {
    return { ...state, [field.id]: current[0] === value ? [] : [value] }
  }
  return {
    ...state,
    [field.id]: current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  }
}

const clearField = (state, field) => {
  const next = { ...state }
  delete next[field.id]
  return next
}

const filterCount = computed(
  () => Object.values(filters.value).filter((values) => values?.length).length
)

const filterOpen = ref(false)
const filterFieldId = ref(null)
const filterQuery = ref('')
const filterPanel = ref(null)
const filterRoot = ref(null)
const filterOriginId = ref(null)
const filterDirection = ref('forward')
const customFieldId = ref(null)
const calendarOpen = ref(false)
const customRange = ref(null)

const customFilterField = computed(() =>
  toValue(filterFields).find((field) => field.id === customFieldId.value)
)

const filterField = computed(
  () =>
    toValue(filterFields).find((field) => field.id === filterFieldId.value) ??
    customFilterField.value
)

const filterLevel = computed(() => {
  if (customFieldId.value) return \`custom:\${customFieldId.value}\`
  return filterFieldId.value ? \`values:\${filterFieldId.value}\` : 'fields'
})

const filterRegion = ref(null)
const filterRegionHeight = ref('')
let releaseFilterHeight = null

const animateFilterHeight = async (mutate) => {
  const node = filterRegion.value
  if (!node || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    mutate()
    return
  }
  releaseFilterHeight?.()
  const from = node.offsetHeight
  mutate()
  await nextTick()
  const to = node.offsetHeight
  if (to === from) return
  filterRegionHeight.value = \`\${from}px\`
  let timer = null
  const finish = () => {
    node.removeEventListener('transitionend', onEnd)
    clearTimeout(timer)
    filterRegionHeight.value = ''
    releaseFilterHeight = null
  }
  const onEnd = (event) => {
    if (event.propertyName === 'height' && event.target === node) finish()
  }
  node.addEventListener('transitionend', onEnd)
  timer = setTimeout(finish, 600)
  releaseFilterHeight = finish
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (releaseFilterHeight === finish) filterRegionHeight.value = \`\${to}px\`
    })
  )
}

const toFilterLevel = (direction, mutate) => {
  filterDirection.value = direction
  animateFilterHeight(mutate)
}

const filterRows = computed(() => {
  const term = filterQuery.value.trim().toLowerCase()
  const source = filterField.value ? (filterField.value.options ?? []) : toValue(filterFields)
  if (!term) return source
  return source.filter((row) => row.label.toLowerCase().includes(term))
})

const isPicked = (value) => (filters.value[filterFieldId.value] ?? []).includes(value)

const enterFilterField = (fieldId) => {
  filterOriginId.value = fieldId
  if (filterOpen.value) {
    toFilterLevel('forward', () => {
      filterFieldId.value = fieldId
      filterQuery.value = ''
    })
    return
  }
  filterFieldId.value = fieldId
  filterQuery.value = ''
  filterOpen.value = true
}

const backToFields = () => {
  toFilterLevel('back', () => {
    filterFieldId.value = null
    filterQuery.value = ''
  })
}

const focusFilterOrigin = async (id) => {
  await nextTick()
  const field = id ? toValue(filterFields).find((item) => item.id === id) : null
  const chip =
    field && isApplied(filters.value, field)
      ? document.querySelector(\`[data-filter-chip="\${id}"]\`)
      : null
  ;(chip ?? filterRoot.value?.querySelector('[data-testid="filter-button__trigger"]'))?.focus()
}

watch(filterOpen, (isOpen) => {
  if (isOpen) return
  filterFieldId.value = null
  customFieldId.value = null
  calendarOpen.value = false
  customRange.value = null
  filterQuery.value = ''
  filterDirection.value = 'forward'
  const id = filterOriginId.value
  filterOriginId.value = null
  focusFilterOrigin(id)
})

const pickFilterOption = (field, option) => {
  if (option.custom) {
    toFilterLevel('forward', () => {
      customFieldId.value = field.id
    })
    calendarOpen.value = true
    return
  }
  filters.value = toggleValue(filters.value, field, option.value)
  if (field.kind === 'range') backToFields()
}

const leaveCustomRange = () => {
  calendarOpen.value = false
  customRange.value = null
  toFilterLevel('back', () => {
    customFieldId.value = null
  })
}

const commitCustomRange = (range) => {
  const field = customFilterField.value
  if (!field) return
  const next = { ...filters.value }
  if (range?.start || range?.end) next[field.id] = [range]
  else delete next[field.id]
  filters.value = next
  const id = field.id
  leaveCustomRange()
  backToFields()
  filterOpen.value = false
  focusFilterOrigin(id)
}

const clearFilterField = (field) => {
  filters.value = clearField(filters.value, field)
}

const filterLevelRows = () => [
  ...(filterPanel.value?.querySelectorAll(\`[data-level="\${filterLevel.value}"] [data-filter-row]\`) ??
    [])
]

const moveFilterFocus = (event, step) => {
  const items = filterLevelRows()
  if (!items.length) return
  event.preventDefault()
  const index = items.indexOf(event.target)
  items[(index + step + items.length) % items.length]?.focus()
}

watch(filterLevel, async () => {
  await nextTick()
  filterLevelRows()[0]?.focus()
})

const filterChips = computed(() => toValue(filterFields).filter((field) => isApplied(filters.value, field)))

const summarizeFilter = (field) => summarize(field, filters.value[field.id])

const avatarsOf = (field) => pickedAvatars(field, filters.value[field.id])`

const FILTER_ROW =
  'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

export const FILTER_BUTTON = `<div ref="filterRoot" class="flex shrink-0 items-center" data-testid="filter-button">
  <Popover v-model:open="filterOpen" placement="bottom-start" :dismissible="!calendarOpen" class="shrink-0">
    <Popover.Trigger class="relative">
      <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" data-testid="filter-button__trigger" />
      <Transition
        enter-from-class="scale-75 opacity-0"
        enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-to-class="scale-75 opacity-0"
        leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      >
        <Badge
          v-if="filterCount"
          :label="String(filterCount)"
          severity="primary"
          size="small"
          aria-hidden="true"
          data-testid="filter-button__count"
          class="pointer-events-none absolute -top-2 -right-2 min-w-5"
        />
      </Transition>
    </Popover.Trigger>

    <Popover.Content>
      <div ref="filterPanel" class="flex flex-col" @keydown.down="moveFilterFocus($event, 1)" @keydown.up="moveFilterFocus($event, -1)">
        <div
          ref="filterRegion"
          :style="{ height: filterRegionHeight }"
          class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        >
          <Transition
            :enter-from-class="filterDirection === 'forward' ? 'translate-x-[12%] opacity-0' : 'translate-x-[-12%] opacity-0'"
            enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
            :leave-to-class="filterDirection === 'forward' ? 'translate-x-[-12%] opacity-0' : 'translate-x-[12%] opacity-0'"
            leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          >
            <div :key="filterLevel" :data-level="filterLevel" class="flex flex-col">
              <div v-if="filterField" class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)">
                <IconButton
                  icon="pi pi-angle-left"
                  kind="outlined"
                  size="small"
                  :aria-label="customFilterField ? 'Back to date periods' : 'Back to all filters'"
                  @click="customFilterField ? leaveCustomRange() : backToFields()"
                />
                <span class="truncate text-label-sm text-(--text-default)">
                  {{ filterField.label }}
                </span>
              </div>

              <div v-if="customFilterField" class="px-(--spacing-md) py-(--spacing-sm)">
                <CalendarRoot
                  v-model="customRange"
                  v-model:open="calendarOpen"
                  mode="range"
                  size="medium"
                  :show-fields="false"
                  placeholder="Pick a range"
                  class="w-full [&>span]:w-full [&>span>span]:w-full"
                  @update:model-value="commitCustomRange"
                />
              </div>

              <template v-else>
                <div class="border-b border-(--border-default) p-(--spacing-xs)">
                  <InputText
                    v-model="filterQuery"
                    size="medium"
                    class="w-full"
                    :placeholder="filterField ? \`Filter \${filterField.label.toLowerCase()}…\` : 'Filter by…'"
                    :aria-label="filterField ? \`Search \${filterField.label} values\` : 'Search filter fields'"
                  >
                    <template #iconLeft>
                      <i class="pi pi-search" aria-hidden="true" />
                    </template>
                  </InputText>
                </div>

                <div class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)">
                  <template v-if="!filterField">
                    <button
                      v-for="field in filterRows"
                      :key="field.id"
                      type="button"
                      data-filter-row
                      class="${FILTER_ROW}"
                      :aria-expanded="false"
                      @click="enterFilterField(field.id)"
                    >
                      <span class="grow truncate">{{ field.label }}</span>
                      <span v-if="isApplied(filters, field)" class="truncate text-(--text-muted)">
                        {{ summarizeText(field, filters[field.id]) }}
                      </span>
                      <i class="pi pi-angle-right shrink-0 text-(--text-muted)" aria-hidden="true" />
                    </button>
                  </template>

                  <template v-else>
                    <button
                      v-for="option in filterRows"
                      :key="String(option.value)"
                      type="button"
                      data-filter-row
                      :role="option.custom ? undefined : filterField.kind === 'range' ? 'menuitemradio' : 'menuitemcheckbox'"
                      :aria-checked="option.custom ? undefined : isPicked(option.value)"
                      class="${FILTER_ROW}"
                      @click="pickFilterOption(filterField, option)"
                    >
                      <Avatar
                        v-if="'avatar' in option"
                        :src="option.avatar || undefined"
                        :alt="option.label"
                        :label="option.label"
                        size="small"
                        kind="square"
                        class="shrink-0"
                      />
                      <span class="grow truncate">{{ option.label }}</span>
                      <i v-if="option.custom" class="pi pi-angle-right shrink-0 text-(--text-muted)" aria-hidden="true" />
                      <i
                        v-else
                        class="pi pi-check shrink-0 text-(--text-default)"
                        :class="isPicked(option.value) ? '' : 'invisible'"
                        aria-hidden="true"
                      />
                    </button>
                  </template>

                  <p v-if="!filterRows.length" class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)">
                    No match for “{{ filterQuery }}”.
                  </p>
                </div>

                <div v-if="filterField && isApplied(filters, filterField)" class="border-t border-(--border-default) p-(--spacing-xxs)">
                  <button type="button" class="${FILTER_ROW}" @click="clearFilterField(filterField)">
                    <i class="pi pi-filter-slash text-(--text-muted)" aria-hidden="true" />
                    Clear {{ filterField.label }}
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </Popover.Content>
  </Popover>
</div>`

export const FILTER_CHIPS = `<div v-if="filterChips.length" class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)" data-testid="filter-chips">
  <TransitionGroup
    move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="scale-90 opacity-0"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-90 opacity-0"
    leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  >
    <span
      v-for="field in filterChips"
      :key="field.id"
      class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    >
      <Chip
        :data-filter-chip="field.id"
        :label="field.label"
        kind="filled"
        size="medium"
        clickable
        removable
        @click="enterFilterField(field.id)"
        @remove="clearFilterField(field)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <span class="truncate text-(--text-muted)">{{ field.label }}</span>
          <span v-if="avatarsOf(field).length" class="flex shrink-0 items-center">
            <Avatar
              v-for="(option, i) in avatarsOf(field)"
              :key="String(option.value)"
              :src="option.avatar || undefined"
              :alt="option.label"
              :label="option.label"
              size="small"
              kind="circle"
              class="size-4 ring-1 ring-(--bg-surface)"
              :class="i > 0 ? '-ml-1' : ''"
            />
          </span>
          <span class="truncate">{{ summarizeFilter(field)?.label }}</span>
          <span v-if="summarizeFilter(field)?.extra" class="shrink-0 text-(--text-muted)">
            +{{ summarizeFilter(field).extra }}
          </span>
        </span>
      </Chip>
    </span>
  </TransitionGroup>
</div>`
