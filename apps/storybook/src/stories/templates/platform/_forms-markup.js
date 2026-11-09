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
    ([key, item]) => `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key)}: ${literal(item, depth + 1)}`
  )
  if (entries.length === 0) return '{}'
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && inline.length + inner.length <= 96) return inline
  return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
}

export const declare = (name, value, wrap = '') =>
  `const ${name} = ${wrap ? `${wrap}(${literal(value)})` : literal(value)}`

export const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const description = (text) => (text ? `\n    <Item.Description>${text}</Item.Description>` : '')

const NESTED_CLASS =
  'data-[level]:before:absolute data-[level]:before:inset-y-0 data-[level]:before:w-px data-[level]:before:bg-(--border-default) data-[level=1]:pl-[calc(var(--spacing-md)*2)]! data-[level=1]:before:left-[calc(var(--spacing-md)+var(--spacing-xxs))] data-[level=2]:pl-[calc(var(--spacing-md)*3)]! data-[level=2]:before:left-[calc(var(--spacing-md)*2+var(--spacing-xxs))]'

const rowOpen = (layoutClass, { level = 0, attrs = '' } = {}) =>
  level
    ? `<Item${attrs} size="small" data-level="${level}" class="${layoutClass} ${NESTED_CLASS}">`
    : `<Item${attrs} size="small" class="${layoutClass}">`

const rowMessage = ({
  message = '',
  messageKind = 'helper',
  messageId = '',
  messageWhen = '',
  messageText = ''
}) => {
  if (messageWhen) {
    return `\n<HelperText v-if="${messageWhen}" id="${messageId}" :kind="${messageKind}" :label="${messageText}" />`
  }
  if (!message) return ''
  return `\n<HelperText${messageId ? ` id="${messageId}"` : ''} kind="${messageKind}" label="${message}" />`
}

export const fieldRow = (title, text, control, options = {}) => `${rowOpen('items-start', options)}
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(`${control}${rowMessage(options)}`, 3)}
    </div>
  </Item.Actions>
</Item>`

export const compactRow = (title, text, control, options = {}) => `${rowOpen('items-start', options)}
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
  </Item.Content>
  <Item.Actions class="justify-end">
${indent(control, 2)}
  </Item.Actions>
</Item>`

export const wideRow = (title, text, control, options = {}) => `${rowOpen(
  'flex-col items-stretch gap-(--spacing-sm)',
  options
)}
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
  </Item.Content>
  <Item.Actions class="w-full justify-start">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(`${control}${rowMessage(options)}`, 3)}
    </div>
  </Item.Actions>
</Item>`

export const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows.join('\n'), 3)}
    </Item.List>
  </template>
</CardBox>`

const SECTION_CLASS =
  'grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]'

const ASIDE_CLASS =
  'flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start'

const ANCHOR_BUTTON_CLASS =
  'absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none'

const DISCLOSURE_CLASS =
  'group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

const CHEVRON_CLASS =
  'pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none'

const REGION_CLASS =
  'grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none'

const BODY_CLASS =
  'flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none'

const sectionIcon = (icon) =>
  icon
    ? `\n  <i class="${icon} shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />`
    : ''

const sectionTitle = ({ title, icon, collapsible, open, regionId }) => {
  if (collapsible) {
    return `<button
  type="button"
  :aria-expanded="${open}"
  aria-controls="${regionId}"
  :data-state="${open} ? 'open' : 'closed'"
  class="${DISCLOSURE_CLASS}"
  @click="${open} = !${open}"
>${sectionIcon(icon)}
  ${title}
  <i class="${CHEVRON_CLASS}" aria-hidden="true" />
</button>`
  }
  return `<span class="flex items-center gap-(--spacing-xs)">${
    icon
      ? `\n  <i class="${icon} shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />\n  ${title}\n`
      : title
  }</span>`
}

const sectionHeading = ({ title, hint, icon, anchor, collapsible, open, regionId }) => {
  if (!title && !hint) return ''
  if (!title) return `<div data-stacked class="${ASIDE_CLASS}" />`
  const anchorButton = anchor
    ? `<button
  type="button"
  aria-label="Copy link to the ${title} section"
  class="${ANCHOR_BUTTON_CLASS}"
>
  <i class="pi pi-link text-body-xs" aria-hidden="true" />
</button>
`
    : ''
  return `<div data-stacked class="${ASIDE_CLASS}">
  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
