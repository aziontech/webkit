<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import FieldError from '@aziontech/ui/field-error'
  import Item from '@aziontech/ui/item'
  import PageHeader from '@aziontech/ui/page-header'
  import PasswordInput from '@aziontech/ui/password-input'
  import Select from '@aziontech/ui/select'
  import SettingsRow from '@aziontech/ui/settings-row'
  import StatusIndicator, { type Severity } from '@aziontech/ui/status-indicator'
  import Subheader from '@aziontech/ui/subheader'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  import { sampleProviders, sampleSavedKeys } from './sample'

  /** An external service or integration the reader can connect with an API key. */
  export interface SettingsApiKeyProvider {
    /** Provider id the app's key store uses, such as github or openai. */
    value: string
    /** Provider name shown in the list. */
    label: string
  }

  /** A provider that has a saved key. */
  export interface SettingsApiKeySavedKey {
    /** Provider id of the saved key. */
    provider: string
    /** The masked tail of the key; the key itself never reaches the page. */
    masked: string
  }

  /** The test of the picked provider's key. */
  export type SettingsApiKeyStatus = 'pending' | 'running' | 'success' | 'error'

  /** What a save sends: the provider and the key the reader typed. */
  export interface SettingsApiKeySaveValue {
    /** Provider id the key belongs to. */
    provider: string
    /** The key as typed, trimmed. */
    key: string
  }

  export interface SettingsApiKeyProps {
    /** Heading shown in the page header. */
    title?: string
    /** One-sentence purpose shown under the page heading. */
    description?: string
    /** The providers or integrations the reader can connect with a key. Left out, the sample renders. */
    providers?: SettingsApiKeyProvider[]
    /** One entry per provider with a saved key; an empty list is the empty state. Left out, the sample renders. */
    savedKeys?: SettingsApiKeySavedKey[]
    /** The test of the picked provider's key; reset it to pending when the provider changes. */
    status?: SettingsApiKeyStatus
    /** The save is in flight: the controls lock and the submit button spins. */
    loading?: boolean
    /** Why the test (with status error) or else the save failed, shown in a danger alert. */
    error?: string
    /** Where the key is kept, shown under the key field. */
    storageNote?: string
  }

  const props = withDefaults(defineProps<SettingsApiKeyProps>(), {
    title: 'Integration keys',
    description: 'Connect external services and integrations with your own API keys.',
    providers: undefined,
    savedKeys: undefined,
    status: 'pending',
    loading: false,
    error: '',
    storageNote:
      'Encrypted and stored for your workspace; sent only with requests to the selected provider.'
  })

  const emit = defineEmits<{
    save: [event: Event, value: SettingsApiKeySaveValue]
    test: [event: MouseEvent, provider: string]
    remove: [event: MouseEvent, provider: string]
  }>()

  const provider = defineModel<string>('provider', { default: '' })
  /** The key the reader is typing; it starts empty and clears once the saved key changes. */
  const draft = defineModel<string>('apiKey', { default: '' })

  const titleId = useId()
  const noteId = useId()
  const errorId = useId()

  const providerList = computed(() => props.providers ?? sampleProviders)
  const savedList = computed(() => props.savedKeys ?? sampleSavedKeys)

  const picked = computed({
    get: () => provider.value || providerList.value[0]?.value || '',
    set: (next: string) => {
      provider.value = next
    }
  })
  const pickedLabel = computed(
    () => providerList.value.find((option) => option.value === picked.value)?.label ?? picked.value
  )
  const labelOf = (value: string) =>
    providerList.value.find((option) => option.value === value)?.label ?? ''
  const saved = computed(() => savedList.value.find((entry) => entry.provider === picked.value))

  const submitted = ref(false)
  const keyInputEl = ref<InstanceType<typeof PasswordInput> | null>(null)
  const removeOpen = ref(false)
  const removing = ref(false)

  const saving = computed(() => props.loading)
  const testing = computed(() => Boolean(saved.value) && props.status === 'running')
  const draftEmpty = computed(() => !draft.value.trim())
  const testFailed = computed(() => props.status === 'error')

  const state = computed<{ severity: Severity; label: string; loading: boolean }>(() => {
    if (!saved.value) return { severity: 'neutral', label: 'No key saved', loading: false }
    if (props.status === 'running') return { severity: 'info', label: 'Testing', loading: true }
    if (props.status === 'success')
      return { severity: 'success', label: 'Connected', loading: false }
    if (props.status === 'error')
      return { severity: 'danger', label: 'Connection failed', loading: false }
    return { severity: 'info', label: 'Saved', loading: false }
  })

  const keyPlaceholder = computed(() => (saved.value ? `Replace ${saved.value.masked}` : ''))
  const replacing = computed(() => Boolean(saved.value))

  const focusKey = () => nextTick(() => keyInputEl.value?.focus())

  watch(
    () => saved.value?.masked,
    (next, before) => {
      if (next && next !== before && draft.value) {
        draft.value = ''
        submitted.value = false
        focusKey()
      }
      if (!next && before && removing.value) {
        removing.value = false
        focusKey()
      }
    }
  )

  watch(draft, () => {
    if (!draftEmpty.value) submitted.value = false
  })

  const onSubmit = (event: Event) => {
    if (saving.value) return
    if (draftEmpty.value) {
      submitted.value = true
      focusKey()
      return
    }
    emit('save', event, { provider: picked.value, key: draft.value.trim() })
  }

  const onTest = (event: MouseEvent) => {
    if (saving.value || testing.value) return
    emit('test', event, picked.value)
  }

  const onConfirmRemove = (event: MouseEvent) => {
    removing.value = true
    removeOpen.value = false
    emit('remove', event, picked.value)
  }
