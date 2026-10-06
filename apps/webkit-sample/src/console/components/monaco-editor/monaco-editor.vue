<script setup lang="ts">
  import './monaco-setup'

  import HelperText from '@aziontech/webkit/helper-text'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
  import { useTheme } from '@shared/lib/theme.js'
  import type * as Monaco from 'monaco-editor'
  import { computed, onBeforeUnmount, shallowRef, useAttrs, useId, watch } from 'vue'

  import {
    applyAzionMonacoTheme,
    monacoFontFamily,
    monacoFontSize,
    monacoSpacing
  } from './azion-monaco-theme'

  defineOptions({ name: 'MonacoEditor', inheritAttrs: false })

  type MonacoEditorLanguage =
    'javascript' | 'typescript' | 'lua' | 'json' | 'css' | 'html' | 'markdown' | 'plaintext'

  interface Props {
    label?: string
    language?: MonacoEditorLanguage
    path?: string
    jsonSchema?: object
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
    invalid?: boolean
    helperText?: string
    gutter?: boolean
    padLineNumbers?: boolean
    size?: 'small' | 'medium' | 'large'
    minimap?: boolean
    ariaLabel?: string
    height?: string
    fill?: boolean
    flush?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    language: 'javascript',
    path: '',
    jsonSchema: undefined,
    disabled: false,
    readonly: false,
    loading: false,
    invalid: false,
    helperText: '',
    gutter: true,
    padLineNumbers: false,
    size: 'medium',
    minimap: false,
    ariaLabel: '',
    height: '16rem',
    fill: false,
    flush: false
  })

  const emit = defineEmits<{
    validate: [markers: Monaco.editor.IMarker[]]
  }>()

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const labelId = useId()
  const helperId = useId()
  const { resolvedTheme } = useTheme()

  const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monaco = shallowRef<typeof Monaco | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'monaco-editor')

  const effectiveHelperText = computed(() => {
    if (props.helperText) return props.helperText
    if (props.disabled) return 'This editor is locked.'
    return ''
  })

  const helperKind = computed(() => {
    if (props.disabled) return 'disabled' as const
    if (props.invalid) return 'invalid' as const
    return 'helper' as const
  })

  const accessibleName = computed(() => props.ariaLabel || props.label || 'Code editor')

  const options = computed<Monaco.editor.IStandaloneEditorConstructionOptions>(() => ({
    readOnly: props.readonly || props.disabled,
    domReadOnly: props.readonly || props.disabled,
    lineNumbers: lineNumberRenderer(),
    minimap: { enabled: props.minimap },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontFamily: monacoFontFamily(),
    fontSize: monacoFontSize(props.size),
    fontLigatures: false,
    padding: { top: monacoSpacing('--spacing-xs'), bottom: monacoSpacing('--spacing-xs') },
    renderLineHighlight: 'all',
    smoothScrolling: false,
    ariaLabel: accessibleName.value,
    tabIndex: props.disabled ? -1 : 0
  }))

  function lineNumberRenderer(): Monaco.editor.IEditorOptions['lineNumbers'] {
    if (!props.gutter) return 'off'
    if (!props.padLineNumbers) return 'on'
    return (line: number) => String(line).padStart(2, '0')
  }

  function syncJsonSchema() {
    const api = monaco.value
    const uri = editor.value?.getModel()?.uri.toString()
    if (!api || !uri || props.language !== 'json' || !props.jsonSchema) return

    const json = api.json.jsonDefaults
    const schemaUri = `azion://schemas/${encodeURIComponent(uri)}`
    const others = (json.diagnosticsOptions.schemas ?? []).filter(
      (entry) => entry.uri !== schemaUri
    )

    json.setDiagnosticsOptions({
      ...json.diagnosticsOptions,
      validate: true,
      schemaValidation: 'warning',
      enableSchemaRequest: false,
      schemas: [...others, { uri: schemaUri, fileMatch: [uri], schema: props.jsonSchema }]
    })
  }

  function syncTheme() {
    if (!monaco.value) return
    applyAzionMonacoTheme(monaco.value, resolvedTheme.value === 'dark' ? 'vs-dark' : 'vs')
  }

  function onMount(instance: Monaco.editor.IStandaloneCodeEditor, api: typeof Monaco) {
    editor.value = instance
    monaco.value = api
    syncTheme()
    syncJsonSchema()

    instance.trigger('monaco-editor.vue', 'editor.action.toggleTabFocusMode', null)
  }

  function onValidate(markers: Monaco.editor.IMarker[]) {
    emit('validate', markers)
  }

  watch(resolvedTheme, syncTheme)
  watch([() => props.jsonSchema, () => props.path], syncJsonSchema)

  onBeforeUnmount(() => {
    editor.value = null
    monaco.value = null
  })

  defineExpose({
    focus: () => editor.value?.focus(),
    format: () => editor.value?.getAction('editor.action.formatDocument')?.run()
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-loading="loading || null"
    :data-invalid="invalid || null"
    :data-fill="fill || null"
    :data-flush="flush || null"
    class="flex w-full flex-col gap-(--spacing-xs) data-fill:min-h-0 data-fill:flex-1 data-flush:gap-0"
  >
    <span
      v-if="label"
      :id="labelId"
      class="inline-flex items-center text-label-sm text-(--text-default)"
      :data-testid="`${testId}__label`"
      >{{ label }}</span
    >

    <div
      v-if="loading"
      :data-fill="fill || null"
      class="data-fill:min-h-0 data-fill:flex-1"
    >
      <Skeleton
        kind="shape"
        width="100%"
        :height="fill ? '100%' : height"
        :data-testid="`${testId}__skeleton`"
      />
    </div>

    <div
      v-else
      :style="fill ? undefined : { '--monaco-editor-height': height }"
      :data-fill="fill || null"
      :data-flush="flush || null"
      :data-invalid="invalid || null"
      :data-disabled="disabled || null"
      :data-testid="`${testId}__host`"
      class="min-w-0 h-(--monaco-editor-height) data-fill:h-auto data-fill:min-h-0 data-fill:flex-1 overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) transition-colors duration-150 ease-out motion-reduce:transition-none focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas) data-invalid:border-(--danger-border) data-disabled:cursor-not-allowed data-disabled:bg-(--bg-disabled) data-flush:rounded-none data-flush:border-0 data-flush:bg-transparent data-flush:ring-offset-0 data-flush:focus-within:ring-0"
    >
      <VueMonacoEditor
        v-model:value="model"
        :language="language"
        :path="path || undefined"
        :options="options"
        width="100%"
        height="100%"
        @mount="onMount"
        @validate="onValidate"
      >
        <template #default>
          <Skeleton
            kind="shape"
            width="100%"
            height="100%"
            :data-testid="`${testId}__boot-skeleton`"
          />
        </template>

        <template #failure>
          <Message
            severity="error"
            title="The editor failed to load."
            description="Reload the page to try again."
            :data-testid="`${testId}__failure`"
          />
        </template>
      </VueMonacoEditor>
    </div>

    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :label="effectiveHelperText"
      :kind="helperKind"
      :data-flush="flush || null"
      :data-testid="`${testId}__helper`"
      class="data-flush:px-(--spacing-sm) data-flush:py-(--spacing-xs)"
    />
  </div>
</template>
