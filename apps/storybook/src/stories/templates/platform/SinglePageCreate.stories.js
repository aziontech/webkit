import Avatar from '@aziontech/webkit/avatar'
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

import { indent } from '../../_shared/markup'
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
import {
  CREATION_NAMES,
  creationPage,
  itemRow,
  itemSection,
  patternComponents,
  patternImports,
  radioBlocks,
  sectionLabel,
  stickyFooter,
  vueImport,
  withHelper
} from './_form-patterns'
import { declare as formDeclare } from './_forms-markup'

const components = {
  ...headerComponents({ Avatar, Breadcrumb, GlobalHeader, IconButton }),
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

const ZONE_BREADCRUMB = [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]

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
      errors.domain = 'Enter a valid domain name. Example: example.com.'
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
  "    errors.domain = 'Enter a valid domain name. Example: example.com.'",
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
  hint: 'The two fields this endpoint requires: what the domain is called here, and the hostname it answers for.',
  body: flushCard(
    [
      fieldRow({
        title: 'Name',
        description: 'Identifies the domain in this list. It is not the hostname.',
        control: zoneInput({
          key: 'name',
          label: 'Name',
          placeholder: 'My domain',
          messageId: 'create-domain-name-message'
        }),
        message: zoneMessage('name', 'create-domain-name-message')
      }),
      fieldRow({
        title: 'Domain Name',
        description:
          'The root hostname this domain answers for, without a subdomain. Pasting a zone file here imports its records instead.',
        control: zoneInput({
          key: 'domain',
          label: 'Domain Name',
          placeholder: 'example.com',
          messageId: 'create-domain-domain-message'
        }),
        message: zoneMessage('domain', 'create-domain-domain-message')
      })
    ].join('\n')
  )
})

