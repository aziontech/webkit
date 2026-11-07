import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import Switch from '@aziontech/webkit/switch'
import Textarea from '@aziontech/webkit/textarea'
import { computed, reactive, ref, watch } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  collapsibleSection,
  createPage,
  declare,
  fieldRow,
  flushCard,
  HEADER_IMPORTS,
  headerComponents,
  itemComponents,
  section
} from './_create-markup'

const components = {
  ...headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }),
  ...itemComponents(Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Button,
  CardBox,
  FieldRadioBlock,
  HelperText,
  Hint,
  InputText,
  Message,
  Switch,
  Textarea
}

const ZONE_BREADCRUMB = [{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Create Zone' }]

const NAME_MAX = 50
const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

const createZoneState = () => {
  const form = reactive({ name: '', domain: '', dnssec: false, active: true })
  const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })
  const advancedOpen = ref(false)
  const fileRef = ref(null)

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = `Use at most ${NAME_MAX} characters.`
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: mydomain.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const submit = () => validate()
  const openImport = () => fileRef.value?.click()

  return { breadcrumb: ZONE_BREADCRUMB, form, errors, advancedOpen, fileRef, submit, openImport }
}

const ZONE_SCRIPT = [
  ...HEADER_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Switch from '@aziontech/webkit/switch'",
  "import { reactive, ref } from 'vue'",
  '',
  declare('breadcrumb', ZONE_BREADCRUMB),
  '',
  "const form = reactive({ name: '', domain: '', dnssec: false, active: true })",
  "const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })",
  'const advancedOpen = ref(false)',
  'const fileRef = ref(null)',
  '',
  `const NAME_MAX = ${NAME_MAX}`,
  'const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$/',
  '',
  'const validate = () => {',
  '  const name = form.name.trim()',
  '  if (!name) {',
  "    errors.nameKind = 'required'",
  "    errors.name = 'This field is required.'",
  '  } else if (name.length > NAME_MAX) {',
  "    errors.nameKind = 'invalid'",
  "    errors.name = 'Use at most ' + NAME_MAX + ' characters.'",
  '  } else {',
  "    errors.name = ''",
  '  }',
  '',
  '  const domain = form.domain.trim()',
  '  if (!domain) {',
  "    errors.domainKind = 'required'",
  "    errors.domain = 'This field is required.'",
  '  } else if (!DOMAIN_PATTERN.test(domain)) {',
  "    errors.domainKind = 'invalid'",
  "    errors.domain = 'Enter a valid domain name. Example: mydomain.com.'",
  '  } else {',
  "    errors.domain = ''",
  '  }',
  '',
  '  return !errors.name && !errors.domain',
  '}',
  '',
  'const submit = () => validate()',
  'const openImport = () => fileRef.value?.click()'
]

const zoneInput = ({ key, label, placeholder, messageId }) => `<InputText
  v-model="form.${key}"
  size="large"
  class="w-full"
  aria-label="${label}"
  placeholder="${placeholder}"
  autocomplete="off"
  :required="!!errors.${key} && errors.${key}Kind === 'required'"
  :invalid="!!errors.${key} && errors.${key}Kind === 'invalid'"
  :aria-describedby="errors.${key} ? '${messageId}' : undefined"
  @update:model-value="errors.${key} = ''"
/>`

const zoneMessage = (key, messageId) =>
  `<HelperText v-if="errors.${key}" id="${messageId}" :kind="errors.${key}Kind" :label="errors.${key}" />`

const ZONE_GENERAL = section({
  title: 'General',
  hint: 'The two fields this endpoint requires: what the zone is called here, and the domain it answers for.',
  body: flushCard(
    [
      fieldRow({
        title: 'Name',
        description: 'Identifies the zone in this list. It is not the domain.',
        control: zoneInput({
          key: 'name',
          label: 'Name',
          placeholder: 'My zone',
          messageId: 'create-zone-name-message'
        }),
        message: zoneMessage('name', 'create-zone-name-message')
      }),
      fieldRow({
        title: 'Domain Name',
        description:
          'The root domain this zone answers for, without a subdomain. Pasting a zone file here imports its records instead.',
        control: zoneInput({
          key: 'domain',
          label: 'Domain Name',
          placeholder: 'mydomain.com',
          messageId: 'create-zone-domain-message'
        }),
        message: zoneMessage('domain', 'create-zone-domain-message')
      })
    ].join('\n')
  )
})

