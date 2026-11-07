import Avatar from '@aziontech/webkit/avatar'
import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Select from '@aziontech/webkit/select'
import Tag from '@aziontech/webkit/tag'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  compound,
  CREATE_PAGE_IMPORTS,
  createPage,
  declare,
  fieldRow,
  flushCard,
  section,
  VUE_IMPORT,
  webkitImport,
  webkitImports,
  wideRow
} from './_account-markup'

const EMAIL = 'myemail@azion.com'
const OWNER_NAME = 'myemail'
const OWNER_INITIALS = 'MY'
const WORKSPACE_NAME = 'My Workspace'

const BREADCRUMB = [{ label: 'Organizations' }, { label: 'Create Organization' }]

const ORGANIZATION_NAMES = ['Azion', 'Nebula Labs', 'Northwind Retail']

const ACCENTS = [
  {
    value: 'orange',
    label: 'Orange',
    ariaLabel: 'Orange mark',
    colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
  },
  {
    value: 'yellow',
    label: 'Yellow',
    ariaLabel: 'Yellow mark',
    colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
  },
  {
    value: 'red',
    label: 'Red',
    ariaLabel: 'Red mark',
    colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
  },
  {
    value: 'green',
    label: 'Green',
    ariaLabel: 'Green mark',
    colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
  },
  {
    value: 'blue',
    label: 'Blue',
    ariaLabel: 'Blue mark',
    colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
  },
  {
    value: 'violet',
    label: 'Violet',
    ariaLabel: 'Violet mark',
    colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
  },
  {
    value: 'gray',
    label: 'Gray',
    ariaLabel: 'Gray mark',
    colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
  }
]

const ADDITIONAL_DATA_KEYS = [
  {
    key: 'company_size',
    label: 'Company size',
    values: [
      { value: '1-10', label: '1–10 people' },
      { value: '11-50', label: '11–50 people' },
      { value: '51-200', label: '51–200 people' },
      { value: '201-1000', label: '201–1,000 people' },
      { value: '1000+', label: 'More than 1,000 people' }
    ]
  },
  {
    key: 'industry',
    label: 'Industry',
    values: [
      { value: 'ecommerce', label: 'Ecommerce & Retail' },
      { value: 'financial_services', label: 'Financial Services' },
      { value: 'media', label: 'Media & Streaming' },
      { value: 'saas', label: 'SaaS & Technology' },
      { value: 'gaming', label: 'Gaming' },
      { value: 'public_sector', label: 'Public Sector' },
      { value: 'other', label: 'Other' }
    ]
  }
]

const marbleOf = (name, colors) => {
  let seed = 0
  for (let index = 0; index < name.length; index += 1) {
    seed = (seed << 5) - seed + name.charCodeAt(index)
    seed |= 0
  }
  seed = Math.abs(seed)
  const unit = (value, range, position) => {
    const magnitude = value % range
    if (position && Math.floor((value / 10 ** position) % 10) % 2 === 0) return -magnitude
    return magnitude
  }
  return [0, 1, 2].map((index) => {
    const value = seed * (index + 1)
    const scale = 1.2 + unit(value, 4) / 10
    return {
      fill: colors[(seed + index) % colors.length],
      transform: `translate(${unit(value, 8, 1)} ${unit(value, 8, 2)}) rotate(${unit(value, 360, 1)} 40 40) scale(${scale})`
    }
  })
}

const swatchOf = (value) => {
  const { colors } = ACCENTS.find((entry) => entry.value === value) ?? ACCENTS[0]
  return { backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})` }
}

const MARK_PICKER = `<BoxGridSelection
  v-model="form.accent"
  :items="accents"
  :disabled="submitting"
  aria-label="Organization mark"
  class="grid w-full grid-cols-4 sm:grid-cols-7"
>
  <template #default="{ item }">
    <span class="flex flex-col items-center gap-(--spacing-xs)">
      <span class="size-(--size-8) rounded-full" :style="swatchOf(item.value)" />
      <span class="text-body-xs text-(--text-muted)">{{ item.label }}</span>
    </span>
  </template>
</BoxGridSelection>`

const ORG_AVATAR = `<span
  role="img"
  :aria-label="previewName"
  class="size-(--size-5) inline-flex shrink-0 overflow-hidden rounded-(--shape-button)"
>
  <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect width="80" height="80" :style="{ fill: marble[0].fill }" />
      <path
        filter="url(#create-organization-marble-blur)"
        :transform="marble[1].transform"
        :style="{ fill: marble[1].fill }"
        d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
      />
      <path
        filter="url(#create-organization-marble-blur)"
        :transform="marble[2].transform"
        :style="{ fill: marble[2].fill, mixBlendMode: 'overlay' }"
        d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
      />
    </g>
    <defs>
      <filter id="create-organization-marble-blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
