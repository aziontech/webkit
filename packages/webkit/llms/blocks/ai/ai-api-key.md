# AiApiKey (`ai/ai-api-key`)

> Bring your own key: the reader picks a model provider in a `Select`, pastes a key in a masked `PasswordInput` (never prefilled, cleared once saved) and saves it; a status row shows whether a key is saved (only its masked tail) and the result of Test connection, a failure shows in an `Alert`, and Remove key asks in a `ConfirmDialog`. The block stores nothing: it emits save, test and remove for the app's key store (TanStack AI's `useByok`). Built from `PageHeader`, `Subheader`, `Card`, `Item`, `SettingsRow`, `Select`, `PasswordInput`, `FieldError`, `StatusIndicator`, `Alert`, `Button` and `ConfirmDialog`. A page body for ConsoleLayout.

- Surface: app
- Source: `blocks/ai/ai-api-key/ai-api-key.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-api-key")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfirmDialog](../../components/confirm-dialog.md), `FieldError`, [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [PasswordInput](../../components/password-input.md), [Select](../../components/select.md), [SettingsRow](../../components/settings-row.md), [StatusIndicator](../../components/status-indicator.md), [Subheader](../../components/subheader.md)
- Skills: `webkit-form`, `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-errors`

## Asked as

bring your own key; byok; model provider api key; use my own openai key; test api key; usar minha própria chave de api; chave de api do provedor de ia; usar mi propia clave de api

The place a reader brings their own key: they connect their own model provider account so the AI features of the app run on it. They pick a provider, paste the key once, check that it works, and can remove it later. The key is never shown again after it is saved; only its masked tail says which key is in place. The block stores nothing and calls no provider: it emits `save`, `test` and `remove`, and the app's key store does the work (TanStack AI's `useByok`, or the app's own server). It is a page body for `ConsoleLayout`, rendered in the layout's default slot; the same body fits a settings tab.

## When to use

- Use ai-api-key when the reader can run the app's AI features on their own model provider account (bring your own key).
- One key per provider, picked from a short list of providers the app supports.
- A settings page or tab where the reader saves, tests and removes that key.

## When not to use

- Creating or revoking the app's own access tokens for scripts and tools: use `account/account-personal-tokens`.
- A secret a resource needs at run time (an environment variable): use `edit/edit-variables`.
- Picking the model for one conversation: the `PromptInputModelPicker` in `ai/ai-chat`.
- Settings that are not about a provider key: use `settings/settings-form`.

## Building blocks

### A. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name and one sentence of purpose. Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading.

### B. Key card — `Subheader`, `Card`, `Item`, `SettingsRow`, `Select`, `PasswordInput`, `FieldError`, `StatusIndicator` (required)

A `Subheader` at `size="small"` (an `h2`) over a flush `Card :padded="false"` whose `Item.List` holds three `SettingsRow`s; their controls stack under the copy below the row's `md` container. Provider is a large full-width `Select` of the providers the app supports. API key is a large full-width `PasswordInput` in the code face (`monospace`) with its reveal toggle, `autocomplete="off"` and no placeholder; it starts empty, is never filled from the saved key, and clears once the saved key's masked tail changes (the app confirmed the save). Its row description is the storage note, tied to the field with `aria-describedby`; the field's own `dir="auto"` keeps a pasted key in order in right-to-left. Save key with an empty field emits nothing: the field turns `invalid`, a `FieldError` under it says `Enter an API key.` (tied through `aria-describedby`) and focus moves to the field; typing clears the error. Status is a compact row whose `StatusIndicator` says what is in place for the picked provider (No key saved, Saved, Testing, Connected, Connection failed) next to the masked tail in the code face (in a `bdi` with `dir="ltr"`, so its dots and characters keep their order in right-to-left), inside a `role="status"` region so a test result is announced.

### C. Actions — `Button` (required)

The card footer carries Remove key (outline) at the inline start (`me-auto`), and Test connection (outline) and Save key (primary) at the end, all medium. The footer wraps: in a narrow card Remove key takes its own row and nothing scrolls sideways at 320 px. Save key is never pre-disabled: with an empty field it shows the field error instead of saving. It spins while `loading`, keeping focus; while saving, the Provider Select and the API key field lock, and Test connection and Remove key lock too. Test connection and Remove key show only when a key is saved for the picked provider. While a test runs, Test connection spins and Remove key and the Provider Select lock; Save key stays available for a replacement key.

### D. Failure — `Alert` (Error only)

`error` with `status="error"` is a failed test: a danger `Alert` under the card says `The key didn't work.` with the provider's message and Test again, which emits `test`. `error` with any other status is a failed save: the same `Alert` says `The key wasn't saved.` with the message and no action, since the typed key stays in the field and Save key is the retry.

