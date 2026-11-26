<script setup>
  import Button from '@aziontech/webkit/button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const prompt = ref('')
  const files = ref([])
  const model = ref('gemini-4-neon')
  const mode = ref('medium')
  const favorites = ref(['gemini-4-neon', 'claude-opus-4-5'])
  const speed = ref('standard')
  const ultracode = ref(false)
  const access = ref('full')
  const project = ref('')
  const tools = ref([])
  const last = ref('')
  const voiceActive = ref(false)

  const providers = [
    { value: 'azion', label: 'Azion AI', icon: 'az az-azion' },
    { value: 'google', label: 'Google', icon: 'az az-gemini' },
    { value: 'anthropic', label: 'Anthropic', icon: 'az az-claude' },
    { value: 'openai', label: 'OpenAI', icon: 'az az-openai' },
    { value: 'meta', label: 'Meta', icon: 'az az-meta' }
  ]
  const models = [
    { value: 'gemini-4-neon', label: 'Gemini 4 Neon', provider: 'google', shortcut: '⌘1' },
    { value: 'gemini-4-carbon', label: 'Gemini 4 Carbon', provider: 'google', shortcut: '⌘2' },
    { value: 'gemini-3-8-flash', label: 'Gemini 3.8 Flash', provider: 'google', shortcut: '⌘3' },
    { value: 'claude-opus-4-5', label: 'Claude Opus 4.5', provider: 'anthropic', shortcut: '⌘4' },
    { value: 'claude-sonnet-4', label: 'Claude Sonnet 4', provider: 'anthropic', shortcut: '⌘5' },
    { value: 'gpt-5-2', label: 'GPT-5.2', provider: 'openai', shortcut: '⌘6' },
    { value: 'llama-4-maverick', label: 'Llama 4 Maverick', provider: 'meta', shortcut: '⌘7' },
    {
      value: 'azion-auto',
      label: 'Azion Auto',
      provider: 'azion',
      description: 'AI Gateway router'
    }
  ]
  const modes = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'extra', label: 'Extra' }
  ]
  const speeds = [
    { value: 'standard', label: 'Standard' },
    { value: 'fast', label: 'Fast', icon: 'az az-bolt' }
  ]
  const accessModes = [
    {
      value: 'supervised',
      label: 'Supervised',
      icon: 'az az-lock',
      description: 'Ask before commands and file changes.'
    },
    {
      value: 'edits',
      label: 'Auto-accept edits',
      icon: 'az az-pencil',
      description: 'Auto-approve edits, ask before other actions.'
    },
    {
      value: 'auto',
      label: 'Auto',
      icon: 'az az-shield',
      description: 'Approve routine actions, ask before the rest.'
    },
    {
      value: 'full',
      label: 'Full access',
      icon: 'az az-lock-open',
      description: 'Allow commands and edits without prompts.'
    }
  ]
  const projects = [
    { value: 'acme-store', label: 'acme-store', description: 'Storefront and checkout' },
    { value: 'docs-site', label: 'docs-site', description: 'Product documentation' }
  ]
  const toolOptions = [
    { value: 'search', label: 'Web search', icon: 'az az-globe' },
    { value: 'images', label: 'Create images', icon: 'az az-image' },
    { value: 'research', label: 'Deep research', icon: 'az az-sparkles' }
  ]

  function send(event, { value, files: sent }) {
    last.value = `Submitted: ${value || 'files only'} (${sent.length} file${sent.length === 1 ? '' : 's'})`
    prompt.value = ''
    files.value = []
  }

  const VOICE_CLASS =
    'flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) ' +
    'border border-(--border-input) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-lg)'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <div
      v-if="voiceActive"
      role="region"
      aria-label="Live voice conversation"
      :class="VOICE_CLASS"
    >
      <div class="flex items-center gap-(--spacing-sm)">
        <i
          class="az az-audio-lines shrink-0 text-(--text-default)"
          aria-hidden="true"
        />
        <StatusIndicator
          severity="info"
          label="Listening…"
          loading
        />
      </div>
      <span class="text-body-xs text-(--text-muted)">
        Microphone dictation is disabled while live voice is active.
      </span>
    </div>
    <PromptInput
      v-model="prompt"
      v-model:files="files"
      :max-files="5"
      voice
      :voice-active="voiceActive"
      @submit="send"
      @voice-start="
        () => {
          voiceActive = true
          last = 'Voice conversation started'
        }
      "
      @voice-end="
        () => {
          voiceActive = false
          last = 'Voice conversation ended'
        }
      "
    >
      <template #actions>
        <PromptInput.AttachButton />
      </template>
      <template #end>
        <PromptInput.ModelPicker
          v-model="model"
          v-model:mode="mode"
          v-model:favorite-keys="favorites"
          :providers="providers"
          :models="models"
          :modes="modes"
          mode-label="Thinking Level"
        >
          <template #footer>
            <ToggleGroup
              v-model="speed"
              :options="speeds"
              size="small"
              aria-label="Response speed"
            />
            <Button
              label="Ultracode"
              icon="az az-sparkles"
              :variant="ultracode ? 'secondary' : 'ghost'"
              size="small"
              :aria-pressed="ultracode"
              @click="ultracode = !ultracode"
            />
            <PromptInput.AccessPicker
              v-model="access"
              :options="accessModes"
            />
          </template>
        </PromptInput.ModelPicker>
        <PromptInput.DictateButton />
      </template>
      <template #footer>
        <PromptInput.ContextPicker
          v-model="project"
          :options="projects"
          placeholder="Choose project"
        />
        <Button
          label="Files"
          icon="az az-folder-open"
          variant="ghost"
          size="small"
        />
        <PromptInput.Tools
          v-model="tools"
          :tools="toolOptions"
          label="Plugins"
        />
        <Button
          label="Open desktop app"
          icon="az az-desktop"
          variant="ghost"
          size="small"
          href="https://example.com/download"
        />
      </template>
      <template #hint>The AI assistant can make mistakes. Check important information.</template>
    </PromptInput>
    <p
      v-if="last"
      class="text-body-sm text-(--text-muted)"
    >
      {{ last }}
    </p>
  </div>
</template>
