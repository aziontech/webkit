<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import {
    SECRET_HINT,
    SECRET_MASK,
    VIEW_OPTIONS,
    createScopes,
    parseEnvFile,
    scopeDisplay,
    scopeMissing,
    scopePayload,
    secretAriaLabel,
    secretTooltip,
    setScopeEnabled,
    useVariablesEditor,
    visibleScopeOptions
  } from '../../lib/behavior/variables-editor'
  import { APPLICATIONS } from '../../lib/data/applications'
  import { environmentOptions } from '../../lib/data/environments'
  import { FIREWALLS } from '../../lib/data/firewalls'
  import { WORKLOADS } from '../../lib/data/workloads'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    existingKeys?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    existingKeys: () => []
  })

  const emit = defineEmits<{
    created: [created: unknown[]]
  }>()

  const editor = useVariablesEditor({ existingKeys: () => props.existingKeys })
  const {
    entries,
    view,
    jsonText,
    jsonError,
    submitted,
    noVariables,
    isValid,
    canAdd,
    canRemove,
    keyError,
    valueError
  } = editor

  const formId = useId()
  const fieldId = (entry, part) => `${formId}-${part}-${entry.id}`
  const messageId = (entry, part) => `${fieldId(entry, part)}-message`

  const toOptions = (items) => items.map((item) => ({ value: item.id, label: item.name }))

  const scopeOptions = () => ({
    environment: environmentOptions.value,
    deployment: toOptions(WORKLOADS),
    application: toOptions(APPLICATIONS),
    firewall: toOptions(FIREWALLS)
  })

  const scopes = reactive(createScopes(scopeOptions()))

  const scopeError = (scope) => submitted.value && scopeMissing(scope)
  const scopesValid = computed(() => scopes.every((scope) => !scopeMissing(scope)))

  const submitting = ref(false)

  const fieldClass =
    'h-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-(--text-default) outline-none placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const focusKey = async (entry) => {
    await nextTick()
    document.getElementById(fieldId(entry, 'key'))?.focus()
  }

  const addEntry = () => focusKey(editor.addEntry())

  const onKeyPaste = (event, index) => {
    const count = editor.pasteIntoKey(event, index)
    if (!count) return
    toast.success(
      count === 1 ? 'Read 1 variable from the paste.' : `Read ${count} variables from the paste.`
    )
  }

  const fileInput = ref(null)

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return

    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) {
      toast.error('Unable to parse the selected file as .env format.')
      return
    }

    view.value = 'Form'
    await nextTick()
    editor.applyPairs(parsed)

    if (invalidLines.length) {
      toast.warning(`Some lines were ignored: ${invalidLines.join(', ')}.`)
    }
  }

  watch(open, (isOpen) => {
    if (isOpen) return
    editor.reset()
    Object.assign(scopes, createScopes(scopeOptions()))
    submitting.value = false
  })

  const createdToast = (created) => {
    if (created.length === 1) return 'Variable created.'
    return `${created.length} variables created.`
  }

  const submit = async () => {
    if (submitting.value) return
    if (view.value === 'JSON') {
      if (jsonError.value) return
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (!isValid.value || !scopesValid.value) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const scope = scopePayload(scopes)
      const created = editor.filledEntries.value.map((entry) => ({
        key: entry.key.trim(),
        value: entry.value,
        secret: entry.secret,
        scope
      }))
      emit('created', created)
      toast.success(createdToast(created))
      open.value = false
    } catch (error) {
      toast.error('Could not create the variables.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="medium"
    title="Create Variable"
    description="Create one or more variables and define where they are available."
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Variables"
      hint="Store values your Functions read at runtime. Add one row per variable, or import a .env file."
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
          <SegmentedButton
            v-model="view"
            :options="VIEW_OPTIONS"
            aria-label="Variables view"
            size="medium"
          />
        </div>

        <template v-if="view === 'Form'">
          <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
            <div
              v-for="(entry, index) in entries"
              :key="entry.id"
              class="flex min-w-0 flex-col gap-(--spacing-xs)"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <InputGroupRoot
                  size="large"
                  :required="keyError(entry)?.kind === 'required'"
                  :invalid="keyError(entry)?.kind === 'invalid'"
                >
                  <InputGroupAddon>
                    <label
                      :for="fieldId(entry, 'key')"
                      class="w-20"
                      >Key</label
                    >
                  </InputGroupAddon>
                  <input
                    :id="fieldId(entry, 'key')"
                    :value="entry.key"
                    placeholder="MY_VARIABLE"
                    autocomplete="off"
                    spellcheck="false"
                    :aria-invalid="!!keyError(entry) || undefined"
                    :aria-describedby="keyError(entry) ? messageId(entry, 'key') : undefined"
                    :class="fieldClass"
                    class="text-label-code-sm"
                    @input="editor.setKey(entry, $event.target.value)"
                    @paste="onKeyPaste($event, index)"
                  />
                  <Tooltip
                    v-if="canRemove"
                    text="Remove variable"
                  >
                    <IconButton
                      icon="pi pi-trash"
                      kind="outlined"
                      size="large"
                      aria-label="Remove variable"
                      @click="editor.removeEntry(index)"
                    />
                  </Tooltip>
                </InputGroupRoot>

                <InputGroupRoot
                  size="large"
                  :required="!!valueError(entry)"
                >
                  <InputGroupAddon>
                    <label
                      :for="fieldId(entry, 'value')"
                      class="w-20"
                      >Value</label
                    >
                  </InputGroupAddon>
                  <input
                    :id="fieldId(entry, 'value')"
                    v-model="entry.value"
                    :type="entry.secret && !entry.visible ? 'password' : 'text'"
                    :placeholder="entry.secret ? SECRET_MASK : 'my-variable-value'"
                    autocomplete="off"
                    spellcheck="false"
                    :aria-invalid="!!valueError(entry) || undefined"
                    :aria-describedby="valueError(entry) ? messageId(entry, 'value') : undefined"
                    :class="fieldClass"
                    class="text-label-sm"
                  />
                  <Tooltip
                    v-if="entry.secret"
                    :text="entry.visible ? 'Hide value' : 'Show value'"
                  >
                    <IconButton
                      :icon="entry.visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
                      kind="outlined"
                      size="large"
                      :aria-label="entry.visible ? 'Hide value' : 'Show value'"
                      :aria-pressed="entry.visible"
                      @click="entry.visible = !entry.visible"
                    />
                  </Tooltip>
                  <InputGroupAddon>
                    <Tooltip :text="secretTooltip(entry)">
                      <span class="flex items-center gap-(--spacing-xs)">
                        <label :for="fieldId(entry, 'secret')">Secret</label>
                        <Checkbox
                          v-model="entry.secret"
                          binary
                          :input-id="fieldId(entry, 'secret')"
                          :aria-label="secretAriaLabel(entry)"
                        />
                      </span>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroupRoot>
              </div>

              <HelperText
                v-if="keyError(entry)"
                :id="messageId(entry, 'key')"
                :kind="keyError(entry).kind"
                :label="keyError(entry).message"
              />
              <HelperText
                v-if="valueError(entry)"
                :id="messageId(entry, 'value')"
                :kind="valueError(entry).kind"
                :label="valueError(entry).message"
              />
            </div>
          </div>

          <div>
            <Button
              label="Add variable"
              icon="pi pi-plus"
              kind="outlined"
              size="medium"
              :disabled="!canAdd"
              @click="addEntry"
            />
          </div>

          <HelperText
            label="Paste JSON or .env contents into an empty key field to create one row per variable."
          />
        </template>

        <template v-else>
          <Textarea
            v-model="jsonText"
            aria-label="Variables JSON"
            :invalid="!!jsonError"
            :aria-describedby="jsonError ? `${formId}-json-message` : undefined"
          />
          <HelperText>
            Use a JSON object format, for example:
            <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
          </HelperText>
          <HelperText
            v-if="jsonError"
            :id="`${formId}-json-message`"
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
    </Section>

    <Section
      stacked
      :divided="false"
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
                    scopeError(scope) ? `${formId}-scope-${scope.type}` : undefined
                  "
                />
                <MultiSelect.Content>
                  <template #search>
                    <InputText
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
                    </InputText>
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
                :aria-label="`Enable ${scope.label} scope`"
                @update:model-value="(value) => setScopeEnabled(scopes, scope, value)"
              />
            </InputGroupAddon>
          </InputGroupRoot>
          <HelperText
            v-if="scopeError(scope)"
            :id="`${formId}-scope-${scope.type}`"
            kind="required"
            label="Select at least one resource for this scope."
          />
        </div>
      </div>
    </Section>
  </ResourceDrawer>
</template>
