import Button from '@aziontech/webkit/button'
import InputText from '@aziontech/webkit/input-text'
import Label from '@aziontech/webkit/label'
import Popover, {
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '@aziontech/webkit/popover'
import Select, {
  SelectContent,
  SelectOption,
  SelectTrigger
} from '@aziontech/webkit/select'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const components = {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverFooter,
  Button
}

const IMPORT = [
  "import Popover, {\n  PopoverTrigger,\n  PopoverContent,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverDescription,\n  PopoverClose,\n  PopoverFooter\n} from '@aziontech/webkit/popover'",
  "import Button from '@aziontech/webkit/button'"
]

/** @type {import('@storybook/vue3').Meta<typeof Popover>} */
const meta = {
  title: 'Components/Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Anchored, non-modal overlay: a consumer-supplied trigger opens a floating panel whose contents are composed by part (`PopoverHeader`, `PopoverTitle`, `PopoverDescription`, `PopoverClose`, a free-form body, and `PopoverFooter`). It leaves the page interactive, anchors to its trigger, and closes on `Esc` or outside-click. Follows the same trigger-opens-panel pattern as `Dropdown`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    placement: {
      control: 'select',
      options: ['auto', 'bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description:
        "Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on available viewport space.",
      table: {
        category: 'props',
        type: { summary: "'auto' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" },
        defaultValue: { summary: "'bottom-start'" }
      }
    },
    offset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Pixel gap between the trigger and the panel.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '4' }
      }
    },
    // `disabled` is a real prop, but hidden from the Controls panel / autodocs table.
    disabled: {
      table: { disable: true }
    },
    width: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description:
        "Panel width preset mapped to container tokens: `'small'` (`var(--container-xs)`), `'medium'` (`var(--container-sm)`), `'large'` (`var(--container-md)`). When omitted, the panel sizes fluidly between `var(--container-3xs)` and `var(--container-xs)`.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'undefined' }
      }
    },
    closable: {
      control: 'boolean',
      description:
        'Light-dismiss: when `true`, the panel closes on outside-click, `Esc`, and focus leaving the panel. Set `false` to keep it open until the trigger or `PopoverClose` closes it.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    default: {
      control: false,
      description: 'Place `<PopoverTrigger>` followed by `<PopoverContent>`.',
      table: { category: 'slots', type: { summary: 'slot' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description:
        'Fires on every open/closed transition; supports `v-model:open`. Emitted on trigger toggle, `PopoverClose`, `Esc`, and outside-click.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    placement: 'bottom-start',
    offset: 4,
    closable: true
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `
    <Popover v-bind="args">
      <PopoverTrigger>
        <Button kind="secondary" label="Open popover" />
      </PopoverTrigger>

      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>

        <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">
          This content is rendered inside the popover panel.
        </div>
      </PopoverContent>
    </Popover>
  `
})

const DEFAULT_MARKUP = `<Popover>
  <PopoverTrigger>
    <Button kind="secondary" label="Open popover" />
  </PopoverTrigger>

  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Popover title</PopoverTitle>
      <PopoverClose />
    </PopoverHeader>

    <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">
      This content is rendered inside the popover panel.
    </div>
  </PopoverContent>
</Popover>`

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A `Button` trigger that opens the popover. The panel content is composed by part — here a header (title + close) and a free-form body.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const PLACEMENTS_TEMPLATE = `<div class="grid grid-cols-2 gap-[var(--spacing-xxl)] place-items-center min-h-[24rem] p-[var(--spacing-xxl)]">
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <Button kind="secondary" label="bottom-start" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>bottom-start</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
    </PopoverContent>
  </Popover>

  <Popover placement="bottom-end">
    <PopoverTrigger>
      <Button kind="secondary" label="bottom-end" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>bottom-end</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
    </PopoverContent>
  </Popover>

  <Popover placement="top-start">
    <PopoverTrigger>
      <Button kind="secondary" label="top-start" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>top-start</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
    </PopoverContent>
  </Popover>

  <Popover placement="top-end">
    <PopoverTrigger>
      <Button kind="secondary" label="top-end" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>top-end</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
    </PopoverContent>
  </Popover>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const Placements = {
  render: () => ({ components, template: PLACEMENTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'All four explicit `placement` values side-by-side. Click a trigger to open its panel and see how it anchors against the trigger.'
      },
      source: { code: toSfc(IMPORT, PLACEMENTS_TEMPLATE) }
    }
  }
}

const AUTO_PLACEMENT_TEMPLATE = `<div class="relative h-[30rem] w-full border border-dashed border-[var(--border-muted)]">
  <p class="absolute top-[var(--spacing-md)] left-1/2 -translate-x-1/2 text-body-sm text-[var(--text-muted)] text-center max-w-md">
    All triggers use placement="auto". Each panel resolves to the best-fitting corner based on its position in the viewport.
  </p>

  <div class="absolute top-[var(--spacing-md)] left-[var(--spacing-md)]">
    <Popover :open="true" placement="auto">
      <PopoverTrigger>
        <Button kind="secondary" label="top-left" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
      </PopoverContent>
    </Popover>
  </div>

  <div class="absolute top-[var(--spacing-md)] right-[var(--spacing-md)]">
    <Popover :open="true" placement="auto">
      <PopoverTrigger>
        <Button kind="secondary" label="top-right" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
      </PopoverContent>
    </Popover>
  </div>

  <div class="absolute bottom-[var(--spacing-md)] left-[var(--spacing-md)]">
    <Popover :open="true" placement="auto">
      <PopoverTrigger>
        <Button kind="secondary" label="bottom-left" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
      </PopoverContent>
    </Popover>
  </div>

  <div class="absolute bottom-[var(--spacing-md)] right-[var(--spacing-md)]">
    <Popover :open="true" placement="auto">
      <PopoverTrigger>
        <Button kind="secondary" label="bottom-right" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Popover content.</div>
      </PopoverContent>
    </Popover>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const AutoPlacement = {
  render: () => ({ components, template: AUTO_PLACEMENT_TEMPLATE }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`placement="auto"` lets the popover choose the best-fitting corner at open time. The four triggers below all use the same value — each, anchored near a different viewport corner and forced open, resolves toward the corner with the most available space.'
      },
      source: { code: toSfc(IMPORT, AUTO_PLACEMENT_TEMPLATE) }
    }
  }
}