${indent(
  `${anchorButton}<h2${anchor ? ` id="${slug(title)}"` : ''} class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
${indent(sectionTitle({ title, icon, collapsible, open, regionId }))}
</h2>${hint ? `\n<Hint text="${hint}" class="shrink-0" />` : ''}`,
  2
)}
  </div>
</div>
`
}

export const section = ({
  title = '',
  hint = '',
  icon = '',
  anchor = false,
  collapsible = false,
  open = 'open',
  regionId = '',
  body
}) => {
  const region = collapsible
    ? `<div
  id="${regionId}"
  :data-open="${open} || null"
  :inert="!${open} || undefined"
  :aria-hidden="!${open} || undefined"
  class="${REGION_CLASS}"
>
  <div data-collapsible class="min-w-0 data-collapsible:overflow-hidden">
    <div :data-open="${open} || null" class="${BODY_CLASS}">
${indent(body, 3)}
    </div>
  </div>
</div>`
    : `<div data-open class="${REGION_CLASS}">
  <div class="min-w-0 data-collapsible:overflow-hidden">
    <div data-open class="${BODY_CLASS}">
${indent(body, 3)}
    </div>
  </div>
</div>`
  return `<section data-stacked class="${SECTION_CLASS}">
${indent(`${sectionHeading({ title, hint, icon, anchor, collapsible, open, regionId })}${region}`)}
</section>`
}

export const band = (title, hint, rows) => section({ title, hint, anchor: true, body: card(rows) })

export const collapsibleBand = ({ id, title, hint, open, content, icon = '' }) =>
  section({ title, hint, icon, anchor: true, collapsible: true, open, regionId: id, body: content })

export const headingAction = ({ label, icon = 'pi pi-plus', kind = 'outlined', href = '', click = '' }) =>
  `<Button label="${label}" icon="${icon}" kind="${kind}"${
    href ? ` href="${href}" target="_blank"` : ''
  } size="medium" class="w-full md:w-auto"${click ? ` @click="${click}"` : ''} />`

export const pageHeading = ({
  title,
  description: text = '',
  size = 'small',
  documentation = '',
  actions = ''
}) => {
  const trailing = [
    documentation
      ? headingAction({ label: 'Documentation', icon: 'pi pi-book', href: documentation })
      : '',
    actions
  ]
    .filter(Boolean)
    .join('\n')
  const actionsBlock = trailing
    ? `\n  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">\n${indent(trailing, 2)}\n  </div>`
    : ''
  return `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 data-size="${size}" class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg">${title}</h1>
    </div>${text ? `\n    <p class="text-pretty text-body-sm text-(--text-muted)">${text}</p>` : ''}
  </div>${actionsBlock}
</header>`
}

export const settingsColumn = ({ title, description: text, legend, bands }) =>
  `<div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(pageHeading({ title, description: text }))}
  <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
    <legend class="sr-only">${legend}</legend>
${indent(bands.join('\n\n'), 2)}
  </fieldset>
</div>`

const SAVE_BAR_ROW =
  'layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0'

export const saveBar = ({
  label = 'You have unsaved changes.',
  hint = '',
  saving = false,
  bound = false
}) => {
  const discardState = bound ? ' :disabled="saving" @click="discard"' : saving ? ' disabled' : ''
  const saveState = bound ? ' :loading="saving" @click="save"' : saving ? ' loading' : ''
  const strip = `<footer${bound ? ' v-if="dirty || saving"' : ''} class="sticky bottom-0 z-10 h-0 shrink-0">
  <div class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14">
    <div class="${SAVE_BAR_ROW}">
      <div class="flex min-w-0 items-start gap-(--spacing-xs)">
        <i class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
        <p class="min-w-0 text-body-sm text-(--text-default)">
          ${label}${hint ? `\n          <span class="text-(--text-muted)">${hint}</span>` : ''}
        </p>
      </div>
      <div class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)">
        <Button type="button" label="Discard" kind="outlined" size="medium"${discardState} />
        <Button label="Save" kind="primary" size="medium"${saveState} />
      </div>
    </div>
  </div>
</footer>`
  if (!bound) return strip
  return `<Transition
  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
  leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  leave-to-class="translate-y-2 opacity-0"
>
${indent(strip)}
</Transition>`
}

const helperBinding = (message, text) => {
  const bound = /^\{\{\s*([\s\S]+?)\s*\}\}$/.exec(text)
  const fallback = bound ? bound[1] : text ? quote(text) : ''
  if (message) return ` :helper-text="${fallback ? `${message} || ${fallback}` : message}"`
  if (bound) return ` :helper-text="${bound[1]}"`
  return text ? ` helper-text="${text}"` : ''
}

