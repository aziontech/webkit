import { indent } from '../../_shared/markup'

const quote = (text) => `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

export const literal = (value, depth = 0) => {
  if (typeof value === 'string') return quote(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const inner = '  '.repeat(depth + 1)
  const outer = '  '.repeat(depth)
  if (Array.isArray(value)) {
    return `[\n${value.map((item) => `${inner}${literal(item, depth + 1)}`).join(',\n')}\n${outer}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (!inline.includes('\n') && inline.length + inner.length <= 96) return inline
  return `{\n${entries.map((entry) => `${inner}${entry}`).join(',\n')}\n${outer}}`
}

export const declare = (name, value, wrap = '') =>
  `const ${name} = ${wrap ? `${wrap}(${literal(value)})` : literal(value)}`

const description = (text) => (text ? `\n    <Item.Description>${text}</Item.Description>` : '')

export const fieldRow = (title, text, control) => `<Item size="small">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
  </Item.Content>
  <Item.Actions class="layout-field-control">
${indent(control, 2)}
  </Item.Actions>
</Item>`

export const compactRow = (title, text, control) => `<Item size="small">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
  </Item.Content>
  <Item.Actions>
${indent(control, 2)}
  </Item.Actions>
</Item>`

export const wideRow = (title, text, control) => `<Item size="small">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${description(text)}
    <div class="mt-(--spacing-sm) flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}
    </div>
  </Item.Content>
</Item>`

export const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows.join('\n'), 3)}
    </Item.List>
  </template>
</CardBox>`

export const band = (
  title,
  hint,
  rows
) => `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-heading-xxs text-(--text-default)">${title}</h2>${hint ? `\n    <Hint text="${hint}" />` : ''}
  </div>
${indent(card(rows))}
</section>`

export const settingsColumn = ({ title, description: text, legend, bands }) =>
  `<div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col gap-(--layout-section-gap) py-(--layout-section-gap)">
  <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <h1 class="text-heading-xs text-(--text-default)">${title}</h1>
    <p class="text-pretty text-body-sm text-(--text-muted)">${text}</p>
  </header>
  <fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0">
    <legend class="sr-only">${legend}</legend>
${indent(bands.join('\n\n'), 2)}
  </fieldset>
</div>`

export const saveBar = ({ label, hint = '', saving = false }) =>
  `<footer class="sticky bottom-0 z-10 shrink-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14">
  <div class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0">
    <div class="flex min-w-0 items-start gap-(--spacing-xs)">
      <i class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
      <p class="min-w-0 text-body-sm text-(--text-default)">
        ${label}${hint ? `\n        <span class="text-(--text-muted)">${hint}</span>` : ''}
      </p>
    </div>
    <div class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)">
      <Button type="button" label="Discard" kind="outlined" size="medium"${saving ? ' disabled' : ''} />
      <Button label="Save" kind="primary" size="medium"${saving ? ' loading' : ''} />
    </div>
  </div>
</footer>`

export const collapsibleBand = ({
  id,
  title,
  hint,
  open,
  content
}) => `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-heading-xxs text-(--text-default)">
      <button
        type="button"
        :aria-expanded="${open}"
        aria-controls="${id}"
        :data-state="${open} ? 'open' : 'closed'"
        class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        @click="${open} = !${open}"
      >
        <i class="pi pi-cog shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
        ${title}
        <i
          class="pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-[rotate] duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </h2>
    <Hint text="${hint}" />
  </div>
  <div
    id="${id}"
    :data-open="${open} || null"
    :inert="!${open} || undefined"
    :aria-hidden="!${open} || undefined"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 overflow-hidden">
      <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
${indent(content, 4)}
      </div>
    </div>
  </div>
</section>`