const ZONE_ADVANCED = collapsibleSection({
  title: 'Advanced',
  icon: 'pi pi-cog',
  regionId: 'create-domain-advanced',
  open: 'advancedOpen',
  body: flushCard(
    [
      fieldRow({
        title: 'DNSSEC',
        kind: 'compact',
        description:
          "Signs this domain's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider.",
        control: '<Switch v-model="form.dnssec" aria-label="Enable DNSSEC" />'
      }),
      fieldRow({
        title: 'Active',
        kind: 'compact',
        description: 'When active, the domain answers authoritative DNS queries for its hostname.',
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
  title: 'Create Domain',
  titleId: 'create-domain-title',
  description: 'A domain holds the DNS records that answer authoritatively for a hostname.',
  backLabel: 'Back to Domains',
  body: `${ZONE_GENERAL}\n\n${ZONE_ADVANCED}`,
  start: ZONE_START
})

const PURGE_BREADCRUMB = [{ label: 'Cache', href: '/cache' }, { label: 'Create Purge' }]

const PURGE_LAYERS = [
  {
    value: 'cache',
    label: 'Cache',
    description: 'Evicts the objects from the cache layer, in every location.'
  },
  {
    value: 'tiered_cache',
    label: 'Tiered Cache',
    description:
      'Evicts the objects from the tiered cache layer that sits between the cache and your origin.'
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
          <Item size="small">
            <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
              <Item.Content>
                <Item.Title>{{ selectedType.label }} List</Item.Title>
                <Item.Description>{{ selectedType.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="w-full">
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <div class="contents font-(family-name:--font-code) text-body-sm">
                    <Textarea
                      v-model="form.arguments"
                      class="w-full"
                      :rows="6"
                      :aria-label="selectedType.label + ' list'"
                      :placeholder="selectedType.placeholder"
                      :required="!!error.message && error.kind === 'required'"
                      :invalid="!!error.message && error.kind === 'invalid'"
                      aria-describedby="create-purge-arguments-message"
                      spellcheck="false"
                      autocomplete="off"
                    />
                  </div>
                  <HelperText
                    id="create-purge-arguments-message"
                    :kind="error.message ? error.kind : 'helper'"
                    :label="guidance"
                  />
                </div>
              </Item.Actions>
            </div>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <Message
      severity="warning"
      size="small"
      label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the cache fills again."
    />
  </div>
</section>`

const PURGE_TEMPLATE = createPage({
  title: 'Create Purge',
  titleId: 'create-purge-title',
  description:
    'Evict cached objects from every location. Each one is fetched from your origin again on its next request.',
  backLabel: 'Back to Cache',
  body: `${PURGE_TARGET}\n\n${PURGE_ARGUMENTS}`,
  saveLabel: 'Purge'
})

const SERVICE_BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'In Page create' }]

const PROTOCOL_USAGE_OPTIONS = [
  {
    value: 'http',
    label: 'HTTP support',
    description: 'Use only the HTTP protocol. Choose from the available HTTP ports.'
  },
  {
    value: 'https',
    label: 'HTTP and HTTPS support',
    description:
      'Use both HTTP and HTTPS protocols. Choose from the available HTTP and HTTPS ports.'
  },
  {
    value: 'http3',
    label: 'HTTP/3 support',
    description:
      'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
  }
]

const HTTP_PORT_OPTIONS = [
  { label: '80 (Default)', value: '80' },
  { label: '8080', value: '8080' },
  { label: '8008', value: '8008' }
]

const HTTPS_PORT_OPTIONS = [
  { label: '443 (Default)', value: '443' },
  { label: '8443', value: '8443' }
]

const PROTOCOL_POLICY_OPTIONS = [
  { value: 'preserve', label: 'Preserve HTTP/HTTPS' },
  { value: 'http', label: 'Enforce HTTP' },
  { value: 'https', label: 'Enforce HTTPS' }
]

const BROWSER_CACHE_OPTIONS = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      'Honor cache policies from the origin or define a new maximum cache TTL for browsers.'
  }
]

const CACHE_OPTIONS = [
  { value: 'override', label: 'Override cache settings' },
  {
    value: 'honor',
    label: 'Honor cache policies',
    description:
      "Honor cache policies from the origin or define a new maximum TTL for the cache. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
  }
]

const SERVICE_FORM = {
  name: '',
  protocolUsage: 'http',
  httpPorts: ['80'],
  httpsPorts: ['443'],
  protocolPolicy: 'preserve',
  address: '',
  hostHeader: '${host}',
  browserCache: 'override',
  browserMaxTtl: 0,
  cache: 'override',
  cacheMaxTtl: 60,
  debugRules: false
}

const SERVICE_NO_ERRORS = { name: '', httpPorts: '', address: '', hostHeader: '' }

const SERVICE_SUBMITTED_ERRORS = {
  name: 'This field is required.',
  httpPorts: '',
  address: 'This field is required.',
  hostHeader: ''
}

const SERVICE_NAMES = [
  ...CREATION_NAMES,
  'Button',
  'CardBox',
  'FieldRadioBlock',
  'HelperText',
  'InputNumber',
  'InputText',
  'Item',
  'MultiSelect',
  'Switch'
]

const portsLabel = (list) => (values) =>
  (values ?? [])
    .map((value) => list.find((option) => option.value === value)?.label ?? value)
    .join(', ')

const serviceSetupFor = (initialErrors) => () => {
  const form = reactive(structuredClone(SERVICE_FORM))
  const errors = reactive({ ...initialErrors })
  const submitting = ref(false)
  const httpsEnabled = computed(() => form.protocolUsage !== 'http')
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }
  return {
    breadcrumb: SERVICE_BREADCRUMB,
    protocolUsageOptions: PROTOCOL_USAGE_OPTIONS,
    httpPortOptions: HTTP_PORT_OPTIONS,
    httpsPortOptions: HTTPS_PORT_OPTIONS,
    protocolPolicyOptions: PROTOCOL_POLICY_OPTIONS,
    browserCacheOptions: BROWSER_CACHE_OPTIONS,
    cacheOptions: CACHE_OPTIONS,
    portsLabel,
    form,
    errors,
    submitting,
    httpsEnabled,
    submit: () => validate()
  }
}

const serviceScriptFor = (initialErrors) => [
  ...patternImports(SERVICE_NAMES),
  vueImport(['computed', 'reactive', 'ref']),
  '',
  formDeclare('breadcrumb', SERVICE_BREADCRUMB),
  '',
  formDeclare('protocolUsageOptions', PROTOCOL_USAGE_OPTIONS),
  formDeclare('httpPortOptions', HTTP_PORT_OPTIONS),
  formDeclare('httpsPortOptions', HTTPS_PORT_OPTIONS),
  formDeclare('protocolPolicyOptions', PROTOCOL_POLICY_OPTIONS),
  formDeclare('browserCacheOptions', BROWSER_CACHE_OPTIONS),
  formDeclare('cacheOptions', CACHE_OPTIONS),
  '',
  'const portsLabel = (list) => (values) =>',
  '  (values ?? [])',
  '    .map((value) => list.find((option) => option.value === value)?.label ?? value)',
  "    .join(', ')",
  '',
  formDeclare('form', SERVICE_FORM, 'reactive'),
  "const httpsEnabled = computed(() => form.protocolUsage !== 'http')",
  formDeclare('errors', initialErrors, 'reactive'),
  'const submitting = ref(false)',
  '',
  'const validate = () => {',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  "  errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'",
  "  errors.address = form.address.trim() ? '' : 'This field is required.'",
  "  errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'",
  '  return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader',
  '}',
  '',
  'const submit = () => validate()'
]

const serviceRequiredText = ({ model, label, id, error, placeholder = '' }) =>
  withHelper(
    `<InputText
  v-model="${model}"
  size="large"
  class="w-full"
  aria-label="${label}"${placeholder ? `\n  placeholder="${placeholder}"` : ''}
  :required="!!${error}"
  :aria-describedby="${error} ? '${id}' : undefined"
  @update:model-value="${error} = ''"
/>`,
    `<HelperText
  v-if="${error}"
  id="${id}"
  kind="required"
  :label="${error}"
/>`
  )

const SERVICE_HTTP_PORTS = withHelper(
  `<MultiSelect
  v-model="form.httpPorts"
  size="large"
  class="w-full"
  placeholder="Select ports"
  :required="!!errors.httpPorts"
  :display-value="portsLabel(httpPortOptions)"
  @update:model-value="errors.httpPorts = ''"
>
  <MultiSelect.Trigger
    id="app-httpPorts"
    aria-label="HTTP ports"
    :aria-describedby="errors.httpPorts ? 'app-httpPorts-error' : undefined"
  />
  <MultiSelect.Content>
    <MultiSelect.Option
      v-for="option in httpPortOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`,
  `<HelperText
  v-if="errors.httpPorts"
  id="app-httpPorts-error"
  kind="required"
  :label="errors.httpPorts"
/>`
)

const SERVICE_HTTPS_PORTS = `<MultiSelect
  v-model="form.httpsPorts"
  size="large"
  class="w-full"
  placeholder="443 (Default)"
  :disabled="!httpsEnabled"
  :display-value="portsLabel(httpsPortOptions)"
>
  <MultiSelect.Trigger aria-label="HTTPS ports" />
  <MultiSelect.Content>
    <MultiSelect.Option
      v-for="option in httpsPortOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </MultiSelect.Option>
  </MultiSelect.Content>
</MultiSelect>`

const serviceTtlInput = (model, label) => `<InputNumber
  v-model="${model}"
  size="large"
  class="w-full"
  :min="0"
  aria-label="${label}"
/>`

const SERVICE_SECTIONS = [
  itemSection({
    heading: sectionLabel('General'),
    start: false,
    rows: [
      itemRow({
        title: 'Name',
        description: 'Give a unique and descriptive name to identify the service.',
        control: serviceRequiredText({
          model: 'form.name',
          label: 'Name',
          id: 'app-name-error',
          error: 'errors.name',
          placeholder: 'My Service'
        })
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Delivery Settings'),
    rows: [
      itemRow({
        title: 'Protocol Usage',
        control: radioBlocks({
          legend: 'Protocol Usage',
          options: 'protocolUsageOptions',
          model: 'form.protocolUsage',
          name: 'protocolUsage',
          prefix: 'app'
        })
      }),
      itemRow({ title: 'HTTP ports', control: SERVICE_HTTP_PORTS }),
      itemRow({
        title: 'HTTPS ports',
        description: 'Applies when the service serves HTTPS traffic.',
        control: SERVICE_HTTPS_PORTS
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Origins'),
    rows: [
      itemRow({
        title: 'Origin Type',
        description: "The origin type is pre-defined and can't be customized.",
        control: `<InputText
  model-value="Single Origin"
  size="large"
  class="w-full"
  aria-label="Origin Type"
  readonly
/>`
      }),
      itemRow({
        title: 'Protocol Policy',
        description: 'Select the protocol used between the cache servers and the origin.',
        control: radioBlocks({
          legend: 'Protocol Policy',
          options: 'protocolPolicyOptions',
          model: 'form.protocolPolicy',
          name: 'protocolPolicy',
          prefix: 'app',
          description: false
        })
      }),
      itemRow({
        title: 'Address',
        description: 'Define an origin for the content in FQDN format or an IPv4/IPv6 address.',
        control: serviceRequiredText({
          model: 'form.address',
          label: 'Address',
          id: 'app-address-error',
          error: 'errors.address',
          placeholder: 'example.com'
        })
      }),
      itemRow({
        title: 'Host header',
        description: 'Identify a virtualhost sent in the Host header to the origin.',
        control: serviceRequiredText({
          model: 'form.hostHeader',
          label: 'Host header',
          id: 'app-hostHeader-error',
          error: 'errors.hostHeader'
        })
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Cache Expiration Policies'),
    rows: [
      itemRow({
        title: 'Browser Cache Settings',
        control: radioBlocks({
          legend: 'Browser Cache Settings',
          options: 'browserCacheOptions',
          model: 'form.browserCache',
          name: 'browserCache',
          prefix: 'app'
        })
      }),
      itemRow({
        title: 'Maximum TTL (seconds)',
        control: serviceTtlInput('form.browserMaxTtl', 'Browser maximum TTL in seconds')
      }),
      itemRow({
        title: 'Cache Settings',
        control: radioBlocks({
          legend: 'Cache Settings',
          options: 'cacheOptions',
          model: 'form.cache',
          name: 'cache',
          prefix: 'app'
        })
      }),
      itemRow({
        title: 'Maximum TTL (seconds)',
        description:
          'Enable dynamic acceleration in the Main Settings tab to use values lower than 60 seconds. A secondary cache requires a cache TTL equal to or greater than 3 seconds.',
        control: serviceTtlInput('form.cacheMaxTtl', 'Cache maximum TTL in seconds')
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Debug Rules'),
    rows: [
      itemRow({
        title: 'Active',
        description:
          'Rules that were successfully executed will be listed in the request logs and in the trace of each event.',
        compact: true,
        control: `<Switch
  v-model="form.debugRules"
  aria-label="Active"
/>`
      })
    ]
  })
]

const SERVICE_TEMPLATE = creationPage({
  backLabel: 'Back to Forms',
  main: `<main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
  <form
    class="flex min-h-full flex-col"
    aria-label="Create Service"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
      <fieldset
        class="mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Create service</legend>

${indent(SERVICE_SECTIONS.join('\n\n'), 4)}
      </fieldset>
    </div>

${indent(stickyFooter({ cancelDisabled: 'submitting', loading: 'submitting', submit: '@click="submit"' }), 2)}
  </form>
</main>`
})

const serviceComponents = patternComponents(SERVICE_NAMES)

const meta = {
  title: 'Templates/Platform/Shell/SinglePageCreate',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The page a first-level resource is created on in one screen: its own creation header with no sidebar, a centred form column opening with a small page heading, then stacked sections, each a heading with a Hint over a flush CardBox of field rows, and a fixed bar under the scrolling form, the same bar Version Detail uses, carrying an optional leading slot plus Cancel and the submit Button. The same page covers a resource with a General section and a collapsed Advanced section, and an action whose submit label follows what it does (Save, Purge, Create). A long create such as Create Service groups `Item` rows under small headings and ends in a full-bleed sticky footer. Fields flag required or invalid only after the submit Button is pressed, and each error clears as soon as its field is edited. Built from `GlobalHeader`, `IconButton`, `Breadcrumb`, `Avatar`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `Switch`, `FieldRadioBlock`, `Textarea`, `Message`, `MultiSelect`, `InputNumber` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'create page',
        'create resource page',
        'create zone',
        'full page create form',
        'top-level create page',
        'new resource form',
        'creation page',
        'página de criação',
        'criar recurso',
        'formulário de criação',
        'single page create',
        'create purge',
        'create service page',
        'criação em uma página'
      ],
      skills: ['webkit-create-surface', 'webkit-form', 'webkit-errors']
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
          'Create Domain: a General section with Name and Domain Name, a collapsed Advanced section holding the DNSSEC and Active switches, and the bar with Import and its paste hint on the left, Cancel and Save on the right.'
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

export const CreateService = {
  render: () => ({
    components: serviceComponents,
    setup: serviceSetupFor(SERVICE_NO_ERRORS),
    template: SERVICE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A long create, Create Service, in five groups of Item rows (General, Delivery Settings, Origins, Cache Expiration Policies and Debug Rules) over a full-bleed sticky footer with Cancel and Save: Name and Address empty, HTTP port 80 preselected, HTTPS ports disabled until a protocol with HTTPS is chosen, and the host header prefilled with ${host}.'
      },
      source: { code: toSfc(serviceScriptFor(SERVICE_NO_ERRORS), SERVICE_TEMPLATE) }
    }
  }
}

export const RequiredFields = {
  render: () => ({
    components: serviceComponents,
    setup: serviceSetupFor(SERVICE_SUBMITTED_ERRORS),
    template: SERVICE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Service after Save on the empty form: Name and Address carry the required state with This field is required. under them, and typing into either clears its own error.'
      },
      source: { code: toSfc(serviceScriptFor(SERVICE_SUBMITTED_ERRORS), SERVICE_TEMPLATE) }
    }
  }
}
