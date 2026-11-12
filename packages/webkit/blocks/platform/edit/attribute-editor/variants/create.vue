<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import HelperText, { type HelperTextKind } from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  type ScopeRef = { type: string; id: string; name: string }
  type VariableDraft = { key: string; value: string; secret: boolean; scope: ScopeRef[] }
  type Entry = { id: number; key: string; value: string; secret: boolean; visible: boolean }
  type EntryProblem = { kind: HelperTextKind; message: string }
  type Pair = { key: string; value: string }
  type ScopeOption = { value: string; label: string }
  type ScopeState = {
    type: string
    label: string
    plural: string
    placeholder: string
    enabled: boolean
    ids: string[]
    query: string
    options: ScopeOption[]
  }

  const existingKeys = ref([
    'API_BASE_URL',
    'PAYMENT_SECRET_KEY',
    'FEATURE_FLAGS',
    'DATABASE_PASSWORD',
    'MAX_UPLOAD_MB'
  ])
  const onCreated = (_created: VariableDraft[]) => {}

  const SECRET_MASK = '••••••••'
  const SECRET_HINT =
    'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'
  const VIEW_OPTIONS = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]
  const fieldClass =
    'h-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-(--text-default) outline-none placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const formId = useId()
  const fieldId = (entry: Entry, part: string) => `${formId}-${part}-${entry.id}`
  const messageId = (entry: Entry, part: string) => `${fieldId(entry, part)}-message`

  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false): Entry => ({
    id: (nextEntryId += 1),
    key,
    value,
    secret,
    visible: false
  })
  const isEmptyEntry = (entry: Entry) => !entry.key.trim() && !entry.value.trim()
  const formatKey = (value: string) => value.replace(/\s/g, '_').toUpperCase()

  const drawerOpen = ref(false)
  const submitting = ref(false)
  const submitted = ref(false)
  const entries = ref([createEntry()])
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() =>
    filledEntries.value.reduce((counts, entry) => {
      const key = entry.key.trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map<string, number>())
  )
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )

  const keyError = (entry: Entry): EntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { kind: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if ((keyCounts.value.get(key) ?? 0) > 1)
      return { kind: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (existingKeys.value.includes(key))
      return { kind: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const valueError = (entry: Entry): EntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim()) return null
    return { kind: 'required', message: 'Value is required.' }
  }

  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  const setKey = (entry: Entry, value: string) => {
    entry.key = formatKey(value)
  }

  const secretTooltip = (entry: Entry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry: Entry) => (entry.secret ? 'Unmark as secret' : 'Mark as secret')

  const unquote = (value: string) => {
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
      return value.slice(1, -1)
    }
    return value
  }
  const parseEnvFile = (content: string | undefined) => {
    const parsed: Pair[] = []
    const invalidLines: number[] = []
    String(content ?? '')
      .split(/\r?\n/)
      .forEach((line, index) => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        const declaration = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
        const match = declaration.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
        if (!match) {
          invalidLines.push(index + 1)
          return
        }
        parsed.push({ key: match[1], value: unquote(match[2]) })
      })
    return { parsed, invalidLines }
  }
  const parseJsonObject = (content: string): Pair[] | null => {
    const parsed: unknown = JSON.parse(content)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return Object.entries(parsed)
      .filter(([key]) => key.trim())
      .map(([key, value]) => ({
        key: formatKey(key),
        value:
          typeof value === 'string'
            ? value
            : value == null
              ? ''
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value)
      }))
  }
  const parsePasted = (content: string | undefined) => {
    const text = String(content ?? '').trim()
    if (!text) return null
    if (text.startsWith('{')) {
      try {
        const pairs = parseJsonObject(text)
        return pairs?.length ? pairs : null
      } catch {
        return null
      }
    }
    const { parsed, invalidLines } = parseEnvFile(text)
    return invalidLines.length || !parsed.length ? null : parsed
  }
  const toEntries = (pairs: Pair[], secrets = new Set<string>()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))

  const pasteIntoKey = (event: ClipboardEvent, index: number) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }

  const onFilePicked = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const [file] = input.files ?? []
    input.value = ''
    if (!file) return
    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) return
    view.value = 'Form'
    await nextTick()
    entries.value = [...filledEntries.value, ...toEntries(parsed)]
    if (!entries.value.length) entries.value = [createEntry()]
  }

  watch(view, (next) => {
    if (next === 'JSON') {
      jsonError.value = ''
      jsonText.value = JSON.stringify(
        Object.fromEntries(filledEntries.value.map((entry) => [entry.key.trim(), entry.value])),
        null,
        2
      )
      return
    }
    if (jsonError.value) return
    const secrets = new Set(
      filledEntries.value.filter((entry) => entry.secret).map((entry) => entry.key.trim())
    )
    const pairs = parseJsonObject(jsonText.value) ?? []
    entries.value = pairs.length ? toEntries(pairs, secrets) : [createEntry()]
  })

  watch(jsonText, (text) => {
    if (view.value !== 'JSON') return
    try {
      jsonError.value = parseJsonObject(text)
        ? ''
        : 'Variables must be a JSON object with key/value pairs.'
    } catch {
      jsonError.value = 'Variables must be valid JSON.'
    }
  })

  const scopeTypes = [
    { type: 'global', label: 'Global', plural: '' },
    { type: 'environment', label: 'Environment', plural: 'environments' },
    { type: 'project', label: 'Project', plural: 'projects' },
    { type: 'service', label: 'Service', plural: 'services' },
    { type: 'policy', label: 'Policy', plural: 'policies' }
  ]
  const scopeOptions: Record<string, ScopeOption[]> = {
    environment: [
      { value: 'env-production', label: 'Production' },
      { value: 'env-preview', label: 'Preview' },
      { value: 'env-stage', label: 'Stage' }
    ],
    project: [
      { value: '1020655', label: 'web-app' },
      { value: '1020828', label: 'docs-site' },
      { value: '1021001', label: 'api-gateway' },
      { value: '1021174', label: 'mobile-backend' }
    ],
    service: [
      { value: '4410203040', label: 'checkout' },
      { value: '3344556677', label: 'storefront' },
      { value: '8899001122', label: 'search' },
      { value: '9988776655', label: 'marketing-site' }
    ],
    policy: [
      { value: '5540117', label: 'production-policy' },
      { value: '5540118', label: 'staging-policy' },
      { value: '5540119', label: 'api-hardening' },
      { value: '5540120', label: 'checkout-shield' }
    ]
  }
  const createScopes = (): ScopeState[] =>
    scopeTypes.map((scope) => ({
      ...scope,
      placeholder: scope.plural ? `Select ${scope.plural}` : '',
      enabled: scope.type === 'global',
      ids: [],
      query: '',
      options: scopeOptions[scope.type] ?? []
    }))
  const scopes = reactive(createScopes())

  const setScopeEnabled = (scope: ScopeState, enabled: boolean) => {
    if (scope.type === 'global') return
    scope.enabled = enabled
    scope.ids = enabled ? scope.options.map((option) => option.value) : []
    scope.query = ''
    scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
  }
  const scopeMissing = (scope: ScopeState) =>
    scope.enabled && scope.type !== 'global' && scope.ids.length === 0
  const scopeError = (scope: ScopeState) => submitted.value && scopeMissing(scope)
  const scopeDisplay = (scope: ScopeState) => (ids: unknown[]) => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? String(ids[0])
  }
  const visibleScopeOptions = (scope: ScopeState) => {
    const query = scope.query.trim().toLowerCase()
    if (!query) return scope.options
    return scope.options.filter((option) => option.label.toLowerCase().includes(query))
  }
  const scopePayload = (): ScopeRef[] =>
    scopes.flatMap((scope) => {
      if (!scope.enabled) return []
      if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
      return scope.ids.map((id) => ({
        type: scope.type,
        id,
        name: scope.options.find((option) => option.value === id)?.label ?? id
      }))
    })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    entries.value = [createEntry()]
    view.value = 'Form'
    jsonText.value = '{}'
    jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, createScopes())
    submitting.value = false
  })

  const formEl = ref<HTMLFormElement | null>(null)
  const submit = async () => {
    if (submitting.value) return
    if (view.value === 'JSON') {
      if (jsonError.value) return
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (!isValid.value || scopes.some(scopeMissing)) {
      await nextTick()
      formEl.value
        ?.querySelector<HTMLElement>(
          ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
        )
        ?.focus()
      return
    }
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const scope = scopePayload()
    const created = filledEntries.value.map((entry) => ({
      key: entry.key.trim(),
      value: entry.value,
      secret: entry.secret,
      scope
    }))
    onCreated(created)
    submitting.value = false
    drawerOpen.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="drawerOpen"
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Create Variable"
          icon="pi pi-plus"
          kind="primary"
          size="large"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Variable"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Create Variable</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Create one or more variables and define where they are available.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Variable</legend>
              <SettingsSection
                title="Variables"
                hint="Store values your services read at runtime. Add one row per variable, or import a .env file."
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <div class="flex items-center gap-(--spacing-xs) self-end">
                    <Button
                      label="Upload"
                      icon="pi pi-upload"
                      kind="outlined"
                      size="medium"
                      @click="fileInput?.click()"
                    />
                    <input
                      ref="fileInput"
                      type="file"
                      accept=".env,.txt,text/plain"
                      class="sr-only"
                      tabindex="-1"
                      aria-hidden="true"
                      @change="onFilePicked"
                    />
                    <ToggleGroup
                      v-model="view"
                      :options="VIEW_OPTIONS"
                      aria-label="Variables view"
                      size="medium"
                    />
                  </div>

                  <template v-if="view === 'Form'">
                    <AttributeEditor
                      v-model:items="entries"
                      :new-item="createEntry"
                      :min-items="1"
                      :add-disabled="!canAdd"
                      add-button-label="Add variable"
                      remove-button-label="Remove variable"
                      aria-label="Variables"
                    >
                      <template #row="{ index, remove, removable, removeLabel }">
                        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <Field>
                            <InputGroupRoot
                              size="large"
                              :required="keyError(entries[index])?.kind === 'required'"
                              :invalid="keyError(entries[index])?.kind === 'invalid'"
                            >
                              <InputGroupAddon>
                                <span class="inline-block w-20">
                                  <Field.Label :for="fieldId(entries[index], 'key')"
                                    >Key</Field.Label
                                  >
                                </span>
                              </InputGroupAddon>
                              <input
                                :id="fieldId(entries[index], 'key')"
                                :value="entries[index].key"
                                placeholder="MY_VARIABLE"
                                autocomplete="off"
                                spellcheck="false"
                                :aria-invalid="!!keyError(entries[index]) || undefined"
                                :aria-describedby="
                                  keyError(entries[index])
                                    ? messageId(entries[index], 'key')
                                    : undefined
                                "
                                :class="fieldClass"
                                class="text-label-code-sm"
                                @input="
                                  setKey(entries[index], ($event.target as HTMLInputElement).value)
                                "
                                @paste="pasteIntoKey($event, index)"
                              />
                              <Tooltip
                                v-if="removable"
                                text="Remove variable"
                              >
                                <IconButton
                                  icon="pi pi-trash"
                                  kind="outlined"
                                  size="large"
                                  :aria-label="removeLabel"
                                  @click="remove"
                                />
                              </Tooltip>
                            </InputGroupRoot>
                          </Field>

                          <Field>
                            <InputGroupRoot
                              size="large"
                              :required="!!valueError(entries[index])"
                            >
                              <InputGroupAddon>
                                <span class="inline-block w-20">
                                  <Field.Label :for="fieldId(entries[index], 'value')"
                                    >Value</Field.Label
                                  >
                                </span>
                              </InputGroupAddon>
                              <input
                                :id="fieldId(entries[index], 'value')"
                                v-model="entries[index].value"
                                :type="
                                  entries[index].secret && !entries[index].visible
                                    ? 'password'
                                    : 'text'
                                "
                                :placeholder="
                                  entries[index].secret ? SECRET_MASK : 'my-variable-value'
                                "
                                autocomplete="off"
                                spellcheck="false"
                                :aria-invalid="!!valueError(entries[index]) || undefined"
                                :aria-describedby="
                                  valueError(entries[index])
                                    ? messageId(entries[index], 'value')
                                    : undefined
                                "
                                :class="fieldClass"
                                class="text-label-sm"
                              />
                              <Tooltip
                                v-if="entries[index].secret"
                                :text="entries[index].visible ? 'Hide value' : 'Show value'"
                              >
                                <IconButton
                                  :icon="entries[index].visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                  kind="outlined"
                                  size="large"
                                  :aria-label="entries[index].visible ? 'Hide value' : 'Show value'"
                                  :aria-pressed="entries[index].visible"
                                  @click="entries[index].visible = !entries[index].visible"
                                />
                              </Tooltip>
                              <InputGroupAddon>
                                <Tooltip :text="secretTooltip(entries[index])">
                                  <Field orientation="horizontal">
                                    <Field.Label :for="fieldId(entries[index], 'secret')"
                                      >Secret</Field.Label
                                    >
                                    <Checkbox
                                      v-model="entries[index].secret"
                                      binary
                                      :input-id="fieldId(entries[index], 'secret')"
                                      :aria-label="secretAriaLabel(entries[index])"
                                    />
                                  </Field>
                                </Tooltip>
                              </InputGroupAddon>
                            </InputGroupRoot>
                          </Field>
                        </div>

                        <HelperText
                          v-if="keyError(entries[index])"
                          :id="messageId(entries[index], 'key')"
                          :kind="keyError(entries[index])?.kind"
                          :label="keyError(entries[index])?.message"
                        />
                        <HelperText
                          key="helper-text-2"
                          v-if="valueError(entries[index])"
                          :id="messageId(entries[index], 'value')"
                          :kind="valueError(entries[index])?.kind"
                          :label="valueError(entries[index])?.message"
                        />
                      </template>
                      <template #info>
                        <HelperText
                          label="Paste JSON or .env contents into an empty key field to create one row per variable."
                        />
                      </template>
                    </AttributeEditor>
                  </template>

                  <template v-else>
                    <Textarea
                      v-model="jsonText"
                      aria-label="Variables JSON"
                      :invalid="!!jsonError"
                      :aria-describedby="jsonError ? formId + '-json-message' : undefined"
                    />
                    <HelperText>
                      Use a JSON object format, for example:
                      <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
                    </HelperText>
                    <HelperText
                      v-if="jsonError"
                      :id="formId + '-json-message'"
                      kind="invalid"
                      :label="jsonError"
                    />
                  </template>

                  <HelperText :label="SECRET_HINT" />
                  <HelperText
                    v-if="submitted && noVariables"
                    kind="required"
                    label="Add at least one variable."
                  />
                </div>
              </SettingsSection>

              <SettingsSection
                title="Scope"
                hint="Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is created."
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <div
                    v-for="scope in scopes"
                    :key="scope.type"
                    class="flex min-w-0 flex-col gap-(--spacing-xs)"
                  >
                    <InputGroupRoot
                      size="large"
                      :required="scopeError(scope)"
                    >
                      <InputGroupAddon>
                        <span class="w-20">{{ scope.label }}</span>
                      </InputGroupAddon>
                      <span
                        v-if="scope.type === 'global'"
                        class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
                      >
                        The entire account
                      </span>
                      <div
                        v-else
                        class="h-full min-w-0 flex-1"
                      >
                        <MultiSelect
                          v-model="scope.ids"
                          size="large"
                          :placeholder="scope.placeholder"
                          :display-value="scopeDisplay(scope)"
                          :disabled="!scope.enabled"
                          :required="scopeError(scope)"
                        >
                          <MultiSelect.Trigger
                            :aria-label="scope.placeholder"
                            :aria-describedby="
                              scopeError(scope) ? formId + '-scope-' + scope.type : undefined
                            "
                          />
                          <MultiSelect.Content>
                            <template #search>
                              <Input
                                v-model="scope.query"
                                size="small"
                                placeholder="Search"
                                aria-label="Search"
                                @keydown.stop
                              >
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </template>
                            <MultiSelect.Option
                              v-for="option in visibleScopeOptions(scope)"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                      </div>
                      <InputGroupAddon>
                        <Switch
                          :model-value="scope.enabled"
                          :disabled="scope.type === 'global'"
                          :aria-label="'Enable ' + scope.label + ' scope'"
                          @update:model-value="(value) => setScopeEnabled(scope, value)"
                        />
                      </InputGroupAddon>
                    </InputGroupRoot>
                    <HelperText
                      v-if="scopeError(scope)"
                      :id="formId + '-scope-' + scope.type"
                      kind="required"
                      label="Select at least one resource for this scope."
                    />
                  </div>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
              <Button
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