### E. Remove confirmation — `ConfirmDialog` (required)

Remove key opens a `variant="danger"` `ConfirmDialog` that names the provider and says what stops working; Remove key confirms and emits `remove`, Cancel returns focus to the button. Once the app has removed the key (its entry leaves `savedKeys`), focus moves to the API key field, since Remove key is gone.

## Data

The block takes the providers, the saved keys' masked tails and the request states through props and emits what the reader asked for; it never holds a saved key, stores nothing and calls no provider. `AiApiKeyProvider`, `AiApiKeySavedKey`, `AiApiKeySaveValue`, `AiApiKeyStatus` and `AiApiKeyProps` are exported from `ai-api-key.vue`; `sample.ts` holds the providers and the saved key the page renders when `providers` and `savedKeys` are left out (`props.savedKeys ?? sampleSavedKeys`: `loading` and `error` here are a save or a test, not a load, so they do not empty the list).

| Prop          | Type                 | What it does                                                                                                                                   |
| ------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `providers`   | `AiApiKeyProvider[]` | The providers the reader can bring a key for (`value` is the provider id, `label` its name).                                                   |
| `savedKeys`   | `AiApiKeySavedKey[]` | One entry per provider that has a saved key, with its masked tail; `[]` is the empty state.                                                    |
| `status`      | `AiApiKeyStatus`     | The test of the picked provider's key: `pending` (not tested), `running`, `success` or `error`; reset it to `pending` when `provider` changes. |
| `loading`     | `boolean`            | The save is in flight: the Provider Select, the API key field, Test connection and Remove key lock and Save key spins.                         |
| `error`       | `string`             | Why the test (with `status="error"`) or else the save failed, shown in the danger `Alert`.                                                     |
| `storageNote` | `string`             | Where the key is kept, under the API key field. The default says this browser; change it when the app keeps it.                                |

| Model              | Type     | What it does                                                        |
| ------------------ | -------- | ------------------------------------------------------------------- |
| `v-model:provider` | `string` | The picked provider id; empty picks the first provider in the list. |

| Event    | Payload                      | When                                                           |
| -------- | ---------------------------- | -------------------------------------------------------------- |
| `save`   | `(event, { provider, key })` | Save key with a key typed; the key leaves the block only here. |
| `test`   | `(event, provider)`          | Test connection or Test again.                                 |
| `remove` | `(event, provider)`          | Remove key, after the confirmation.                            |

To go live with TanStack AI, map the `useByok` snapshot to `savedKeys` and call the client from the events:

```vue
<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useByok } from '@tanstack/ai-vue'
  import { defineByok } from '@tanstack/ai-vue/byok'
  import AiApiKey, {
    type AiApiKeyProvider,
    type AiApiKeySavedKey,
    type AiApiKeySaveValue,
    type AiApiKeyStatus
  } from './ai-api-key.vue'

  const byok = defineByok()
  const providers: AiApiKeyProvider[] = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' }
  ]

  await byok.ready()
  const snapshot = useByok(byok)
  const savedKeys = computed<AiApiKeySavedKey[]>(() =>
    Object.entries(snapshot.value.status).flatMap(([provider, key]) =>
      key && key.state !== 'empty' ? [{ provider, masked: key.masked }] : []
    )
  )
  const provider = ref('')
  const status = ref<AiApiKeyStatus>('pending')
  const error = ref('')
  const saving = ref(false)
  watch(provider, () => {
    status.value = 'pending'
    error.value = ''
  })

  const save = async (_event: Event, value: AiApiKeySaveValue) => {
    saving.value = true
    error.value = ''
    try {
      await byok.update(value.provider, value.key)
      status.value = 'pending'
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'The key could not be stored.'
    } finally {
      saving.value = false
    }
  }
  const test = async (_event: MouseEvent, provider: string) => {
    status.value = 'running'
    error.value = ''
    try {
      await byok.unlock()
      await testProviderKey(provider)
      status.value = 'success'
    } catch (reason) {
      status.value = 'error'
      error.value = reason instanceof Error ? reason.message : 'The provider refused the key.'
    }
  }
  const remove = (_event: MouseEvent, provider: string) => byok.clear(provider)
</script>

<template>
  <AiApiKey
    v-model:provider="provider"
    :providers="providers"
    :saved-keys="savedKeys"
    :status="status"
    :loading="saving"
    :error="error"
    @save="save"
    @test="test"
    @remove="remove"
  />
</template>
```

