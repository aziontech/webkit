<script setup lang="ts">
  // 1. imports
  // Side-effect module: points the loader at the locally installed Monaco and wires the
  // language workers. Imported here so it travels with the component, never the entry.
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

  // 2. defineOptions
  defineOptions({ name: 'MonacoEditor', inheritAttrs: false })

  // 3. types
  /** Grammar used for syntax highlighting and language services. */
  type MonacoEditorLanguage =
    | 'javascript'
    | 'typescript'
    // The endpoint's other function runtime (`azion_lua`). Monaco ships the Monarch
    // grammar; there is no language server for it, so it highlights and does not lint.
    | 'lua'
    | 'json'
    | 'css'
    | 'html'
    | 'markdown'
    | 'plaintext'

  interface Props {
    /** Visible field label. When empty, the label row is omitted. */
    label?: string
    /** Grammar used for syntax highlighting and language services. */
    language?: MonacoEditorLanguage
    /** Model path. Monaco keys its per-file model and view state off this. */
    path?: string
    /** Blocks editing and applies disabled tokens. */
    disabled?: boolean
    /** Content stays visible and selectable, but is not editable. */
    readonly?: boolean
    /** Swaps the editor for a Skeleton while the document is being fetched. */
    loading?: boolean
    /** Applies the invalid border and switches the helper to `kind="invalid"`. */
    invalid?: boolean
    /** Auxiliary text below the editor; carries the message when `invalid`. */
    helperText?: string
    /** Renders the line-number gutter. */
    gutter?: boolean
    /** Pads line numbers to two digits (`01`), as the code-block spec renders them. */
    padLineNumbers?: boolean
    /** Code type scale: `--text-label-code-sm | md | lg`. */
    size?: 'small' | 'medium' | 'large'
    /** Renders the minimap on the right edge. */
    minimap?: boolean
    /** Accessible name. Falls back to `label`, then to a generic name. */
    ariaLabel?: string
    /** Editor height. Any CSS length; the editor scrolls internally beyond it. */
    height?: string
    /** Grow to fill a flex parent instead of using `height`. For full-bleed layouts. */
    fill?: boolean
    /**
     * Drops the FIELD CHROME: no border, no radius, no ring offset. For a layout where
     * the editor is not a control on a page but the surface itself, and the region
     * around it already draws the edges (the Functions Code tab). A rounded, bordered
     * box floating inside a panel reads as an input the reader is expected to fill in,
     * and it puts a second frame a few pixels inside the panel's own.
     */
    flush?: boolean
  }

  // 4. props
  const props = withDefaults(defineProps<Props>(), {
    label: '',
    language: 'javascript',
    path: '',
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

  // 5. emits
  const emit = defineEmits<{
    /** Monaco reported diagnostics for the current model. */
    validate: [markers: Monaco.editor.IMarker[]]
  }>()

  // 6. models
  const model = defineModel<string>({ default: '' })

  // 8. inject / composables
  const attrs = useAttrs()
  const labelId = useId()
  const helperId = useId()
  // The RESOLVED theme, not the mode: under `system` the mode ref never changes when
  // the OS preference flips, and Monaco would keep painting the old palette.
  const { resolvedTheme } = useTheme()

  // 9. local state — shallowRef: the editor and the Monaco namespace are large
  // non-reactive objects, deep tracking them would be wasted work.
  const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monaco = shallowRef<typeof Monaco | null>(null)

  // 10. computed
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
    // Without this the hidden textarea still takes edits from assistive tech.
    domReadOnly: props.readonly || props.disabled,
    lineNumbers: lineNumberRenderer(),
    minimap: { enabled: props.minimap },
    // Monaco renders into an absolutely positioned canvas: it cannot infer a resize from
    // a flex parent, so it must measure on its own.
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontFamily: monacoFontFamily(),
    fontSize: monacoFontSize(props.size),
    fontLigatures: false,
    padding: { top: monacoSpacing('--spacing-xs'), bottom: monacoSpacing('--spacing-xs') },
    renderLineHighlight: 'all',
    smoothScrolling: false,
    // Monaco's editable surface is an off-screen textarea it owns; the only way to name
    // it is this option, so the visible label's text is mirrored into it.
    ariaLabel: accessibleName.value,
    tabIndex: props.disabled ? -1 : 0
  }))

  // 12. functions
  /**
   * Monaco takes either the `'on' | 'off'` keyword or a formatter; the padded form is a
   * formatter, so both cases resolve here.
   */
  function lineNumberRenderer(): Monaco.editor.IEditorOptions['lineNumbers'] {
    if (!props.gutter) return 'off'
    if (!props.padLineNumbers) return 'on'
    return (line: number) => String(line).padStart(2, '0')
  }

  /**
   * Monaco keeps `data-theme` out of its world — it paints from a JS theme object, so the
   * tokens have to be re-read and the theme redefined on every mode change.
   */
  function syncTheme() {
    if (!monaco.value) return
    applyAzionMonacoTheme(monaco.value, resolvedTheme.value === 'dark' ? 'vs-dark' : 'vs')
  }

  function onMount(instance: Monaco.editor.IStandaloneCodeEditor, api: typeof Monaco) {
    editor.value = instance
    monaco.value = api
    syncTheme()

    // Monaco swallows Tab to indent, which traps keyboard users inside the editor
    // (WCAG 2.1.2). Tab-focus mode makes Tab move focus instead; it is off by default,
    // so this single trigger turns it on. Users who want a literal tab still have
    // Ctrl+M to toggle it back — Monaco's own documented escape hatch.
    instance.trigger('monaco-editor.vue', 'editor.action.toggleTabFocusMode', null)
  }

  function onValidate(markers: Monaco.editor.IMarker[]) {
    emit('validate', markers)
  }

  // 11. watchers / lifecycle
  watch(resolvedTheme, syncTheme)

  onBeforeUnmount(() => {
    editor.value = null
    monaco.value = null
  })

  // 13. defineExpose — functions only.
  defineExpose({
    /** Move focus into the editor. */
    focus: () => editor.value?.focus(),
    /** Reformat the document with Monaco's formatter for the current language. */
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
    <!-- A <span>, not webkit's `Label`: that renders a native <label>, and Monaco's
         editable surface is an off-screen textarea inside a widget tree that a `for`
         cannot address meaningfully. The association is made with `aria-labelledby` on
         the editor instead, and the design system's label typography applied here. -->
    <span
      v-if="label"
      :id="labelId"
      class="inline-flex items-center text-label-sm text-(--text-default)"
      :data-testid="`${testId}__label`"
      >{{ label }}</span
    >

    <!-- Loading swaps the editor out rather than overlaying it, and Skeleton reserves the
         same height so nothing shifts when the real document arrives. -->
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

    <!-- The wrapper owns the chrome — border, radius, focus ring, state styling — so it
         stays utility-driven and `data-*` switched. Monaco only paints what it renders
         itself, from the theme built out of the same tokens. -->
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
        <!-- Monaco itself is fetched and booted asynchronously; this is its own load
             phase, distinct from the `loading` prop above. -->
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

    <!-- In `flush` mode the editor runs edge to edge, so its message has to bring its
         own inset or it would sit against the panel's border. -->
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
