import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import EmptyState from '@aziontech/webkit/empty-state'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'
import FieldInputGroup from '@aziontech/webkit/field-input-group'
import FieldPassword from '@aziontech/webkit/field-password'
import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
import FieldRadio from '@aziontech/webkit/field-radio'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import FieldSwitch from '@aziontech/webkit/field-switch'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputNumber from '@aziontech/webkit/input-number'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Label from '@aziontech/webkit/label'
import Link from '@aziontech/webkit/link'
import Message from '@aziontech/webkit/message'
import MultiSelect from '@aziontech/webkit/multi-select'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Select from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import Switch from '@aziontech/webkit/switch'
import Tag from '@aziontech/webkit/tag'

import { indent } from '../../_shared/markup'
import {
  declare as declareConst,
  mergeScripts,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const PARTS = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  EmptyState,
  FieldCheckbox,
  FieldCheckboxBlock,
  FieldInputGroup,
  FieldPassword,
  FieldPhoneNumber,
  FieldRadio,
  FieldRadioBlock,
  FieldSwitch,
  FieldSwitchBlock,
  FieldText,
  FieldTextSwitch,
  FieldTextarea,
  GlobalHeader,
  HelperText,
  IconButton,
  InputNumber,
  InputText,
  Item,
  Label,
  Link,
  Message,
  MultiSelect,
  PanelContent,
  PanelFooter,
  PanelHeader,
  SegmentedButton,
  Select,
  Skeleton,
  Switch,
  Tag
}

const MEMBERS = {
  GlobalHeader: ['Left', 'Middle', 'Right', 'Brand'],
  Item: ['List', 'Content', 'Title', 'Description', 'Actions'],
  MultiSelect: ['Trigger', 'Content', 'Option'],
  Select: ['Trigger', 'Content', 'Option']
}

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const patternImports = (names) =>
  [...new Set(names)].sort().map((name) => `import ${name} from '@aziontech/webkit/${kebab(name)}'`)

export const patternComponents = (names) =>
  Object.fromEntries(
    [...new Set(names)].flatMap((name) => [
      [name, PARTS[name]],
      ...(MEMBERS[name] ?? []).map((member) => [`${name}.${member}`, PARTS[name][member]])
    ])
  )

export const vueImport = (names) => `import { ${[...names].sort().join(', ')} } from 'vue'`

export const consolePage = ({ main, padded = true }) =>
  shell({
    withBreadcrumb: true,
    main: `<div class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto${padded ? ' layout-boundary' : ''}">
${indent(main)}
</div>`
  })

export const consoleScript = ({ active = 'forms', breadcrumb, names, vue, body }) =>
  mergeScripts(
    scriptLines({
      parts: ['Breadcrumb'],
      active,
      declarations: ['', declareConst('breadcrumb', breadcrumb)],
      state: []
    }),
    [...patternImports(names), ...(vue.length ? [vueImport(vue)] : []), '', ...body]
  )

export const consoleSetup = ({ active = 'forms', breadcrumb, state }) => ({
  ...shellState(active),
  breadcrumb,
  ...state
})

export const consoleComponents = (names) => ({
  ...SHELL_COMPONENTS,
  Breadcrumb,
  ...patternComponents(names)
})

export const CREATION_NAMES = ['Avatar', 'Brand', 'Breadcrumb', 'GlobalHeader', 'IconButton']

export const creationPage = ({
  backLabel,
  main
}) => `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console">
    <GlobalHeader.Left>
      <IconButton icon="pi pi-chevron-left" aria-label="${backLabel}" kind="outlined" size="small" />
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand kind="default" size="small" />
        </a>
      </GlobalHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
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
  </GlobalHeader>
${indent(main)}
</div>`

const HEADING_SIZES = {
  small: 'text-heading-xs',
  medium: 'text-heading-sm',
  large: 'text-heading-lg'
}

export const pageHeading = ({ title, description, size = 'small', titleId = '', actions = '' }) =>
  `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1${titleId ? ` id="${titleId}"` : ''} class="text-balance ${HEADING_SIZES[size]} text-(--text-default)">
        ${title}
      </h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">
      ${description}
    </p>
  </div>${
    actions
      ? `
  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">
${indent(actions, 2)}
  </div>`
      : ''
  }
</header>`

export const headingAction = ({ label, icon, click }) =>
  `<Button label="${label}" icon="${icon}" kind="outlined" size="medium" class="w-full md:w-auto" @click="${click}" />`

export const sectionHeading = (title, bottom = '') => `<header class="group/heading flex flex-col">
  <div class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)">
    <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
        <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)">${title}</h2>
      </div>
    </div>
  </div>${
    bottom
      ? `
  <div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none">
    <div class="min-w-0 overflow-hidden">
      <div class="pt-(--spacing-sm)">
${indent(bottom, 4)}
      </div>
    </div>
  </div>`
      : ''
  }
</header>`

export const sectionLabel = (title) =>
  `<p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">${title}</p>`

const rowDescription = (text) => (text ? `\n    <Item.Description>${text}</Item.Description>` : '')

export const itemRow = ({ title, description = '', control, start = false, compact = false }) =>
  `<Item size="small"${start ? ' class="items-start"' : ''}>
  <Item.Content>
    <Item.Title>${title}</Item.Title>${rowDescription(description)}
  </Item.Content>
  <Item.Actions class="${compact ? 'justify-end' : 'justify-end flex-1 max-w-(--container-3xs)'}">
${indent(control, 2)}
  </Item.Actions>
</Item>`