`await byok.ready()` keeps the page from reading No key saved before the stored keys load (wrap the page in `Suspense`, or render it once `ready()` resolves). A key whose status is `error` (its `message`) and `snapshot.storageError` belong in `error`. `testProviderKey` is the app's own call (a cheap request to the provider through the app's server, or a one-token chat), which throws with the provider's message when the key is refused. A `locked` key status (passkey storage not yet unlocked) still has its masked tail: it shows as saved, and `byok.unlock()` runs before the test. Then delete `sample.ts` and its import.

## Do

- Keep the key field empty on every visit; show only the masked tail of a saved key.
- Clear the field once the save succeeds, so the key does not stay in the page.
- Say where the key is kept in the field's description, and make it true for the app.
- Report the test result in the status row and announce it; put the provider's message in the `Alert`.
- Ask before removing a key, and name what stops working.

## Don't

- Don't prefill the key field, put a sample key in a placeholder, or show a key format (`sk-…`).
- Don't store the key, log it or send it anywhere but the app's key store from the `save` handler.
- Don't test a key automatically on every keystroke; the reader runs Test connection.
- Don't render a `Sidebar`, `AppHeader` or `<main>` in the page; `ConsoleLayout` owns them.
- Don't toast a test failure; it stays on the page beside the key it is about.

## Copy

- **Title:** `Model provider keys`; description: `Run the AI features on your own model provider account.`
- **Card heading:** `API key`. **Rows:** `Provider` — `The model provider the key belongs to.`; `API key` — the storage note, by default `Saved in this browser only and sent with your own requests to the provider.`; `Status` — `Whether a key is saved for this provider and if it works.`
- **Status:** `No key saved`, `Saved`, `Testing`, `Connected`, `Connection failed`; the masked tail as given, e.g. `••••3f9a`.
- **Actions:** `Save key`, `Test connection`, `Remove key`; in the `Alert`, `Test again`.
- **Field error:** `Enter an API key.`
- **Failure:** title `The key didn't work.` with the provider's message and the action `Test again` (test); title `The key wasn't saved.` with the message and no action (save).
- **Remove:** title `Remove the <provider> key?`; description `AI features that use <provider> stop working until you save a new key.`; confirm `Remove key`.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`, the card's `Subheader` is an `h2`.
- The `form` is named by the page title; the Select trigger and the key field carry `aria-label`s matching their row titles, and the field's description is tied with `aria-describedby`.
- Focus order: Provider, API key, its reveal toggle, Remove key, Test connection, Save key, then the `Alert`'s Test again.
- An empty Save key sets `aria-invalid` on the field, adds the `FieldError` to its `aria-describedby` and moves focus to it.
- Focus is never lost: Save key keeps focus while it spins; after a save or a confirmed removal, focus moves to the API key field.
- The status row is a `role="status"` region, so test results are announced; the `Alert` is announced when it appears.
- The `ConfirmDialog` traps focus, is named by its title and returns focus to Remove key.

## States

- Saved: the default props; OpenAI has a saved key, not tested: Saved with its masked tail, Test connection and Remove key.
- Empty: `savedKeys` is `[]`; the status reads No key saved and only Save key shows.
- Saving: `loading`; every control but Save key locks and Save key spins. The variant opens on an empty field (the block never seeds the key).
- Testing: `status="running"`; Testing with a spinner, Remove key and the Provider lock, Save key stays available.
- Success: `status="success"`; the status reads Connected.
- Error: `status="error"` with `error`; the status reads Connection failed and the danger `Alert` gives the provider's message with Test again.
- SaveError: `error` with `status="pending"`; the `Alert` says `The key wasn't saved.` with no action; Save key retries.

