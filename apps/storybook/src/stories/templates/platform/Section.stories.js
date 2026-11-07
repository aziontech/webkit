import CardBox from '@aziontech/webkit/card-box'
import Hint from '@aziontech/webkit/hint'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import { ref } from 'vue'

import { each, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = {
  cardBox: "import CardBox from '@aziontech/webkit/card-box'",
  hint: "import Hint from '@aziontech/webkit/hint'",
  inputText: "import InputText from '@aziontech/webkit/input-text'",
  item: "import Item from '@aziontech/webkit/item'",
  select: "import Select from '@aziontech/webkit/select'",
  switch: "import Switch from '@aziontech/webkit/switch'",
  ref: "import { ref } from 'vue'"
}

const COPY_ANCHOR_LINES = [
  'const copyAnchor = (id) =>',
  "  globalThis.navigator?.clipboard?.writeText(`${globalThis.location.href.split('#')[0]}#${id}`)"
]

const copyAnchor = (id) =>
  globalThis.navigator?.clipboard?.writeText(`${globalThis.location.href.split('#')[0]}#${id}`)

const FONTS = [
  { label: 'Rubik (Default)', value: 'rubik' },
  { label: 'Sora', value: 'sora' },
  { label: 'Inter', value: 'inter' },
  { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
  { label: 'Geist', value: 'geist' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Work Sans', value: 'work-sans' },
  { label: 'Instrument Sans', value: 'instrument-sans' },
  { label: 'Hedvig Letters Sans', value: 'hedvig-letters-sans' }
]

const APPEARANCES = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const MODULES = [
  {
    key: 'application_accelerator',
    title: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.'
  },
  { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
  {
    key: 'device_detection',
    title: 'Device Detection',
    description: 'Activate DeviceAtlas variables to configure responsive rules.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build ultra-low latency functions that run on Azion.'
  },
  {
    key: 'image_processor',
    title: 'Image Processor',
    description: 'Enable dynamic image editing options.'
  },
  {
    key: 'load_balancer',
    title: 'Load Balancer',
    description:
      'Balance traffic to your origins ensuring reliability and network congestion control.'
  }
]

const MODULE_STATE = {
  application_accelerator: true,
  cache: true,
  device_detection: false,
  functions: true,
  image_processor: false,
  load_balancer: false
}

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const optionsLine = (name, options) =>
  `const ${name} = [\n${options
    .map((option) => `  { label: ${quoted(option.label)}, value: '${option.value}' }`)
    .join(',\n')}\n]`

const modulesLine = () =>
  `const defaultModules = [\n${MODULES.map(
    (module) =>
      `  {\n    key: '${module.key}',\n    title: ${quoted(module.title)},\n    description: ${quoted(module.description)}\n  }`
  ).join(',\n')}\n]`

const moduleStateLine = () =>
  `const modules = ref({\n${Object.entries(MODULE_STATE)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join(',\n')}\n})`

const components = {
  CardBox,
  Hint,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Switch
}

const SECTION_CLASS =
  'grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]'

const ASIDE_CLASS =
  'flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start'

const ANCHOR_CLASS =
  'absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none'

const DISCLOSURE_CLASS =
  'group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

const TRACK_CLASS =
  'grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none'

const BODY_CLASS =
  'flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none'

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const iconGlyph = (icon) =>
  icon
    ? `\n  <i class="${icon} shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />`
    : ''

const heading = ({ title, hint, anchor, icon, collapsible, regionId }) => {
  const id = slug(title)
  const label = collapsible
    ? `<button
  type="button"
  :aria-expanded="open"
  aria-controls="${regionId}"
  :data-state="open ? 'open' : 'closed'"
  class="${DISCLOSURE_CLASS}"
  @click="open = !open"
>${iconGlyph(icon)}
  ${title}
  <i
    class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
    aria-hidden="true"
  />
</button>`
    : `<span class="flex items-center gap-(--spacing-xs)">${iconGlyph(icon)}
  ${title}
</span>`
  return `<div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">${
    anchor
      ? `
  <button
    type="button"
    aria-label="Copy link to the ${title} section"
    class="${ANCHOR_CLASS}"
    @click="copyAnchor('${id}')"
  >
    <i class="pi pi-link text-body-xs" aria-hidden="true" />
  </button>`
      : ''
  }
  <h2${anchor ? ` id="${id}"` : ''} class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
${indent(label, 2)}
  </h2>${hint ? `\n  <Hint text="${hint}" class="shrink-0" />` : ''}
</div>`
}

const section = ({ title, hint = '', anchor = false, icon = '', collapsible = false, content }) => {
  const regionId = `${slug(title)}-region`
  const track = collapsible
    ? `<div
  id="${regionId}"
  :data-open="open || null"
  :inert="!open || undefined"
  :aria-hidden="!open || undefined"
  class="${TRACK_CLASS}"
>
  <div data-collapsible class="min-w-0 data-collapsible:overflow-hidden">
    <div :data-open="open || null" class="${BODY_CLASS}">
${indent(content, 3)}
    </div>
  </div>
</div>`
    : `<div data-open class="${TRACK_CLASS}">
  <div class="min-w-0 data-collapsible:overflow-hidden">
    <div data-open class="${BODY_CLASS}">
${indent(content, 3)}
    </div>
  </div>
</div>`
  return `<section data-stacked class="${SECTION_CLASS}">
  <div data-stacked class="${ASIDE_CLASS}">
${indent(heading({ title, hint, anchor, icon, collapsible, regionId }), 2)}
  </div>

${indent(track, 1)}
</section>`
}

const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${each(rows, (markup) => markup, 3)}
    </Item.List>
  </template>
</CardBox>`

const column = (sections) => `<div class="layout-column-form flex min-w-0 flex-col">
${each(sections, (markup) => markup, 1)}
</div>`

const NAME_ROW = `<Item size="small">
  <Item.Content>
    <Item.Title>Name</Item.Title>
    <Item.Description>A unique and descriptive name to identify the application.</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
    <InputText v-model="name" size="large" class="w-full" aria-label="Name" />
  </Item.Actions>
</Item>`

const ACTIVE_ROW = `<Item size="small">
  <Item.Content>
    <Item.Title>Active</Item.Title>
    <Item.Description>When disabled, the application stops serving traffic.</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="active" aria-label="Active" />
  </Item.Actions>
</Item>`

const MODULE_ROW = `<Item v-for="mod in defaultModules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>{{ mod.description }}</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="modules[mod.key]" :aria-label="mod.title" />
  </Item.Actions>
</Item>`

const selectRow = ({ title, description, model, options, ariaLabel }) => `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>${title}</Item.Title>
    <Item.Description>${description}</Item.Description>
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Select
        v-model="${model}"
        size="large"
        :display-value="(value) => ${options}.find((option) => option.value === value)?.label ?? ''"
      >
        <Select.Trigger class="w-full" aria-label="${ariaLabel}" />
        <Select.Content>
          <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>
  </Item.Actions>
</Item>`

const TEAM_ACTIVE_ROW = `<Item size="small" class="items-start">
  <Item.Content>
    <Item.Title>Active</Item.Title>
    <Item.Description>Inactive teams keep their permissions but can't be assigned.</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="active" aria-label="Active" />
  </Item.Actions>
</Item>`

const DEFAULT_TEMPLATE = column([
  section({
    title: 'Appearance',
    hint: 'Preferences for this browser, applied the moment you change them and not part of Save.',
    anchor: true,
    content: card([
      selectRow({
        title: 'Font family',
        description: 'The primary sans typeface across the console.',
        model: 'font',
        options: 'fonts',
        ariaLabel: 'Font family'
      }),
      selectRow({
        title: 'System appearance',
        description: 'Follow the operating system, or force a light or dark theme.',
        model: 'theme',
        options: 'appearances',
        ariaLabel: 'System appearance'
      })
    ])
  })
])

const STACKED_TEMPLATE = column([
  section({
    title: 'General',
    hint: 'How this application is identified across the console, and whether it is serving traffic.',
    anchor: true,
    content: card([NAME_ROW, ACTIVE_ROW])
  }),
  section({
    title: 'Modules',
    hint: 'The capabilities this application runs with, each of which can be toggled here.',
    anchor: true,
    content: card([MODULE_ROW])
  })
])

const COLLAPSIBLE_TEMPLATE = column([
  section({
    title: 'Advanced',
    icon: 'pi pi-cog',
    collapsible: true,
    content: card([TEAM_ACTIVE_ROW])
  })
])

const meta = {
  title: 'Templates/Platform/Page/Section',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The settings band, as the console’s Section renders it: an h2 with a `Hint` glyph that carries the one-sentence guidance, over a flush card of settings rows, each a title and description with its control on the right. Every console page stacks it (`stacked`, no rule between bands), from an application’s Settings, Build and Cache Settings tabs and a workload’s Settings to Account Settings, the Edge DNS zone, the WAF and Firewall settings and every create page and drawer. An anchored band carries a copy-link button that appears in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the card along the grid track. Built from `Hint`, `CardBox` and `Item` rows holding `InputText`, `Switch` and `Select`; the split aside layout is still in the markup for a non-stacked band, but no console page renders one.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({
      font: ref('rubik'),
      theme: ref('system'),
      fonts: FONTS,
      appearances: APPEARANCES,
      copyAnchor
    }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Account Settings Appearance band: an anchored heading with its hint over two rows whose Select fills the control column.'
      },
      source: {
        code: toSfc(
          [
            IMPORTS.cardBox,
            IMPORTS.hint,
            IMPORTS.item,
            IMPORTS.select,
            IMPORTS.ref,
            '',
            optionsLine('fonts', FONTS),
            '',
            optionsLine('appearances', APPEARANCES),
            '',
            "const font = ref('rubik')",
            "const theme = ref('system')",
            '',
            ...COPY_ANCHOR_LINES
          ],
          DEFAULT_TEMPLATE
        )
      }
    }
  }
}

export const Stacked = {
  render: () => ({
    components,
    setup: () => ({
      name: ref('my-app-vue'),
      active: ref(true),
      modules: ref({ ...MODULE_STATE }),
      defaultModules: MODULES,
      copyAnchor
    }),
    template: STACKED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'An application’s Settings tab: the General and Modules bands stacked one under the other at the section gap, with no rule between them.'
      },
      source: {
        code: toSfc(
          [
            IMPORTS.cardBox,
            IMPORTS.hint,
            IMPORTS.inputText,
            IMPORTS.item,
            IMPORTS.switch,
            IMPORTS.ref,
            '',
            modulesLine(),
            '',
            "const name = ref('my-app-vue')",
            'const active = ref(true)',
            moduleStateLine(),
            '',
            ...COPY_ANCHOR_LINES
          ],
          STACKED_TEMPLATE
        )
      }
    }
  }
}

export const Collapsible = {
  render: () => ({
    components,
    setup: () => ({ open: ref(false), active: ref(true) }),
    template: COLLAPSIBLE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The collapsible Advanced band of Create Team, closed: the cog glyph and the title are the disclosure trigger, and the card unfolds along the grid track when it opens.'
      },
      source: {
        code: toSfc(
          [
            IMPORTS.cardBox,
            IMPORTS.item,
            IMPORTS.switch,
            IMPORTS.ref,
            '',
            'const open = ref(false)',
            'const active = ref(true)'
          ],
          COLLAPSIBLE_TEMPLATE
        )
      }
    }
  }
}
