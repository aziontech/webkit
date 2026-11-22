<script setup lang="ts">
  import { ref } from 'vue'

  import type { CodeEditorMarkerSeverity } from '../code-editor.vue'
  import { columnsOf, indentEdit, offsetOf } from '../lib/plain-text'
  import { padLineNumber } from '../monaco'

  defineOptions({ name: 'CodeEditorPane', inheritAttrs: false })

  export interface CodeEditorPaneData {
    key: string
    value: string
    editable: boolean
    label: string
    lines: string[]
    main: boolean
  }

  interface Props {
    /** The side this pane shows. */
    pane: CodeEditorPaneData
    /** The pane follows another one. */
    second: boolean
    /** The editor shows a diff. */
    diff: boolean
    /** Id of the pane label. */
    labelId: string
    /** Shows the line-number gutter. */
    showLineNumbers: boolean
    /** Zero-pads line numbers to two digits. */
    padLineNumbers: boolean
    /** Worst diagnostic severity per line, for the main pane. */
    severities: Map<number, CodeEditorMarkerSeverity> | null
    /** Diff change per line of this side. */
    changes: Map<number, 'added' | 'removed'> | null
    /** Id of the main text area. */
    controlId: string | undefined
    /** Accessible name of the text area outside a diff. */
    plainLabel: string | undefined
    /** Ids that describe the main text area. */
    describedBy: string
    /** The value is invalid. */
    invalid: boolean
    /** The editor is disabled. */
    disabled: boolean
    /** Test id of the owning CodeEditor; each part appends its own name. */
    testId: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const textareaEl = ref<HTMLTextAreaElement | null>(null)
  const scrollerEl = ref<HTMLElement | null>(null)
  let escapeArmed = false

  const lineLabel = (line: number) => (props.padLineNumbers ? padLineNumber(line) : String(line))

  function onKeydown(event: KeyboardEvent): void {
    const el = event.currentTarget as HTMLTextAreaElement
    if (event.key === 'Escape') {
      escapeArmed = true
      return
    }
    if (event.key !== 'Tab') {
      if (event.key !== 'Shift') escapeArmed = false
      return
    }
    const blocked = escapeArmed || !props.pane.editable || event.altKey || event.ctrlKey
    escapeArmed = false
    if (blocked || event.metaKey) return
    event.preventDefault()
    const edit = indentEdit(el.value, el.selectionStart, el.selectionEnd, event.shiftKey)
    const next = el.value.slice(0, edit.start) + edit.text + el.value.slice(edit.end)
    el.value = next
    emit('update:modelValue', next)
    el.setSelectionRange(edit.selection[0], edit.selection[1])
  }

  function onBlur(): void {
    escapeArmed = false
  }

  function reveal(line: number, column: number): void {
    const el = textareaEl.value
    if (!el) return
    const offset = offsetOf(el.value, line, column)
    el.focus()
    el.setSelectionRange(offset, offset)
    const scroller = scrollerEl.value
    if (!scroller) return
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    const top = (line - 1) * lineHeight
    if (top < scroller.scrollTop || top > scroller.scrollTop + scroller.clientHeight - lineHeight)
      scroller.scrollTop = Math.max(0, top - scroller.clientHeight / 2)
  }

  defineExpose({
    /** Focuses the text area. */
    focus: () => textareaEl.value?.focus(),
    /** Moves the caret to a line and column and scrolls it into view. */
    reveal
  })

  const GUTTER_CLASS =
    'sticky start-0 z-1 m-0 shrink-0 list-none border-e border-(--border-default) bg-(--bg-canvas) py-(--spacing-xs) ps-(--spacing-sm) pe-(--spacing-xs) text-end text-body-code-sm ' +
    'pointer-coarse:text-label-code-lg text-(--code-syntax-line-number) select-none'

  const LINE_NUMBER_CLASS =
    'relative min-w-[2ch] tabular-nums ' +
    'data-[change=added]:bg-(--success) data-[change=added]:text-(--success-foreground) data-[change=removed]:bg-(--danger) data-[change=removed]:text-(--danger-foreground) ' +
    'data-[severity]:font-medium data-[severity=danger]:text-(--danger-foreground) data-[severity=info]:text-(--info-foreground) data-[severity=warning]:text-(--warning-foreground) ' +
    'forced-colors:data-[severity]:text-[Highlight]'

  const INPUT_CLASS =
    'm-0 block min-w-0 flex-1 resize-none overflow-hidden border-0 bg-transparent px-(--spacing-sm) py-(--spacing-xs) text-body-code-sm ' +
    'pointer-coarse:text-label-code-lg whitespace-pre text-(--code-syntax-identifier) caret-(--text-default) outline-none ' +
    'placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)'
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex min-h-0 min-w-0 flex-1 flex-col data-[second]:border-t data-[second]:border-(--border-default) @lg/code-editor:data-[second]:border-t-0 @lg/code-editor:data-[second]:border-s"
    :data-second="second || null"
    :data-testid="`${testId}__pane`"
  >
    <div
      v-if="diff"
      class="shrink-0 border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
      :id="labelId"
    >
      {{ pane.label }}
    </div>
    <div
      ref="scrollerEl"
      dir="ltr"
      class="min-h-0 flex-1 overflow-auto overscroll-contain"
    >
      <div class="flex min-h-full w-max min-w-full">
        <ol
          v-if="showLineNumbers"
          v-memo="[pane.lines.length, severities, padLineNumbers, testId, changes]"
          aria-hidden="true"
          :class="GUTTER_CLASS"
          :data-testid="`${testId}__gutter`"
        >
          <li
            v-for="(_, index) in pane.lines"
            :key="index"
            :data-severity="severities?.get(index + 1) || null"
            :data-change="changes?.get(index + 1) || null"
            :class="LINE_NUMBER_CLASS"
          >
            {{ lineLabel(index + 1) }}
          </li>
        </ol>
        <textarea
          ref="textareaEl"
          :id="pane.main ? controlId : undefined"
          :value="pane.value"
          :rows="pane.lines.length"
          :cols="columnsOf(pane.lines)"
          wrap="off"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          :readonly="!pane.editable || undefined"
          :disabled="disabled || undefined"
          :aria-label="diff ? undefined : plainLabel"
          :aria-labelledby="diff ? labelId : undefined"
          :aria-invalid="(pane.main && invalid) || undefined"
          :aria-readonly="!pane.editable || undefined"
          :aria-describedby="pane.main ? describedBy : undefined"
          :class="INPUT_CLASS"
          :data-testid="`${testId}__${pane.main ? 'input' : 'original'}`"
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
          @keydown="onKeydown"
          @blur="onBlur"
        />
      </div>
    </div>
  </div>
</template>