const ANATOMY_TEMPLATE = `<div class="flex flex-wrap items-start gap-[var(--spacing-xxl)] p-[var(--spacing-xxl)] min-h-[22rem]">
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <Button kind="secondary" label="Full" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Popover title</PopoverTitle>
        <PopoverDescription>A short description of the popover.</PopoverDescription>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Body content composed by the consumer.</div>
      <PopoverFooter>
        <Button kind="secondary" size="medium" label="Confirm" />
      </PopoverFooter>
    </PopoverContent>
  </Popover>

  <Popover placement="bottom-start">
    <PopoverTrigger>
      <Button kind="secondary" label="Title only" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Popover title</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Body content.</div>
    </PopoverContent>
  </Popover>

  <Popover placement="bottom-start">
    <PopoverTrigger>
      <Button kind="secondary" label="Body only" />
    </PopoverTrigger>
    <PopoverContent>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Just body content — no header or footer.</div>
    </PopoverContent>
  </Popover>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const Anatomy = {
  render: () => ({ components, template: ANATOMY_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Region combinations side-by-side — click a trigger to open each: (a) `PopoverHeader` (title + description) + body + `PopoverFooter`, (b) header with title only + body, and (c) body-only with no header or footer. `PopoverHeader`, `PopoverDescription`, and `PopoverFooter` are all optional — compose the panel by part.'
      },
      source: { code: toSfc(IMPORT, ANATOMY_TEMPLATE) }
    }
  }
}

const WIDTHS_TEMPLATE = `<div class="flex items-center gap-[var(--spacing-xxl)] p-[var(--spacing-xxl)]">
  <Popover placement="bottom-start" width="small">
    <PopoverTrigger>
      <Button kind="secondary" label="small" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>small</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Panel width is var(--container-xs) (320px).</div>
    </PopoverContent>
  </Popover>

  <Popover placement="bottom-start" width="medium">
    <PopoverTrigger>
      <Button kind="secondary" label="medium" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>medium</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Panel width is var(--container-sm) (384px).</div>
    </PopoverContent>
  </Popover>

  <Popover placement="bottom-start" width="large">
    <PopoverTrigger>
      <Button kind="secondary" label="large" />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>large</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>
      <div class="p-[var(--spacing-md)] text-body-sm text-[var(--text-default)]">Panel width is var(--container-md) (448px).</div>
    </PopoverContent>
  </Popover>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const Widths = {
  render: () => ({ components, template: WIDTHS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          "The `width` prop presets — click a trigger to open each: `small` (`var(--container-xs)`, 320px), `medium` (`var(--container-sm)`, 384px), and `large` (`var(--container-md)`, 448px). When `width` is omitted the panel sizes fluidly between `var(--container-3xs)` and `var(--container-xs)`."
      },
      source: { code: toSfc(IMPORT, WIDTHS_TEMPLATE) }
    }
  }
}