</span>`

const MARK_CONTROL = `<div class="flex flex-col gap-(--spacing-md)">
${indent(MARK_PICKER)}
  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
    <p class="text-overline-sm text-(--text-muted)">In the header</p>
    <span class="inline-flex min-w-0 max-w-(--size-56) items-center gap-1.5 self-start rounded-(--shape-button) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-xxs)">
${indent(ORG_AVATAR, 3)}
      <span class="min-w-0 truncate text-label-sm font-medium text-(--text-default)">
        {{ previewName }}
      </span>
    </span>
  </div>
</div>`

const NAME_ROW = fieldRow(
  'Name',
  "Usually your company's name. Everyone you invite will see it.",
  `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  placeholder="Acme Inc."
  autocomplete="off"
  :disabled="submitting"
  :required="!!errors.name && !form.name.trim()"
  :invalid="!!errors.name && !!form.name.trim()"
  :aria-describedby="errors.name && !submitting ? 'organization-name-message' : undefined"
  @update:model-value="errors.name = ''"
/>
<HelperText
  v-if="errors.name && !submitting"
  id="organization-name-message"
  :kind="form.name.trim() ? 'invalid' : 'required'"
  :label="errors.name"
/>`
)

const OWNER_ROW = `<Item size="small">
  <Item.Media>
    <Avatar label="${OWNER_INITIALS}" size="medium" kind="square" />
  </Item.Media>
  <Item.Content>
    <Item.Title>${OWNER_NAME}</Item.Title>
    <Item.Description>${EMAIL}</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Tag label="Owner" severity="primary" size="medium" icon="pi pi-key" />
    <Tag label="Active" severity="success" size="medium" />
  </Item.Actions>
</Item>`

const WORKSPACE_ROW = fieldRow(
  'Name',
  "Where the organization's first workloads and resources will live. More workspaces can be added, and grouped, once the organization exists.",
  `<InputText
  v-model="form.workspace"
  size="large"
  class="w-full"
  aria-label="Workspace name"
  placeholder="${WORKSPACE_NAME}"
  autocomplete="off"
  :disabled="submitting"
  :required="!!errors.workspace"
  :aria-describedby="errors.workspace && !submitting ? 'organization-workspace-message' : undefined"
  @update:model-value="errors.workspace = ''"
/>
<HelperText
  v-if="errors.workspace && !submitting"
  id="organization-workspace-message"
  kind="required"
  :label="errors.workspace"
/>`
)

const ADDITIONAL_DATA_ROW = `<Item v-for="entry in additionalDataKeys" :key="entry.key" size="small" class="items-start">
  <Item.Content>
    <Item.Title>{{ entry.label }}</Item.Title>
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Select
        v-model="form.additionalData[entry.key]"
        size="large"
        placeholder="Select an option"
        :display-value="(value) => entry.values.find((option) => option.value === value)?.label ?? ''"
      >
        <Select.Trigger class="w-full" :aria-label="entry.label" />
        <Select.Content>
          <Select.Option v-for="option in entry.values" :key="String(option.value)" :value="option.value">
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>
  </Item.Actions>
