# Settings API key

The place a reader connects an external service or platform integration with an API key — such as GitHub, an AI model provider (bring your own key), an observability tool, or any future third-party integration. They pick a provider, paste the key once, check that it works, and can replace or remove it later. The key is never shown again after it is saved; only its masked tail says which key is in place. The block stores nothing and calls no provider: it emits `save`, `test` and `remove`, and the app's key store does the work (a backend integration store, or TanStack AI's `useByok` for browser-held model keys). It is a page body for `ConsoleLayout`, rendered in the layout's default slot; the same body fits a settings tab.

## When to use

- Any part of the platform that connects to an external service with a user-supplied API key or token: GitHub integration, AI model providers (BYOK), observability or alerting providers (Datadog, Slack), deployment services, or future third-party integrations.
- One key per provider, picked from a short list of supported integrations (or a single-item list for a dedicated integration settings page).
- A settings page or tab where the reader saves, replaces, tests and removes that key.

## When not to use

- Creating or revoking the platform's own access tokens for scripts and tools: use `account/account-personal-tokens`.
- A secret a resource needs at run time (an environment variable): use `edit/edit-variables`.
- Picking the model for one AI conversation: use the model picker in `ai/ai-chat`.
- General settings that are not about external provider keys: use `settings/settings-form`.

## Building blocks

### A. Page heading — `PageHeader` (required)

A `PageHeader` at `size="small"` opens the form column (`layout-column-form`) with the page name (`title`) and one sentence of purpose (`description`). Its `title-id` names the `form` through `aria-labelledby`. No actions in the heading.

### B. Key card — `Subheader`, `Card`, `Item`, `SettingsRow`, `Select`, `PasswordInput`, `FieldError`, `StatusIndicator` (required)

A `Subheader` at `size="small"` (an `h2`) over a flush `Card :padded="false"` whose `Item.List` holds three `SettingsRow`s; their controls stack under the copy below the row's `md` container. Provider is a large full-width `Select` of the integrations or services the app supports. API key is a large full-width `PasswordInput` in the code face (`monospace`) with its reveal toggle and `autocomplete="off"`; it has no placeholder until a key is saved, then `Replace ••••3f9a` (the saved tail first, so it shows on a phone too), so the empty field reads as kept, not missing; it starts empty, is never filled from the saved key, and clears once the saved key's masked tail changes (the app confirmed the save). Its row description is the storage note, tied to the field with `aria-describedby`; the field's own `dir="auto"` keeps a pasted key in order in right-to-left. Submitting an empty field emits nothing: the field turns `invalid`, a `FieldError` under it says `Enter an API key.` (tied through `aria-describedby`) and focus moves to the field; typing clears the error. Status is a row whose `StatusIndicator`, starting on the controls' column, says what is in place for the picked provider (No key saved, Saved, Testing, Connected, Connection failed) next to the masked tail in the code face (in a `bdi` with `dir="ltr"`, so its dots and characters keep their order in right-to-left), inside a `role="status"` region so a test result is announced.

### C. Actions — `Button` (required)

The card footer carries Remove key (outline) at the inline start (`me-auto`), and Test connection (outline) and Save key (primary) at the end, all medium. Once a key is saved for the picked provider the submit reads `Replace key` and is outline while the field is empty, turning primary when a new key is typed, so a saved screen never looks unsaved and a replacement is named before it happens. The footer wraps: in a narrow card Remove key takes its own row and nothing scrolls sideways at 320 px. Save key is never pre-disabled: with an empty field it shows the field error instead of saving. It spins while `loading`, keeping focus; while saving, the Provider Select and the API key field lock, and Test connection and Remove key lock too. Test connection and Remove key show only when a key is saved for the picked provider. While a test runs, Test connection spins and Remove key and the Provider Select lock; Replace key stays available for a replacement key.

### D. Failure — `Alert` (Error only)

