<script setup>
  import Button from '@aziontech/webkit/button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref('')
  const files = ref([])
  const model = ref('sol')
  const mode = ref('medium')
  const project = ref('')
  const tools = ref([])
  const last = ref('')

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
    { value: 'search', label: 'Web search', icon: 'ai ai-globe' },
    { value: 'images', label: 'Create images', icon: 'ai ai-image' },
    { value: 'research', label: 'Deep research', icon: 'ai ai-sparkles' }
  ]

  function send(event, { value, files: sent }) {
    last.value = `Submitted: ${value || 'files only'} (${sent.length} file${sent.length === 1 ? '' : 's'})`
    prompt.value = ''
    files.value = []
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <PromptInput
      v-model="prompt"
      v-model:files="files"
      :max-files="5"
      voice
      @submit="send"
      @voice-start="last = 'Voice conversation started'"
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
          icon="ai ai-folder-open"
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
          icon="ai ai-desktop"
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