</Item>`

const TEMPLATE = createPage({
  backLabel: 'Back to console',
  email: EMAIL,
  title: 'Create Organization',
  description:
    'An organization is the outermost thing you work inside: it owns the workspaces, and every resource deployed in them.',
  titleId: 'create-organization-title',
  saveLabel: 'Create Organization',
  body: [
    section({
      title: 'General',
      hint: 'The mark is generated from the name, so no two organizations look alike — you only pick its colour.',
      anchor: false,
      body: flushCard([
        NAME_ROW,
        wideRow(
          'Mark',
          'How the organization is identified in the header and the switcher.',
          MARK_CONTROL
        )
      ])
    }),
    section({
      title: 'Owner',
      hint: 'You create it, so you own it, and only an owner can delete an organization.',
      anchor: false,
      body: flushCard([OWNER_ROW])
    }),
    section({
      title: 'First workspace',
      hint: 'A workspace groups the resources of one context, such as a team, an environment or a kind of application.',
      anchor: false,
      body: flushCard([WORKSPACE_ROW])
    }),
    section({
      title: 'Advanced',
      hint: 'Stored with the organization as additional data, and used to shape what we recommend inside it.',
      icon: 'pi pi-cog',
      anchor: false,
      collapsible: 'advancedOpen',
      regionId: 'create-organization-advanced',
      body: flushCard([ADDITIONAL_DATA_ROW])
    })
  ].join('\n')
})

const IMPORTS = [
  ...webkitImports([
    ...CREATE_PAGE_IMPORTS,
    webkitImport('BoxGridSelection', 'box-grid-selection'),
    webkitImport('CardBox', 'card-box'),
    webkitImport('HelperText', 'helper-text'),
    webkitImport('Hint', 'hint'),
    webkitImport('InputText', 'input-text'),
    webkitImport('Item', 'item'),
    webkitImport('Select', 'select'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'reactive', 'ref']),
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('accents', ACCENTS),
  declare('additionalDataKeys', ADDITIONAL_DATA_KEYS),
  declare('organizationNames', ORGANIZATION_NAMES),
  '',
  `const marbleOf = ${marbleOf}`,
  '',
  'const swatchOf = (value) => {',
  '  const { colors } = accents.find((entry) => entry.value === value) ?? accents[0]',
  "  return { backgroundImage: 'linear-gradient(135deg, ' + colors.join(', ') + ')' }",
  '}',
  '',
  'const form = reactive({',
  "  name: '',",
  "  accent: 'orange',",
  `  workspace: '${WORKSPACE_NAME}',`,
  '  additionalData: { company_size: undefined, industry: undefined }',
  '})',
  "const errors = reactive({ name: '', workspace: '' })",
  'const submitting = ref(false)',
  'const advancedOpen = ref(false)',
  '',
  "const previewName = computed(() => form.name.trim() || 'New organization')",
  'const marble = computed(() =>',
  '  marbleOf(',
  '    previewName.value,',
  '    (accents.find((entry) => entry.value === form.accent) ?? accents[0]).colors',
  '  )',
  ')',
  '',
  'const nameTaken = (value) =>',
  '  organizationNames.some((name) => name.toLowerCase() === value.toLowerCase())',
  '',
  'const submit = () => {',
  '  if (submitting.value) return',
  '  const name = form.name.trim()',
  '  errors.name = !name',
  "    ? 'This field is required.'",
  '    : nameTaken(name)',
  "      ? 'You already belong to an organization with this name.'",
  "      : ''",
  "  errors.workspace = form.workspace.trim() ? '' : 'This field is required.'",
  '  if (errors.name || errors.workspace) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    submitting.value = false',
  '  }, 900)',
  '}'
]

const useCreateOrganization = () => {
  const form = reactive({
    name: '',
    accent: 'orange',
    workspace: WORKSPACE_NAME,
    additionalData: { company_size: undefined, industry: undefined }
  })
  const errors = reactive({ name: '', workspace: '' })
  const submitting = ref(false)
  const advancedOpen = ref(false)
  const previewName = computed(() => form.name.trim() || 'New organization')
  const marble = computed(() =>
    marbleOf(
      previewName.value,
      (ACCENTS.find((entry) => entry.value === form.accent) ?? ACCENTS[0]).colors
    )
  )
  const nameTaken = (value) =>
    ORGANIZATION_NAMES.some((name) => name.toLowerCase() === value.toLowerCase())
  const submit = () => {
    if (submitting.value) return
    const name = form.name.trim()
    errors.name = !name
      ? 'This field is required.'
      : nameTaken(name)
        ? 'You already belong to an organization with this name.'
        : ''
    errors.workspace = form.workspace.trim() ? '' : 'This field is required.'
    if (errors.name || errors.workspace) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
    }, 900)
  }
  return {
    breadcrumb: BREADCRUMB,
    accents: ACCENTS,
    additionalDataKeys: ADDITIONAL_DATA_KEYS,
    swatchOf,
    form,
    errors,
    submitting,
    advancedOpen,
    previewName,
    marble,
    submit
  }
}

const components = {
  Avatar,
  BoxGridSelection,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  ...compound('GlobalHeader', GlobalHeader, ['Left', 'Middle', 'Right', 'Brand']),
  HelperText,
  Hint,
  IconButton,
  InputText,
  ...compound('Item', Item, ['List', 'Media', 'Content', 'Title', 'Description', 'Actions']),
  ...compound('Select', Select, ['Trigger', 'Content', 'Option']),
  Tag
}

const meta = {
  title: 'Templates/Platform/Account/CreateOrganization',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Create Organization page (`/organizations/new`), on the same create-page shell as Create Team: the creation header with Back to console and the Organizations › Create Organization breadcrumb, a small page heading, then four stacked sections: General with the Name field and the Mark row (a seven-colour `BoxGridSelection` above an In the header preview of the generated marble mark beside the name), Owner with the signed-in account tagged Owner and Active, First workspace with its Name, and a collapsed Advanced section with Company size and Industry selects; the floating bar carries Cancel and Create Organization. Name flags required when empty and invalid when it repeats an organization you already belong to, only after the submit Button is pressed. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `BoxGridSelection`, `Tag`, `Select` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const CreateOrganization = {
  render: () => ({
    components,
    setup: useCreateOrganization,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A new organization for myemail@azion.com: Orange picked, the mark previewed as New organization until a name is typed, and My Workspace as the first workspace; type Azion and press Create Organization to see the duplicate-name error.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
