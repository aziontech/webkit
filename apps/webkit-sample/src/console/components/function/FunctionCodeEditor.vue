<script setup>
  // THE FUNCTION EDITOR — the Code surface, shared by the create page and the detail
  // page.
  //
  // It lives here for the same reason ./FunctionSettings.vue does: a function is
  // WRITTEN and then CORRECTED, and those are the same task on the same record. When
  // the two screens each built their own editor, creating a function and editing one
  // were two different products — different tab sets, different chrome — and every
  // change had to be made twice or the two drifted.
  //
  // The shape:
  //
  //   ┌──────────────────────────────────────────────────────────────────────────┐
  //   │ [ Code · Arguments ]   what this document is                              │
  //   ├───────────────────────────────┬──────────────────────────────────────────┤
  //   │ the code, full bleed          │  arguments: the schema JSON, and beside   │
  //   │                               │  it the fields it describes               │
  //   └───────────────────────────────┴──────────────────────────────────────────┘
  //
  // ONE EDITOR, TWO DOCUMENTS. The code and its default arguments were separate tabs,
  // which made a reader switch pages to see the values the code they are reading is
  // written against. A SegmentedButton swaps the document in place; both editors stay
  // mounted (`v-show`), because Monaco owns undo history, cursor and folding state and
  // unmounting throws all three away.
  //
  // AND THE ARGUMENTS ARE ONE SURFACE, NOT A CHOICE OF TWO. `POST /workspace/functions`
  // takes the arguments twice over: `azion_form`, a JSON Schema the console renders as a
  // form, and `default_args`, the values under it. The Arguments document
  // (./FunctionArgsForm.vue) shows the schema and the fields it describes SIDE BY SIDE,
  // each writing the other as it is edited.
  //
  // There used to be a `JSON / Form Builder` switch over them. It went when the two
  // became mirrors: a switch between two views that already show the same document, at
  // the same time, is chrome asking the reader to choose which half to lose.
  //
  // THE EDITOR IS FULL BLEED (`flush`). It is not a control on a form, it is the
  // surface — the page's own edges already draw its frame, and a rounded, bordered box
  // floating a few pixels inside them reads as an input the reader is meant to fill in.
  //
  // ── WHAT IS NOT HERE: RUN, THE TERMINAL, THE PREVIEW ──
  //
  // This surface used to answer a sample request and report it two ways — a terminal
  // under the editor and a rendered preview beside it, both in `ResizablePanel` panes.
  // They are gone, and so is the Run button that fed them: a control whose whole output
  // was those two panels has nowhere to report without them.
  //
  // What that leaves is what the endpoint actually takes. This screen WRITES a function;
  // running one against real traffic is an instance on an application, which is a
  // different record on a different page. When a real run comes back it comes back as a
  // pane around this editor — the editor itself does not change shape for it.
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed } from 'vue'

  import MonacoEditor from '../monaco-editor/monaco-editor.vue'
  import FunctionArgsForm from './FunctionArgsForm.vue'

  const code = defineModel('code', { type: String, default: '' })
  const args = defineModel('args', { type: String, default: '' })
  // `azion_form`, as text. Empty = this function has no form, and the Form Builder
  // offers to start one.
  const form = defineModel('form', { type: String, default: '' })
  // Which document is on screen. A model so the host can put it in the URL (the detail
  // page does) or keep it local (the create page does) without this component caring.
  const document = defineModel('document', { type: String, default: 'code' })

  const props = defineProps({
    /** Monaco grammar for the code document. */
    language: { type: String, default: 'javascript' },
    /** How the runtime reads to a person, for the toolbar's line. */
    runtimeLabel: { type: String, default: 'JavaScript' },
    /** Names the two Monaco models; Monaco keys per-file state off the path. */
    fileName: { type: String, default: 'function' },
    /** Validation messages, owned by the host that submits. */
    codeError: { type: String, default: '' },
    argsError: { type: String, default: '' },
    /** Locks the scope while the host's save is in flight. */
    disabled: { type: Boolean, default: false },
    /** Test id prefix, so the two hosts address their own editors. */
    testId: { type: String, default: 'function-editor' }
  })

  const emit = defineEmits(['update:codeError', 'update:argsError'])

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
    <!-- ONE CONTENT COLUMN for the chrome. The toolbar starts on `--spacing-sm`; the
         EDITOR below it deliberately does not, because it is full bleed and its
         line-number gutter is the editor's own anatomy — pushing it inward would put a
         second margin inside a surface whose whole point is not having one. -->
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