const ZONE_ADVANCED = collapsibleSection({
  title: 'Advanced',
  icon: 'pi pi-cog',
  regionId: 'create-zone-advanced',
  open: 'advancedOpen',
  body: flushCard(
    [
      fieldRow({
        title: 'DNSSEC',
        kind: 'compact',
        description:
          "Signs this zone's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider.",
        control: '<Switch v-model="form.dnssec" aria-label="Enable DNSSEC" />'
      }),
      fieldRow({
        title: 'Active',
        kind: 'compact',
        description: 'When active, the zone answers authoritative DNS queries for the domain.',
        control: '<Switch v-model="form.active" aria-label="Active" />'
      })
    ].join('\n')
  )
})

const ZONE_START = `<Button type="button" label="Import" kind="outlined" size="medium" icon="pi pi-upload" @click="openImport" />
<p class="min-w-0 text-body-sm text-(--text-muted)">
  or paste zone file contents in Domain Name
</p>
<input ref="fileRef" type="file" accept=".zone,.txt,.db,text/plain" class="sr-only" tabindex="-1" aria-hidden="true" />`

const ZONE_TEMPLATE = createPage({
  title: 'Create Zone',
  titleId: 'create-zone-title',
  description:
    "A zone holds the DNS records that answer authoritatively for a domain, served from Azion's distributed infrastructure.",
  backLabel: 'Back to Edge DNS',
  body: `${ZONE_GENERAL}\n\n${ZONE_ADVANCED}`,
  start: ZONE_START
})

const PURGE_BREADCRUMB = [
  { label: 'Real-Time Purge', href: '/real-time-purge' },
  { label: 'Create Purge' }
]

const PURGE_LAYERS = [
  {
    value: 'cache',
    label: 'Cache',
    description: "Evicts the objects from Azion's cache layer, in every edge location."
  },
  {
    value: 'tiered_cache',
    label: 'Tiered Cache',
    description:
      'Evicts the objects from the tiered cache layer that sits between the edge and your origin.'
  }
]

const PURGE_TYPES = [
  {
    value: 'cachekey',
    label: 'Cache Key',
    noun: 'cache key',
    description: 'The exact keys objects were cached under, including any @@ variations.',
    placeholder: 'www.example.com/images/image.jpg@@cookie_name=value',
    helper: 'One cache key per line, without the protocol.'
  },
  {
    value: 'url',
    label: 'URL',
    noun: 'URL',
    description: 'Every cached variation of each address.',
    placeholder: 'www.example.com/index.html\nwww.example.com/styles/main.css',
    helper: 'One URL per line, without the protocol.'
  },
  {
    value: 'wildcard',
    label: 'Wildcard',
    noun: 'wildcard expression',
    description: 'Everything that matches a pattern, where an asterisk matches any path.',
    placeholder: 'www.example.com/images/*',
    helper: 'One expression per line. An asterisk matches any sequence of characters.'
  }
]

const TIERED_CACHE_TYPES = ['cachekey']

