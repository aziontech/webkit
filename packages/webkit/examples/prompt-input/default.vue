<script setup>
  import Button from '@aziontech/webkit/button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const prompt = ref('')
  const files = ref([])
  const model = ref('sol')
  const mode = ref('medium')
  const project = ref('')
  const tools = ref([])
  const last = ref('')
  const voiceActive = ref(false)
  const muted = ref(false)

  const models = [
    { value: 'sol', label: 'Sol 6.1', description: 'Best for everyday tasks' },
    { value: 'terra', label: 'Terra 6.1', description: 'Fastest answers' },
    { value: 'luna', label: 'Luna 6.1', description: 'Deep reasoning on hard problems' }
  ]
  const modes = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
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
          class="az az-wave-pulse shrink-0 text-(--text-default)"
          aria-hidden="true"
        />
        <StatusIndicator
          :severity="muted ? 'neutral' : 'info'"
          :label="muted ? 'Microphone muted' : 'Listening…'"
          :loading="!muted"
        />
      </div>
      <div class="flex items-center gap-(--spacing-xs)">
        <Button
          :label="muted ? 'Unmute' : 'Mute'"
          :icon="muted ? 'az az-volume-off' : 'az az-microphone'"
          variant="ghost"
          size="small"
          @click="muted = !muted"
        />
        <Button
          label="End voice"
          icon="az az-x"
          variant="secondary"
          size="small"
          @click="
            () => {
              voiceActive = false
              muted = false
              last = 'Voice conversation ended'
            }
          "
        />
      </div>
    </div>
    <PromptInput
      v-else
      v-model="prompt"
      v-model:files="files"
      :max-files="5"
      voice
      @submit="send"
      @voice-start="
        () => {
          voiceActive = true
          last = 'Voice conversation started'
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
          :models="models"
          :modes="modes"
          mode-label="Effort"
        />
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