</script>

<template>
  <form
    class="flex flex-1 flex-col"
    :aria-labelledby="titleId"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
      <PageHeader
        :title="title"
        :description="description"
        size="small"
        :title-id="titleId"
      />

      <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
        <Subheader
          title="Connection"
          size="small"
        />
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Provider"
                description="The integration or service the key belongs to."
              >
                <div class="flex w-full items-center justify-end">
                  <Select
                    v-model="picked"
                    size="large"
                    class="w-full"
                    :disabled="saving || testing"
                    :display-value="labelOf"
                  >
                    <Select.Trigger aria-label="Provider" />
                    <Select.Content>
                      <Select.Item
                        v-for="option in providerList"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </SettingsRow>
              <SettingsRow title="API key">
                <template #description>
                  <span :id="noteId">{{ storageNote }}</span>
                </template>
                <div class="flex w-full flex-col gap-(--spacing-xs)">
                  <PasswordInput
                    ref="keyInputEl"
                    v-model="draft"
                    monospace
                    autocomplete="off"
                    aria-label="API key"
                    required
                    :placeholder="keyPlaceholder"
                    :aria-describedby="submitted && draftEmpty ? `${noteId} ${errorId}` : noteId"
                    :invalid="submitted && draftEmpty"
                    :disabled="saving"
                  />
                  <FieldError
                    v-if="submitted && draftEmpty"
                    :id="errorId"
                    >Enter an API key.</FieldError
                  >
                </div>
              </SettingsRow>
              <SettingsRow
                title="Status"
                description="Whether a key is saved for this provider and if it works."
              >
                <div
                  role="status"
                  class="flex w-full flex-wrap items-center gap-(--spacing-xs)"
                >
                  <StatusIndicator
                    :severity="state.severity"
                    :loading="state.loading"
                    :label="state.label"
                  />
                  <bdi
                    v-if="saved"
                    dir="ltr"
                    class="text-label-code-sm text-(--text-muted)"
                    >{{ saved.masked }}</bdi
                  >
                </div>
              </SettingsRow>
            </Item.List>
          </template>
          <template #footer>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <template v-if="saved">
                <Button
                  type="button"
                  class="me-auto"
                  label="Remove key"
                  variant="outline"
                  size="medium"
                  :disabled="saving || testing"
                  @click="removeOpen = true"
                />
                <Button
                  type="button"
                  label="Test connection"
                  variant="outline"
                  size="medium"
                  :loading="testing"
                  :disabled="saving"
                  @click="onTest"
                />
              </template>
              <Button
                type="submit"
                :label="replacing ? 'Replace key' : 'Save key'"
                :variant="replacing && draftEmpty ? 'outline' : 'primary'"
                size="medium"
                :loading="saving"
              />
            </div>
          </template>
        </Card>

        <Alert
          v-if="error"
          severity="danger"
          :title="testFailed ? `The key didn't work.` : `The key wasn't saved.`"
          :action-label="testFailed && saved ? 'Test again' : ''"
          @action="onTest"
        >
          {{ error }}
        </Alert>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="removeOpen"
      variant="danger"
      size="small"
      :title="`Remove the ${pickedLabel} key?`"
      :description="`Features and integrations that use ${pickedLabel} stop working until you save a new key.`"
      confirm-label="Remove key"
      @confirm="onConfirmRemove"
    />
  </form>
</template>