const createPurgeState = () => {
  const form = reactive({ layer: 'cache', type: 'url', arguments: '' })
  const error = reactive({ kind: 'required', message: '' })

  const tiered = computed(() => form.layer === 'tiered_cache')
  const typeAllowed = (value) => !tiered.value || TIERED_CACHE_TYPES.includes(value)

  watch(tiered, () => {
    if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]
  })

  watch(
    () => [form.type, form.arguments],
    () => {
      error.message = ''
    }
  )

  const selectedType = computed(
    () => PURGE_TYPES.find((type) => type.value === form.type) ?? PURGE_TYPES[1]
  )
  const entries = computed(() =>
    form.arguments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const guidance = computed(() => error.message || selectedType.value.helper)

  const lineIssue = (line, index) => {
    const at = entries.value.length > 1 ? `Line ${index + 1}` : 'The argument'
    if (/^https?:\/\//i.test(line)) return `${at} starts with a protocol. Remove it.`
    if (form.type === 'wildcard' && !line.includes('*'))
      return `${at} has no asterisk. Choose URL to purge an exact address.`
    if (form.type === 'url' && line.includes('*'))
      return `${at} contains an asterisk. Choose Wildcard to purge a pattern.`
    return ''
  }

  const submit = () => {
    if (!entries.value.length) {
      error.kind = 'required'
      error.message = 'This field is required.'
      return
    }
    const issue = entries.value.map(lineIssue).find(Boolean)
    if (issue) {
      error.kind = 'invalid'
      error.message = issue
    }
  }

  return {
    breadcrumb: PURGE_BREADCRUMB,
    layers: PURGE_LAYERS,
    types: PURGE_TYPES,
    form,
    error,
    typeAllowed,
    selectedType,
    guidance,
    submit
  }
}

const PURGE_SCRIPT = [
  ...HEADER_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Item from '@aziontech/webkit/item'",
  "import Message from '@aziontech/webkit/message'",
  "import Textarea from '@aziontech/webkit/textarea'",
  "import { computed, reactive, watch } from 'vue'",
  '',
  declare('breadcrumb', PURGE_BREADCRUMB),
  declare('layers', PURGE_LAYERS),
  declare('types', PURGE_TYPES),
  "const TIERED_CACHE_TYPES = ['cachekey']",
  '',
  "const form = reactive({ layer: 'cache', type: 'url', arguments: '' })",
  "const error = reactive({ kind: 'required', message: '' })",
  '',
  "const tiered = computed(() => form.layer === 'tiered_cache')",
  'const typeAllowed = (value) => !tiered.value || TIERED_CACHE_TYPES.includes(value)',
  '',
  'watch(tiered, () => {',
  '  if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]',
  '})',
  '',
  'watch(',
  '  () => [form.type, form.arguments],',
  '  () => {',
  "    error.message = ''",
  '  }',
  ')',
  '',
  'const selectedType = computed(() => types.find((type) => type.value === form.type) ?? types[1])',
  'const entries = computed(() =>',
  '  form.arguments',
  "    .split('\\n')",
  '    .map((line) => line.trim())',
  '    .filter(Boolean)',
  ')',
  '',
  'const guidance = computed(() => error.message || selectedType.value.helper)',
  '',
  'const lineIssue = (line, index) => {',
  "  const at = entries.value.length > 1 ? 'Line ' + (index + 1) : 'The argument'",
  "  if (/^https?:\\/\\//i.test(line)) return at + ' starts with a protocol. Remove it.'",
  "  if (form.type === 'wildcard' && !line.includes('*'))",
  "    return at + ' has no asterisk. Choose URL to purge an exact address.'",
  "  if (form.type === 'url' && line.includes('*'))",
  "    return at + ' contains an asterisk. Choose Wildcard to purge a pattern.'",
  "  return ''",
  '}',
  '',
  'const submit = () => {',
  '  if (!entries.value.length) {',
  "    error.kind = 'required'",
  "    error.message = 'This field is required.'",
  '    return',
  '  }',
  '  const issue = entries.value.map(lineIssue).find(Boolean)',
  '  if (issue) {',
  "    error.kind = 'invalid'",
  '    error.message = issue',
  '  }',
  '}'
]

const radioGroup = ({
  legend,
  list,
  model,
  name,
  extra = ''
}) => `<fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
  <legend class="sr-only">${legend}</legend>
  <FieldRadioBlock
    v-for="option in ${list}"
    :key="option.value"
    v-model="${model}"
    :value="option.value"
    name="${name}"
    :input-id="'${name}-' + option.value"
    :label="option.label"
    :description="option.description"${extra}
  />
</fieldset>`

const PURGE_TARGET = section({
  title: 'Target',
  hint: 'Where the objects are evicted from, and how this purge identifies them.',
  body: flushCard(
    [
      fieldRow({
        title: 'Layer',
        kind: 'wide',
        description: 'The cache layer the objects are evicted from.',
        control: radioGroup({
          legend: 'Layer',
          list: 'layers',
          model: 'form.layer',
          name: 'purge-layer'
        })
      }),
      fieldRow({
        title: 'Purge Type',
        kind: 'wide',
        description: 'How the arguments below identify the objects.',
        control: radioGroup({
          legend: 'Purge Type',
          list: 'types',
          model: 'form.type',
          name: 'purge-type',
          extra: `
    :helper-text="typeAllowed(option.value) ? '' : 'Tiered Cache purges by cache key only.'"
    :disabled="!typeAllowed(option.value)"`
        })
      })
    ].join('\n')
  )
})

const PURGE_ARGUMENTS = `<section class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">
          Arguments
        </span>
      </h2>
      <Hint :text="'The ' + selectedType.noun + 's to purge, one per line.'" class="shrink-0" />
    </div>
  </div>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <Item size="small" class="flex-col items-stretch gap-(--spacing-sm)">
            <Item.Content>
              <Item.Title>{{ selectedType.label }} List</Item.Title>
              <Item.Description>{{ selectedType.description }}</Item.Description>
            </Item.Content>
            <Item.Actions class="w-full justify-start">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Textarea
                  v-model="form.arguments"
                  class="w-full font-(family-name:--font-code) text-body-sm"
                  :rows="6"
                  :aria-label="selectedType.label + ' list'"
                  :placeholder="selectedType.placeholder"
                  :required="!!error.message && error.kind === 'required'"
                  :invalid="!!error.message && error.kind === 'invalid'"
                  aria-describedby="create-purge-arguments-message"
                  spellcheck="false"
                  autocomplete="off"
                />
                <HelperText
                  id="create-purge-arguments-message"
                  :kind="error.message ? error.kind : 'helper'"
                  :label="guidance"
                />
              </div>
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <Message
      severity="warning"
      size="small"
      label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the edge fills its cache again."
    />
  </div>
</section>`

const PURGE_TEMPLATE = createPage({
  title: 'Create Purge',
  titleId: 'create-purge-title',
  description:
    'Evict cached objects from every edge location. Each one is fetched from your origin again on its next request.',
  backLabel: 'Back to Real-Time Purge',
  body: `${PURGE_TARGET}\n\n${PURGE_ARGUMENTS}`,
  saveLabel: 'Purge'
})

const meta = {
  title: 'Templates/Platform/Shell/CreatePage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The page a first-level resource is created on in one screen: its own creation header with no sidebar, a centred form column opening with a small page heading, then stacked sections, each a heading with a Hint over a flush CardBox of field rows, and a floating sticky bar carrying an optional leading slot plus Cancel and the submit Button. Create Zone (`/edge-dns/new`), Create Purge (`/real-time-purge/new`), Create Database (`/sql-database/new`, a General section with Name and a collapsed Advanced section with Active), Create Team (`/teams/new`) and Create Organization (`/organizations/new`) render it; the submit label follows the page (Save, Purge, Create, Create Organization). Fields flag required or invalid only after the submit Button is pressed. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `Switch`, `FieldRadioBlock`, `Textarea`, `Message` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: createZoneState,
    template: ZONE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Zone: a General section with Name and Domain Name, a collapsed Advanced section holding the DNSSEC and Active switches, and the bar with Import and its paste hint on the left, Cancel and Save on the right.'
      },
      source: { code: toSfc(ZONE_SCRIPT, ZONE_TEMPLATE) }
    }
  }
}

export const CreatePurge = {
  render: () => ({
    components,
    setup: createPurgeState,
    template: PURGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Purge: a Target section of wide rows choosing the Layer and the Purge Type with FieldRadioBlock, an Arguments section whose code-font Textarea follows the chosen type, a warning Message, and a bar with only Cancel and Purge. Choosing Tiered Cache leaves Cache Key as the only allowed type.'
      },
      source: { code: toSfc(PURGE_SCRIPT, PURGE_TEMPLATE) }
    }
  }
}