const FILTER_FIELDS = [
  { value: 'name', label: 'Name' },
  { value: 'id', label: 'ID' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'status', label: 'Status' },
  { value: 'last-editor', label: 'Last Editor' }
]

const FILTER_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not-equals', label: 'Not Equals' }
]

const filterComponents = {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverFooter,
  Select,
  SelectTrigger,
  SelectContent,
  SelectOption,
  InputText,
  Label,
  Button
}

const FILTER_TEMPLATE = `<Popover v-model:open="open" :closable="false" width="large">
  <PopoverTrigger>
    <Button size="small" kind="secondary" icon="pi pi-filter" label="Filter" />
  </PopoverTrigger>

  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Filter</PopoverTitle>
      <PopoverDescription>Each combination of operator can only be used once.</PopoverDescription>
      <PopoverClose />
    </PopoverHeader>

    <div class="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
      <Label>New Filter</Label>
      <div class="flex items-start gap-[var(--spacing-sm)]">
        <div class="min-w-0 flex-1">
          <Select v-model="field" size="small" placeholder="Field">
            <SelectTrigger />
            <SelectContent>
              <SelectOption v-for="option in fields" :key="option.value" :value="option.value">{{ option.label }}</SelectOption>
            </SelectContent>
          </Select>
        </div>
        <div class="min-w-0 flex-1">
          <Select size="small" v-model="operator" placeholder="Operator">
            <SelectTrigger />
            <SelectContent>
              <SelectOption v-for="option in operators" :key="option.value" :value="option.value">{{ option.label }}</SelectOption>
            </SelectContent>
          </Select>
        </div>
        <div class="min-w-0 flex-1">
          <InputText size="small" v-model="value" placeholder="Value" />
        </div>
      </div>
    </div>

    <PopoverFooter>
      <Button size="small" kind="outlined" label="Cancel" @click="cancel" />
      <Button size="small" kind="primary" label="Apply" @click="apply" />
    </PopoverFooter>
  </PopoverContent>
</Popover>`

const FILTER_SCRIPT = [
  "import { ref } from 'vue'",
  "import Popover, {\n  PopoverTrigger,\n  PopoverContent,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverDescription,\n  PopoverClose,\n  PopoverFooter\n} from '@aziontech/webkit/popover'",
  "import Select, { SelectTrigger, SelectContent, SelectOption } from '@aziontech/webkit/select'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Label from '@aziontech/webkit/label'",
  "import Button from '@aziontech/webkit/button'",
  '',
  'const open = ref(false)',
  "const field = ref('last-editor')",
  "const operator = ref('equals')",
  "const value = ref('')",
  '',
  'const fields = [',
  "  { value: 'name', label: 'Name' },",
  "  { value: 'id', label: 'ID' },",
  "  { value: 'infrastructure', label: 'Infrastructure' },",
  "  { value: 'status', label: 'Status' },",
  "  { value: 'last-editor', label: 'Last Editor' }",
  ']',
  'const operators = [',
  "  { value: 'equals', label: 'Equals' },",
  "  { value: 'not-equals', label: 'Not Equals' }",
  ']',
  '',
  'function apply() {',
  '  // apply the composed filter { field, operator, value } here, then close',
  '  open.value = false',
  '}',
  'function cancel() {',
  '  open.value = false',
  '}'
]

/** @type {import('@storybook/vue3').StoryObj<typeof Popover>} */
export const FilterExample = {
  render: () => ({
    components: filterComponents,
    setup() {
      const open = ref(false)
      const field = ref('last-editor')
      const operator = ref('equals')
      const value = ref('')
      const apply = () => {
        open.value = false
      }
      const cancel = () => {
        open.value = false
      }
      return {
        open,
        field,
        operator,
        value,
        fields: FILTER_FIELDS,
        operators: FILTER_OPERATORS,
        apply,
        cancel
      }
    },
    template: FILTER_TEMPLATE
  }),
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A filter builder composed from `Popover` + `Select` + `InputText` + `Button` — a real usage, not a new variant. The header carries the title/description/close; the body is a `New Filter` row (field select, operator select, value input); the footer holds Cancel / Apply. It sets `:closable="false"` on purpose: the panel nests `Select` overlays (which teleport their own menus to `<body>`), so light-dismiss would treat picking an option as an outside-click; instead it is closed via the header close, Cancel, or Apply, driven by `v-model:open`.'
      },
      source: { code: toSfc(FILTER_SCRIPT, FILTER_TEMPLATE) }
    }
  }
}