export const itemCard = (rows, footer = '') => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows.join('\n'), 3)}
    </Item.List>
  </template>${
    footer
      ? `
  <template #footer>
${indent(footer, 2)}
  </template>`
      : ''
  }
</CardBox>`

export const itemSection = ({ heading, rows, start = true, gap = 'layout-group-gap' }) =>
  `<section class="${start ? 'layout-section-start ' : ''}flex flex-col gap-(--${gap})">
${indent(heading)}
${indent(itemCard(rows))}
</section>`

export const withHelper = (
  control,
  helper
) => `<div class="flex w-full flex-col gap-(--spacing-xs)">
${indent(control)}
${indent(helper)}
</div>`

export const optionSelect = ({
  component = 'Select',
  model,
  options,
  display,
  attrs = [],
  trigger = [],
  content = '',
  footer = ''
}) => `<${component}
  ${[`v-model="${model}"`, 'size="large"', ...attrs, `:display-value="${display}"`].join('\n  ')}
>
  <${component}.Trigger${trigger.length > 1 ? `\n    ${trigger.join('\n    ')}\n  ` : trigger.length ? ` ${trigger[0]} ` : ' '}/>
  <${component}.Content${content ? ` class="${content}"` : ''}>
    <${component}.Option
      v-for="option in ${options}"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </${component}.Option>${
      footer
        ? `
    <template #footer>
${indent(footer, 3)}
    </template>`
        : ''
    }
  </${component}.Content>
</${component}>`

export const PANEL_FOOTER_CLASS = 'flex-col md:flex-row md:justify-end'

export const panelFooter = ({
  cancel,
  cancelDisabled,
  label,
  loading
}) => `<PanelFooter class="${PANEL_FOOTER_CLASS}">
  <Button
    class="w-full md:w-auto"
    type="button"
    label="Cancel"
    kind="outlined"
    size="medium"
    :disabled="${cancelDisabled}"
    @click="${cancel}"
  />
  <Button
    class="w-full md:w-auto"
    label="${label}"
    kind="primary"
    size="medium"
    :loading="${loading}"
    type="submit"
  />
</PanelFooter>`

export const resourceList = ({
  items,
  item,
  name,
  meta
}) => `<ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
  <li
    v-for="${item} in ${items}"
    :key="${item}.id"
    class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
  >
    <span class="text-label-code-sm text-(--text-default)">{{ ${name} }}</span>
    <span class="text-body-xs text-(--text-muted)">{{ ${meta} }}</span>
  </li>
</ul>`

export const simulation = ({
  label,
  tag,
  copy,
  actions,
  extra = 'layout-section-start '
}) => `<aside
  aria-label="Scenario simulation"
  class="${extra}flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
>
  <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
    <p class="m-0 text-overline-sm text-(--text-muted)">${label}</p>
${indent(tag, 2)}
  </div>
  <p class="m-0 text-body-sm text-(--text-muted)">
${indent(copy, 2)}
  </p>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
${indent(actions, 2)}
  </div>
</aside>`

export const stickyFooter = ({
  zIndex = false,
  cancelDisabled,
  loading,
  extra = [],
  submit = ''
}) => `<footer
  class="sticky bottom-0${zIndex ? ' z-10' : ''} border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
>
  <div
    class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md)"
  >
    <Button
      type="button"
      label="Cancel"
      kind="outlined"
      size="medium"
      :disabled="${cancelDisabled}"
    />
    <Button
      ${['label="Save"', 'kind="primary"', 'size="medium"', `:loading="${loading}"`, ...extra, submit].filter(Boolean).join('\n      ')}
    />
  </div>
</footer>`

export const radioBlocks = ({
  legend,
  options,
  model,
  name,
  prefix,
  description = true,
  disabled = ''
}) =>
  `<fieldset class="flex w-full flex-col gap-(--spacing-sm)">
  <legend class="sr-only">${legend}</legend>
  <FieldRadioBlock
    v-for="option in ${options}"
    :key="option.value"
    v-model="${model}"
    :value="option.value"
    name="${name}"
    :input-id="\`${prefix}-${name}-\${option.value}\`"
    ${[':label="option.label"', description && ':description="option.description"', disabled && `:disabled="${disabled}"`].filter(Boolean).join('\n    ')}
  />
</fieldset>`

export const formDrawer = ({
  open,
  size,
  layer = null,
  label,
  submit,
  title,
  description,
  legend,
  disabled,
  sections,
  footer
}) => `<Drawer
  v-model:open="${open}"
  size="${size}"
  side="right"
>
  <DrawerPortal>
    <DrawerOverlay${layer ? ` class="${layer.overlay}"` : ''} />
    <DrawerContent${layer ? ` class="${layer.content}"` : ''}>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="${label}"
        novalidate
        @submit.prevent="${submit}"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>${title}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              ${description}
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
            :disabled="${disabled}"
          >
            <legend class="sr-only">${legend}</legend>

${indent(sections.join('\n\n'), 6)}
          </fieldset>
        </PanelContent>

${indent(footer, 4)}
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

export const DRAWER_NAMES = [
  'Button',
  'Drawer',
  'DrawerClose',
  'DrawerContent',
  'DrawerOverlay',
  'DrawerPortal',
  'DrawerTitle',
  'PanelContent',
  'PanelFooter',
  'PanelHeader'
]