const fieldComponent = ({ component, id, label, attrs, slots, text, message, messageKind, required, when }) => {
  const state =
    message && messageKind !== 'helper'
      ? ` :${messageKind === 'invalid' ? 'invalid' : 'required'}="!!${message}"`
      : required
        ? ` :required="${required}"`
        : ''
  const given = attrs.split('\n').filter(Boolean)
  const lines = [
    ...(when ? [`v-if="${when}"`] : []),
    ...given.filter((line) => line.startsWith('v-model')),
    `label="${label}"`,
    ...(id ? [`input-id="${id}"`] : []),
    ...given.filter((line) => !line.startsWith('v-model') && !line.startsWith('@')),
    ...[state, helperBinding(message, text)].filter(Boolean).map((line) => line.trim()),
    ...given.filter((line) => line.startsWith('@'))
  ]
  const open = `<${component}\n${indent(lines.join('\n'))}`
  return slots ? `${open}\n>\n${indent(slots)}\n</${component}>` : `${open}\n/>`
}

export const fieldStack = ({
  label,
  id,
  control = '',
  component = '',
  attrs = '',
  slots = '',
  description: text = '',
  descriptionSlot = '',
  message = '',
  messageKind = 'required',
  labelSlot = '',
  action = '',
  required = '',
  hint = '',
  when = ''
}) => {
  if (component) {
    return fieldComponent({ component, id, label, attrs, slots, text, message, messageKind, required, when })
  }
  const labelAttrs = `${id ? ` for="${id}"` : ''}${required ? ` :required="${required}"` : ''}${
    hint ? ` hint="${hint}"` : ''
  }`
  const head = `<div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
  <Label${labelAttrs}>${labelSlot || label}</Label>${action ? `\n${indent(action)}` : ''}
</div>`
  const helperBody = descriptionSlot || text
  let helper = ''
  if (message) {
    helper = helperBody
      ? `\n<HelperText id="${id}-helper" :kind="${message} ? '${messageKind}' : 'helper'">
  <template v-if="${message}">{{ ${message} }}</template>
  <template v-else>${helperBody}</template>
</HelperText>`
      : `\n<HelperText v-if="${message}" id="${id}-helper" kind="${messageKind}">{{ ${message} }}</HelperText>`
  } else if (helperBody) {
    helper = `\n<HelperText id="${id}-helper" kind="helper">${
      descriptionSlot ? `\n${indent(descriptionSlot)}\n` : text
    }</HelperText>`
  }
  const invalid =
    message && messageKind !== 'helper' ? ` :data-field-invalid="(${message}) ? true : null"` : ''
  return `<div${when ? ` v-if="${when}"` : ''}${invalid} class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(`${head}\n${control}${helper}`)}
</div>`
}

export const drawerShell = ({
  title,
  description: text = '',
  size = 'medium',
  open = 'open',
  submit = 'submit',
  submitting = 'submitting',
  saveLabel = 'Save',
  saveDisabled = '',
  dismissible = true,
  stacked = false,
  trigger = '',
  start = '',
  body
}) => `<Drawer v-model:open="${open}" size="${size}"${dismissible ? '' : ' :dismissible="false"'} side="right">${
  trigger ? `\n  <DrawerTrigger>\n${indent(trigger, 2)}\n  </DrawerTrigger>` : ''
}
  <DrawerPortal>
    <DrawerOverlay${stacked ? ' class="z-1002"' : ''} />
    <DrawerContent${stacked ? ' class="z-1003"' : ''}>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="${title}"
        novalidate
        @submit.prevent="${submit}"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>${title}</DrawerTitle>${
              text ? `\n            <p class="text-body-sm text-(--text-muted)">\n              ${text}\n            </p>` : ''
            }
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0" :disabled="${submitting}">
            <legend class="sr-only">${title}</legend>
${indent(body, 6)}
          </fieldset>
        </PanelContent>

        <PanelFooter class="flex-wrap justify-between">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">${start ? `\n${indent(start, 6)}\n          ` : ''}</div>
          <Button
            label="${saveLabel}"
            kind="primary"
            size="medium"
            :loading="${submitting}"${saveDisabled ? `\n            :disabled="${saveDisabled}"` : ''}
            type="submit"
          />
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

export const DRAWER_SHELL_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'"
]