`error` with `status="error"` is a failed test: a danger `Alert` under the card says `The key didn't work.` with the provider's message and Test again, which emits `test`. `error` with any other status is a failed save: the same `Alert` says `The key wasn't saved.` with the message and no action, since the typed key stays in the field and Save key or Replace key is the retry.

### E. Remove confirmation — `ConfirmDialog` (required)

Remove key opens a `variant="danger"` `ConfirmDialog` that names the provider and says what stops working; Remove key confirms and emits `remove`, Cancel returns focus to the button. Once the app has removed the key (its entry leaves `savedKeys`), focus moves to the API key field, since Remove key is gone.

## Data

The block takes the providers, the saved keys' masked tails and the request states through props and emits what the reader asked for; it never holds a saved key, stores nothing and calls no provider. `SettingsApiKeyProvider`, `SettingsApiKeySavedKey`, `SettingsApiKeySaveValue`, `SettingsApiKeyStatus` and `SettingsApiKeyProps` are exported from `settings-api-key.vue`; `sample.ts` holds the providers and the saved key the page renders when `providers` and `savedKeys` are left out (`props.savedKeys ?? sampleSavedKeys`: `loading` and `error` here are a save or a test, not a load, so they do not empty the list).

| Prop          | Type                       | What it does                                                                                                                                   |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                   | Heading shown in the page header. Defaults to `Integration keys`.                                                                              |
| `description` | `string`                   | One-sentence purpose under the heading. Override per surface (for example, GitHub integration or AI model providers).                          |
| `providers`   | `SettingsApiKeyProvider[]` | The integrations or services the reader can connect with a key (`value` is the provider id, `label` its name).                                 |
| `savedKeys`   | `SettingsApiKeySavedKey[]` | One entry per provider that has a saved key, with its masked tail; `[]` is the empty state.                                                    |
| `status`      | `SettingsApiKeyStatus`     | The test of the picked provider's key: `pending` (not tested), `running`, `success` or `error`; reset it to `pending` when `provider` changes. |
| `loading`     | `boolean`                  | The save is in flight: the Provider Select, the API key field, Test connection and Remove key lock and the submit button spins.                |
| `error`       | `string`                   | Why the test (with `status="error"`) or else the save failed, shown in the danger `Alert`.                                                     |
| `storageNote` | `string`                   | Where the key is kept, under the API key field. Match it to the app's actual storage (server-side encrypted store or browser-only storage).    |

| Model              | Type     | What it does                                                                                                          |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `v-model:provider` | `string` | The picked provider id; empty picks the first provider in the list.                                                   |
| `v-model:apiKey`   | `string` | The key the reader is typing; starts empty, never the saved key, and clears once the saved key's masked tail changes. |

| Event    | Payload                      | When                                                                     |
| -------- | ---------------------------- | ------------------------------------------------------------------------ |
| `save`   | `(event, { provider, key })` | Save key or Replace key with a key typed; the key leaves the block here. |
| `test`   | `(event, provider)`          | Test connection or Test again.                                           |
| `remove` | `(event, provider)`          | Remove key, after the confirmation.                                      |

To go live with a platform integration store (such as GitHub, observability tools, or AI providers stored on your server), bind `providers`, `savedKeys` and the handlers to your API:

```vue
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import SettingsApiKey, {
    type SettingsApiKeyProvider,
    type SettingsApiKeySavedKey,
    type SettingsApiKeySaveValue,
    type SettingsApiKeyStatus
  } from './settings-api-key.vue'

  const providers: SettingsApiKeyProvider[] = [
    { value: 'github', label: 'GitHub' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'datadog', label: 'Datadog' }
  ]

  const provider = ref('')
  const savedKeys = ref<SettingsApiKeySavedKey[]>(await loadIntegrationKeys())
  const status = ref<SettingsApiKeyStatus>('pending')
  const error = ref('')
  const saving = ref(false)

  watch(provider, () => {
    status.value = 'pending'
    error.value = ''
  })

  const save = async (_event: Event, value: SettingsApiKeySaveValue) => {
    saving.value = true
    error.value = ''
    try {
      const saved = await saveIntegrationKey(value.provider, value.key)
      savedKeys.value = [
        ...savedKeys.value.filter((entry) => entry.provider !== value.provider),
        { provider: value.provider, masked: saved.masked }
      ]
      status.value = 'pending'
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'The key could not be stored.'
    } finally {
      saving.value = false
    }
  }

  const test = async (_event: MouseEvent, id: string) => {
    status.value = 'running'
    error.value = ''
    try {
      await testIntegrationKey(id)
      status.value = 'success'
    } catch (reason) {
      status.value = 'error'
      error.value = reason instanceof Error ? reason.message : 'The provider refused the key.'
    }
  }

  const remove = async (_event: MouseEvent, id: string) => {
    await deleteIntegrationKey(id)
    savedKeys.value = savedKeys.value.filter((entry) => entry.provider !== id)
    status.value = 'pending'
  }
</script>

<template>
  <SettingsApiKey
    v-model:provider="provider"
    title="Integration keys"
    description="Connect GitHub, AI providers and other external services with your own keys."
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

