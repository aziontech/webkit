import type { AiApiKeyProvider, AiApiKeySavedKey } from './ai-api-key.vue'

export const sampleProviders: AiApiKeyProvider[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'mistral', label: 'Mistral' }
]

export const sampleSavedKeys: AiApiKeySavedKey[] = [{ provider: 'openai', masked: '••••3f9a' }]
