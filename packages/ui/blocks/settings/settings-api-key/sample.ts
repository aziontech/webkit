import type { SettingsApiKeyProvider, SettingsApiKeySavedKey } from './settings-api-key.vue'

export const sampleProviders: SettingsApiKeyProvider[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'datadog', label: 'Datadog' }
]

export const sampleSavedKeys: SettingsApiKeySavedKey[] = [
  { provider: 'github', masked: '••••3f9a' }
]