For browser-only AI bring-your-own-key (BYOK) with TanStack AI, wire the same events to `defineByok()` / `useByok(byok)` (`byok.update`, `byok.unlock`, `byok.clear`), await `byok.ready()` before rendering so the page does not flash `No key saved`, pass `title="Model provider keys"`, and set `storage-note="Saved in this browser only and sent with your own requests to the provider."`. For a single-integration screen such as GitHub settings, pass a one-item `providers` array (`[{ value: 'github', label: 'GitHub' }]`) and a tailored `title` and `description`. Then delete `sample.ts` and its import.

## Do

- Keep the key field empty on every visit; show only the masked tail of a saved key.
- Clear the field once the save succeeds, so the key does not stay in the page.
- Say where the key is kept in `storageNote`, and make it true for the app (workspace server vs browser).
- Report the test result in the status row and announce it; put the provider's message in the `Alert`.
- Ask before removing a key, and name what stops working.

## Don't

- Don't prefill the key field, put a sample key in a placeholder, or show a key format (`ghp_…`, `sk-…`).
- Don't store the key, log it or send it anywhere but the app's key store from the `save` handler.
- Don't test a key automatically on every keystroke; the reader runs Test connection.
- Don't render a `Sidebar`, `AppHeader` or `<main>` in the page; `ConsoleLayout` owns them.
- Don't toast a test failure; it stays on the page beside the key it is about.

## Copy

- **Title:** `Integration keys`; description: `Connect external services and integrations with your own API keys.` (Override per integration or surface.)
- **Card heading:** `Connection`. **Rows:** `Provider` — `The integration or service the key belongs to.`; `API key` — the storage note, by default `Encrypted and stored for your workspace; sent only with requests to the selected provider.`; `Status` — `Whether a key is saved for this provider and if it works.`
- **Status:** `No key saved`, `Saved`, `Testing`, `Connected`, `Connection failed`; the masked tail as given, e.g. `••••3f9a`.
- **Actions:** `Save key` (`Replace key` once a key is saved), `Test connection`, `Remove key`; in the `Alert`, `Test again`.
- **Field error:** `Enter an API key.`
- **Failure:** title `The key didn't work.` with the provider's message and the action `Test again` (test); title `The key wasn't saved.` with the message and no action (save).
- **Remove:** title `Remove the <provider> key?`; description `Features and integrations that use <provider> stop working until you save a new key.`; confirm `Remove key`.
- Follow `skills/azion-ui-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`, the card's `Subheader` is an `h2`.
- The `form` is named by the page title; the Select trigger and the key field carry `aria-label`s matching their row titles, and the field's description is tied with `aria-describedby`.
- Focus order: Provider, API key, its reveal toggle, Remove key, Test connection, Save key / Replace key, then the `Alert`'s Test again.
- An empty submit sets `aria-invalid` on the field, adds the `FieldError` to its `aria-describedby` and moves focus to it.
- Focus is never lost: Save key / Replace key keeps focus while it spins; after a save or a confirmed removal, focus moves to the API key field.
- The status row is a `role="status"` region, so test results are announced; the `Alert` is announced when it appears.
- The `ConfirmDialog` traps focus, is named by its title and returns focus to Remove key.

## States

- Saved: the default props; GitHub has a saved key, not tested: Saved with its masked tail, Test connection, Remove key and Replace key.
- Empty: `savedKeys` is `[]`; the status reads No key saved and only Save key shows.
- Saving: `loading` with a typed replacement key (`v-model:apiKey`), the only way a save starts; every control but Replace key locks and Replace key spins.
- Testing: `status="running"`; Testing with a spinner, Remove key and the Provider lock, Replace key stays available.
- Success: `status="success"`; the status reads Connected.
- Error: `status="error"` with `error`; the status reads Connection failed and the danger `Alert` gives the provider's message with Test again.
- SaveError: `error` with `status="pending"` and the typed key still in the field (`v-model:apiKey`); the `Alert` says `The key wasn't saved.` with no action; Replace key retries.

## Related

- `settings/settings-form` — the settings layout and the per-card save this page follows.
- `account/account-personal-tokens` — the platform's own access tokens for scripts and tools.
- `edit/edit-variables` — runtime secrets and environment variables attached to a resource.
- `ai/ai-chat` — an AI surface that can run on a model provider key saved through this block.
- `skills/azion-ui-ai-surfaces` — where AI settings sit and what they disclose when used for BYOK.
