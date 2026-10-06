<script setup lang="ts">
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed } from 'vue'

  import MonacoEditor from '../monaco-editor/monaco-editor.vue'
  import FunctionArgsForm from './FunctionArgsForm.vue'

  const code = defineModel('code', { type: String, default: '' })
  const args = defineModel('args', { type: String, default: '' })
  const form = defineModel('form', { type: String, default: '' })
  const document = defineModel('document', { type: String, default: 'code' })

  interface Props {
    language?: string
    runtimeLabel?: string
    fileName?: string
    codeError?: string
    argsError?: string
    disabled?: boolean
    testId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    language: 'javascript',
    runtimeLabel: 'JavaScript',
    fileName: 'function',
    codeError: '',
    argsError: '',
    disabled: false,
    testId: 'function-editor'
  })

  const emit = defineEmits<{
    'update:codeError': []
    'update:argsError': []
  }>()

  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]

  const codePath = computed(
    () => `${props.fileName || 'function'}.${props.language === 'lua' ? 'lua' : 'js'}`
  )
  const hint = computed(() =>
    document.value === 'code'
      ? `${props.runtimeLabel}, running on request`
      : 'The fields an instance is asked for, and their defaults.'
  )
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div
      class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <SegmentedButton
        v-model="document"
        :options="documents"
        aria-label="Editor document"
      />
      <p class="min-w-0 truncate text-body-xs text-(--text-muted)">{{ hint }}</p>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <div
        v-show="document === 'code'"
        class="flex min-h-0 flex-1 flex-col"
      >
        <MonacoEditor
          v-model="code"
          fill
          flush
          pad-line-numbers
          size="small"
          :language="language"
          :path="codePath"
          :invalid="!!codeError"
          :helper-text="codeError"
          :disabled="disabled"
          aria-label="Function code"
          :data-testid="`${testId}-code`"
          @update:model-value="emit('update:codeError', '')"
        />
      </div>

      <div
        v-show="document === 'arguments'"
        class="flex min-h-0 flex-1 flex-col"
      >
        <FunctionArgsForm
          v-model:schema="form"
          v-model:args="args"
          :disabled="disabled"
          :test-id="`${testId}-form`"
          @update:args="emit('update:argsError', '')"
        />
      </div>
    </div>
  </div>
</template>
