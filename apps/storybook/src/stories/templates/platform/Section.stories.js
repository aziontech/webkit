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

const LABEL_FOR_LINE =
  "const labelFor = (options) => (value) => options.find((option) => option.value === value)?.label ?? ''"

const labelFor = (options) => (value) =>
  options.find((option) => option.value === value)?.label ?? ''

const FONTS = [
  { label: 'Sora (Default)', value: 'sora' },
  { label: 'Inter', value: 'inter' },
  { label: 'Rubik', value: 'rubik' },
  { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
  { label: 'Geist', value: 'geist' },
  { label: 'Roboto', value: 'roboto' }
]

const APPEARANCES = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const VARY_BEHAVIORS = [
  { label: 'Ignore all — best cache rate', value: 'ignore' },
  { label: 'Vary by all', value: 'all' },
  { label: 'Vary by some (allowlist)', value: 'allowlist' },
  { label: 'Vary by all except some (denylist)', value: 'denylist' }
]

const optionsLine = (name, options) =>
  `const ${name} = [\n${options
    .map((option) => `  { label: '${option.label}', value: '${option.value}' }`)
    .join(',\n')}\n]`

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

const row = ({ title, description = '', control, fill = false }) => `<Item size="small">
  <Item.Content>
    <Item.Title>${title}</Item.Title>${
      description ? `\n    <Item.Description>${description}</Item.Description>` : ''
    }
  </Item.Content>
  <Item.Actions${fill ? ' class="layout-field-control"' : ''}>
${indent(control, 2)}
  </Item.Actions>
</Item>`

const selectControl = ({
  model,
  options,
  ariaLabel
}) => `<Select v-model="${model}" size="large" :display-value="labelFor(${options})">
  <Select.Trigger aria-label="${ariaLabel}" />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${each(rows, (markup) => markup, 3)}
    </Item.List>
  </template>
</CardBox>`

const title = (text, hint) => `<div class="flex min-w-0 items-center gap-(--spacing-xxs)">
  <h2 class="text-balance text-heading-xxs text-(--text-default)">${text}</h2>
  <Hint text="${hint}" />
</div>`

const column = (sections) => `<div class="layout-column-form flex min-w-0 flex-col">
${each(sections, (markup) => markup, 1)}
</div>`

const splitSection = (
  heading,
  content
) => `<section class="grid grid-cols-1 gap-x-(--spacing-xl) gap-y-(--spacing-md) md:grid-cols-[var(--container-xs)_minmax(0,1fr)]">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs) md:sticky md:top-(--spacing-lg) md:self-start">
${indent(heading, 2)}
  </div>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
${indent(content, 2)}
  </div>
</section>`

const DIVIDED_CLASS =
  ' mt-(--layout-section-gap) border-t-(length:--border-width-default) border-(--border-muted) pt-(--layout-section-gap)'

const stackedSection = (
  heading,
  content,
  divided = false
) => `<section class="grid grid-cols-1 gap-y-(--spacing-md)${divided ? DIVIDED_CLASS : ''}">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
${indent(heading, 2)}
  </div>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
${indent(content, 2)}
  </div>
</section>`

const collapsibleSection = ({
  id,
  text,
  hint,
  content
}) => `<section class="grid grid-cols-1 gap-y-(--spacing-md)">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="text-balance text-heading-xxs text-(--text-default)">
        <button
          type="button"
          :aria-expanded="open"
          aria-controls="${id}"
          :data-state="open ? 'open' : 'closed'"
          class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          @click="open = !open"
        >
          <i class="pi pi-cog shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
          ${text}
          <i
            class="pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-[rotate] duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      </h2>
      <Hint text="${hint}" />
    </div>
  </div>
  <div
    id="${id}"
    :data-open="open || null"
    :inert="!open || undefined"
    :aria-hidden="!open || undefined"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 overflow-hidden">
      <div
        :data-open="open || null"
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(content, 4)}
      </div>
    </div>
  </div>
</section>`

const GENERAL_ROWS = [
  row({
    title: 'Name',
    description: 'A unique and descriptive name to identify the application.',
    control: '<InputText v-model="name" size="large" aria-label="Name" />',
    fill: true
  }),
  row({
    title: 'Active',
    description: 'When disabled, the application stops serving traffic.',
    control: '<Switch v-model="active" aria-label="Active" />'
  })
]

const APPEARANCE_ROWS = [
  row({
    title: 'Font family',
    description:
      'The primary sans typeface across the console. Non-default faces load from Google Fonts.',
    control: selectControl({ model: 'font', options: 'fonts', ariaLabel: 'Font family' }),
    fill: true
  }),
  row({
    title: 'System appearance',
    description: 'Follow the operating system, or force a light or dark theme.',
    control: selectControl({
      model: 'appearance',
      options: 'appearances',
      ariaLabel: 'System appearance'
    }),
    fill: true
  })
]

const LOGIN_ROWS = [
  row({
    title: 'Allow social login',
    description: 'Users linked to the account can log in with their social network credentials.',
    control: '<Switch v-model="allowSocialLogin" aria-label="Allow social login" />'
  }),
  row({
    title: 'Enforce multi-factor authentication',
    description: 'MFA is required on login for every user linked to this account.',
    control: '<Switch v-model="enforceMfa" aria-label="Enforce multi-factor authentication" />'
  })
]

const CACHE_KEY_ROWS = [
  row({
    title: 'Cache by query string',
    control: selectControl({
      model: 'queryString',
      options: 'varyBehaviors',
      ariaLabel: 'Cache by query string'
    }),
    fill: true
  }),
  row({
    title: 'Cache by cookies',
    control: selectControl({
      model: 'cookies',
      options: 'varyBehaviors',
      ariaLabel: 'Cache by cookies'
    }),
    fill: true
  })
]

const GENERAL_HINT =
  'How this application is identified across the console, and whether it is serving traffic.'
const APPEARANCE_HINT = 'Preferences for this browser that apply the moment you change them.'
const LOGIN_HINT = 'How the users linked to this account sign in.'
const CACHE_KEY_HINT = 'Which parts of a request make two requests two different cached objects.'

const DEFAULT_TEMPLATE = column([splitSection(title('General', GENERAL_HINT), card(GENERAL_ROWS))])

const STACKED_TEMPLATE = column([
  stackedSection(title('Appearance', APPEARANCE_HINT), card(APPEARANCE_ROWS)),
  stackedSection(title('Login Settings', LOGIN_HINT), card(LOGIN_ROWS), true)
])

const COLLAPSIBLE_TEMPLATE = column([
  collapsibleSection({
    id: 'advanced-cache-key',
    text: 'Advanced cache key',
    hint: CACHE_KEY_HINT,
    content: card(CACHE_KEY_ROWS)
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
          'The settings band: an h2 with a `Hint` glyph that carries the one-sentence guidance, over or beside a flush card of settings rows, each a title and description with its control on the right. Every settings tab in the console is a column of these, from an application’s Settings and Cache Settings tabs to Account Settings. Built from `Hint`, `CardBox` and `Item` rows holding `InputText`, `Switch` and `Select`; the split layout puts the heading in a sticky aside from `md` up and stacks below it.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ name: ref('my-app-vue'), active: ref(true) }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The split band: the heading sits in a sticky aside on the left from `md` up, the card of rows fills the rest.'
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
            "const name = ref('my-app-vue')",
            'const active = ref(true)'
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
      font: ref('sora'),
      appearance: ref('system'),
      allowSocialLogin: ref(true),
      enforceMfa: ref(false),
      fonts: FONTS,
      appearances: APPEARANCES,
      labelFor
    }),
    template: STACKED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Two stacked bands, heading over card, the second divided from the first by a rule at the section step.'
      },
      source: {
        code: toSfc(
          [
            IMPORTS.cardBox,
            IMPORTS.hint,
            IMPORTS.item,
            IMPORTS.select,
            IMPORTS.switch,
            IMPORTS.ref,
            '',
            "const font = ref('sora')",
            "const appearance = ref('system')",
            'const allowSocialLogin = ref(true)',
            'const enforceMfa = ref(false)',
            '',
            optionsLine('fonts', FONTS),
            optionsLine('appearances', APPEARANCES),
            '',
            LABEL_FOR_LINE
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
    setup: () => ({
      open: ref(false),
      queryString: ref('ignore'),
      cookies: ref('ignore'),
      varyBehaviors: VARY_BEHAVIORS,
      labelFor
    }),
    template: COLLAPSIBLE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The collapsible band, closed: the heading is the disclosure trigger, and the card unfolds along the grid track when it opens.'
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
            'const open = ref(false)',
            "const queryString = ref('ignore')",
            "const cookies = ref('ignore')",
            '',
            optionsLine('varyBehaviors', VARY_BEHAVIORS),
            '',
            LABEL_FOR_LINE
          ],
          COLLAPSIBLE_TEMPLATE
        )
      }
    }
  }
}