## Related

- `ai/ai-chat` — the conversation that runs on the reader's key.
- `account/account-personal-tokens` — the app's own tokens for scripts and tools.
- `settings/settings-form` — the settings layout and the per-card save this page follows.
- `skills/webkit-ai-surfaces` — where AI settings sit and what they disclose.

## Variants

- `Saved` — primary (the code below)
- `Empty` — No key saved: only Save key shows.
- `Saving` — The save is in flight: the controls lock and Save key spins, keeping focus.
- `Testing` — Test connection runs: the status reads Testing, Remove key and the Provider lock.
- `Success` — The test passed: the status reads Connected.
- `Error` — The test failed: the status reads Connection failed and an Alert gives the reason with Test again.
- `SaveError` — The save failed: an Alert gives the reason with no action; Save key retries.

Each variant is the same screen in another state: `get_block("ai/ai-api-key", { variant })`, or the file under `blocks/ai/ai-api-key/variants/`.

## Code (`Saved`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import StatusIndicator, { type Severity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  import { sampleProviders, sampleSavedKeys } from './sample'

  /** A model provider the reader can bring a key for. */
  export interface AiApiKeyProvider {
    /** Provider id the app's key store uses, such as openai. */
    value: string
    /** Provider name shown in the list. */
    label: string
  }

  /** A provider that has a saved key. */
  export interface AiApiKeySavedKey {
    /** Provider id of the saved key. */
    provider: string
    /** The masked tail of the key; the key itself never reaches the page. */
    masked: string
  }

  /** The test of the picked provider's key. */
  export type AiApiKeyStatus = 'pending' | 'running' | 'success' | 'error'

  /** What a save sends: the provider and the key the reader typed. */
  export interface AiApiKeySaveValue {
    /** Provider id the key belongs to. */
    provider: string
    /** The key as typed, trimmed. */
    key: string
  }

  export interface AiApiKeyProps {
    /** The providers the reader can bring a key for. Left out, the sample renders. */
    providers?: AiApiKeyProvider[]
    /** One entry per provider with a saved key; an empty list is the empty state. Left out, the sample renders. */
    savedKeys?: AiApiKeySavedKey[]
    /** The test of the picked provider's key; reset it to pending when the provider changes. */
    status?: AiApiKeyStatus
    /** The save is in flight: the controls lock and Save key spins. */
    loading?: boolean
    /** Why the test (with status error) or else the save failed, shown in a danger alert. */
    error?: string
    /** Where the key is kept, shown under the key field. */
    storageNote?: string
  }

  const props = withDefaults(defineProps<AiApiKeyProps>(), {
    providers: undefined,
    savedKeys: undefined,
    status: 'pending',
    loading: false,
    error: '',
    storageNote: 'Saved in this browser only and sent with your own requests to the provider.'
  })

  const emit = defineEmits<{
    save: [event: Event, value: AiApiKeySaveValue]
    test: [event: MouseEvent, provider: string]
    remove: [event: MouseEvent, provider: string]
  }>()

  const provider = defineModel<string>('provider', { default: '' })

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

  const draft = ref('')
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
        title="Model provider keys"
        description="Run the AI features on your own model provider account."
        size="small"
        :title-id="titleId"
      />

      <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
        <Subheader
          title="API key"
          size="small"
        />
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Provider"
                description="The model provider the key belongs to."
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
                variant="compact"
              >
                <div
                  role="status"
                  class="flex flex-wrap items-center justify-end gap-(--spacing-xs)"
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
                label="Save key"
                variant="primary"
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
      :description="`AI features that use ${pickedLabel} stop working until you save a new key.`"
      confirm-label="Remove key"
      @confirm="onConfirmRemove"
    />
  </form>
</template>
```

## `sample.ts`

```ts
import type { AiApiKeyProvider, AiApiKeySavedKey } from './ai-api-key.vue'

export const sampleProviders: AiApiKeyProvider[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'mistral', label: 'Mistral' }
]

export const sampleSavedKeys: AiApiKeySavedKey[] = [{ provider: 'openai', masked: '••••3f9a' }]
```
