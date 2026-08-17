<script setup>
  // THE FUNCTION EDITOR — the Code surface, shared by the create page and the detail
  // page.
  //
  // It lives here for the same reason ./FunctionSettings.vue does: a function is
  // WRITTEN and then CORRECTED, and those are the same task on the same record. When
  // the two screens each built their own editor, creating a function and editing one
  // were two different products — different tab sets, different chrome, a preview on
  // one and not the other — and every change had to be made twice or the two drifted.
  //
  // The shape:
  //
  //   ┌──────────────────────────────────────────────┬──────────────────────────┐
  //   │ [ Code · Arguments ]   runtime      Run      ┊                          │
  //   │ the editor, full bleed, filling the region   ┊  Preview — the response  │
  //   ├─ Terminal ───────────────────────────────────┤  the function produces,  │
  //   │ what the last run reported                   ┊  rendered                │
  //   └──────────────────────────────────────────────┴──────────────────────────┘
  //
  // ONE EDITOR, TWO DOCUMENTS. The code and its default arguments were separate tabs,
  // which made a reader switch pages to see the values the code they are reading is
  // written against. A SegmentedButton swaps the document in place; both editors stay
  // mounted (`v-show`), because Monaco owns undo history, cursor and folding state and
  // unmounting throws all three away.
  //
  // THE EDITOR IS FULL BLEED (`flush`). It is not a control on a form, it is the
  // surface — the panel edges around it already draw its frame, and a rounded,
  // bordered box floating a few pixels inside them reads as an input the reader is
  // meant to fill in.
  //
  // THE PANELS ARE THE DESIGN SYSTEM'S — and they are `ResizablePanel`, not `Sidebar`.
  //
  // Both used to be a `Sidebar`: the preview was `Sidebar side="end"`, and the terminal,
  // which `Sidebar` has no shape for at all, hand-rolled its own splitter here. That was
  // one screen with two navigation rails and one document, and the rail component was
  // being asked for an axis it does not have.
  //
  // Neither is navigation. The code, the terminal and the preview are three views of the
  // same work, and what the reader wants from the edges between them is to MOVE them. So
  // the whole surface is one `ResizablePanel` group (side by side) holding a second one
  // (stacked), and `Sidebar` goes back to being the app rail. The local splitter is gone
  // with it — the design system owns the horizontal edge now too.
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import ResizablePanelHandle from '@aziontech/webkit/resizable-panel-handle'
  import ResizablePanelPane from '@aziontech/webkit/resizable-panel-pane'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { runFunction, SAMPLE_REQUEST } from '../../lib/format/function-run'
  import MonacoEditor from '../monaco-editor/monaco-editor.vue'

  const code = defineModel('code', { type: String, default: '' })
  const args = defineModel('args', { type: String, default: '' })
  // Which document is on screen. A model so the host can put it in the URL (the detail
  // page does) or keep it local (the create page does) without this component caring.
  const document = defineModel('document', { type: String, default: 'code' })

  const props = defineProps({
    /** Monaco grammar for the code document. */
    language: { type: String, default: 'javascript' },
    /** How the runtime reads to a person, for the toolbar's line and the run log. */
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
  const argsPath = computed(() => `${props.fileName || 'function'}.args.json`)

  /** `default_args` is posted as an object, so what is typed has to parse to one. */
  const parsedArgs = () => {
    try {
      const value = JSON.parse(args.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  // --- Run: the preview and the terminal ------------------------------------
  // Both read ONE result, so the rendered page and the log can never describe
  // different runs. `null` until the reader runs it: the panel says what it is waiting
  // for rather than showing a stale render of code that has since changed.
  const result = ref(null)
  const running = ref(false)

  const run = async () => {
    if (running.value) return
    running.value = true
    result.value = null
    // A beat, so the run reads as something that happened rather than as the panel
    // having been there all along.
    await new Promise((resolve) => setTimeout(resolve, 260))
    result.value = runFunction({
      code: code.value,
      args: parsedArgs() ?? {},
      runtimeLabel: props.runtimeLabel
    })
    running.value = false
  }

  const statusSeverity = computed(() => {
    const status = result.value?.status ?? 0
    if (status >= 500) return 'danger'
    if (status >= 400) return 'warning'
    if (status >= 300) return 'info'
    return 'success'
  })

  // --- The two movable edges ------------------------------------------------
  // Both are plain `v-model`s on a pane. Hiding a panel is COLLAPSING it, not unmounting
  // it: Monaco owns undo history, cursor and folding state, and the preview holds the
  // last run — a toggle that threw any of that away would be a toggle that loses work.
  const terminalHeight = ref(176)
  const terminalCollapsed = ref(false)
  const previewWidth = ref(480)
  const previewCollapsed = ref(false)

  const hint = computed(() =>
    document.value === 'code'
      ? `${props.runtimeLabel}, running on request`
      : 'Defaults for every instance. An instance can override them.'
  )
</script>

<template>
  <!-- THE WHOLE SURFACE IS ONE GROUP: the editor column, a movable edge, the preview. -->
  <ResizablePanel
    class="min-h-0 flex-1 overflow-hidden"
    aria-label="Function workspace"
  >
    <!-- LEFT: what you write — one editor, two documents — over what the last run
         reported. The flexible pane, so it absorbs whatever the preview leaves. -->
    <ResizablePanelPane aria-label="Editor">
      <!-- ONE CONTENT COLUMN for this region. The toolbar, the terminal's label and
           the terminal's log lines all start on the same x (`--spacing-sm`), so the
           chrome around the editor reads as one column rather than three insets a few
           pixels apart. Measured before: the toolbar sat at 308, the terminal label at
           312 and nothing lined up with anything.

           The EDITOR itself is deliberately not in that column: it is full bleed, and
           its line-number gutter is the editor's own anatomy — pushing it inward would
           put a second margin inside a surface whose whole point is not having one. -->
      <div
        class="flex shrink-0 flex-wrap items-center gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
      >
        <SegmentedButton
          v-model="document"
          :options="documents"
          aria-label="Editor document"
        />
        <p class="min-w-0 truncate text-body-xs text-[var(--text-muted)]">{{ hint }}</p>
        <div class="ml-auto flex shrink-0 items-center gap-[var(--spacing-xs)]">
          <!-- THE WAY BACK TO EACH PANEL LIVES OUT HERE, in the toolbar, not inside the
               panel it reopens. A control that only exists inside the thing it hides
               cannot bring it back — so both toggles sit on this row, which is the one
               piece of chrome that is always on screen whatever is collapsed.
               The handles themselves still collapse and restore by drag (`collapsible`
               on both panes); these are the named, always-reachable version of that. -->
          <Tooltip :text="previewCollapsed ? 'Show the preview' : 'Hide the preview'">
            <IconButton
              icon="pi pi-window-maximize"
              kind="outlined"
              size="medium"
              :aria-pressed="!previewCollapsed"
              :aria-label="previewCollapsed ? 'Show the preview' : 'Hide the preview'"
              @click="previewCollapsed = !previewCollapsed"
            />
          </Tooltip>
          <Tooltip :text="terminalCollapsed ? 'Show the terminal' : 'Hide the terminal'">
            <IconButton
              icon="pi pi-desktop"
              kind="outlined"
              size="medium"
              :aria-pressed="!terminalCollapsed"
              :aria-label="terminalCollapsed ? 'Show the terminal' : 'Hide the terminal'"
              @click="terminalCollapsed = !terminalCollapsed"
            />
          </Tooltip>
          <Button
            label="Run"
            kind="primary"
            size="medium"
            icon="pi pi-play"
            :loading="running"
            :disabled="disabled"
            @click="run"
          />
        </div>
      </div>

      <!-- THE EDITOR OVER THE TERMINAL — a second group, stacked. The toolbar above is
           NOT in it: a toolbar is chrome at a fixed height, and putting it in the group
           would offer the reader an edge that has nothing to give. -->
      <ResizablePanel
        orientation="vertical"
        class="min-h-0 flex-1"
        aria-label="Editor and terminal"
      >
        <ResizablePanelPane aria-label="Editor documents">
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
              <MonacoEditor
                v-model="args"
                fill
                flush
                pad-line-numbers
                size="small"
                language="json"
                :path="argsPath"
                :invalid="!!argsError"
                :helper-text="argsError"
                :disabled="disabled"
                aria-label="Default arguments, as JSON"
                :data-testid="`${testId}-args`"
                @update:model-value="emit('update:argsError', '')"
              />
            </div>
          </div>
        </ResizablePanelPane>

        <!-- THE TERMINAL — what the run reported, in its own words. The edge above it is
           the group's own handle: focusable, publishing the terminal's height, and
           collapsible past the minimum, so the same rail that sizes the panel is also
           how it is dragged shut and pulled back. -->
        <ResizablePanelHandle aria-label="Resize the terminal" />

        <ResizablePanelPane
          v-model:basis="terminalHeight"
          v-model:collapsed="terminalCollapsed"
          collapsible
          :min="96"
          :max="420"
          aria-label="Terminal"
        >
          <section class="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--bg-surface)]">
            <div
              class="flex shrink-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]"
            >
              <span class="text-overline-sm text-[var(--text-muted)]">Terminal</span>
              <span
                v-if="result"
                class="text-body-xs text-[var(--text-muted)]"
              >
                {{ result.durationMs }} ms
              </span>
              <Tooltip text="Hide the terminal">
                <IconButton
                  icon="pi pi-chevron-down"
                  kind="transparent"
                  size="small"
                  aria-label="Hide the terminal"
                  class="ml-auto"
                  @click="terminalCollapsed = true"
                />
              </Tooltip>
            </div>
            <div
              class="min-h-0 flex-1 overflow-auto px-[var(--spacing-sm)] pb-[var(--spacing-sm)] font-code text-label-code-sm"
            >
              <p
                v-if="running"
                class="text-[var(--text-muted)]"
              >
                Running…
              </p>
              <p
                v-else-if="!result"
                class="text-[var(--text-muted)]"
              >
                Run the function to answer a sample request and see what it reports.
              </p>
              <ol
                v-else
                class="m-0 flex list-none flex-col gap-[var(--spacing-xxs)] p-0"
              >
                <li
                  v-for="(line, index) in result.log"
                  :key="index"
                  class="flex gap-[var(--spacing-sm)]"
                >
                  <span
                    aria-hidden="true"
                    class="shrink-0 select-none text-[var(--text-muted)]"
                    >›</span
                  >
                  <span class="min-w-0 break-words text-[var(--text-default)]">{{ line }}</span>
                </li>
              </ol>
            </div>
          </section>
        </ResizablePanelPane>
      </ResizablePanel>
    </ResizablePanelPane>

    <!-- RIGHT: what it produces. Another pane, on the other edge — the same component as
         the terminal below the editor, differing only in the axis its group runs on. -->
    <ResizablePanelHandle aria-label="Resize the preview" />

    <ResizablePanelPane
      v-model:basis="previewWidth"
      v-model:collapsed="previewCollapsed"
      collapsible
      :min="320"
      :max="720"
      aria-label="Preview"
      class="border-l border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          class="flex shrink-0 flex-col gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
        >
          <div class="flex items-center gap-[var(--spacing-xs)]">
            <span class="text-heading-xxs text-[var(--text-default)]">Preview</span>
            <Tag
              v-if="result"
              :label="`${result.status} ${result.statusText}`.trim()"
              :severity="statusSeverity"
              size="medium"
              class="ml-auto"
            />
          </div>
          <!-- The request is NAMED, never implied: a preview that does not say what it
               answered is a screenshot of nothing in particular. -->
          <p class="min-w-0 truncate font-code text-label-code-sm text-[var(--text-muted)]">
            {{ SAMPLE_REQUEST.method }} {{ SAMPLE_REQUEST.url }}
          </p>
        </div>

        <div
          v-if="!result"
          class="flex min-h-0 flex-1 items-center justify-center p-[var(--spacing-lg)] text-center"
        >
          <p class="text-body-sm text-[var(--text-muted)]">
            {{ running ? 'Running…' : 'Run the function to render the response it produces.' }}
          </p>
        </div>
        <!-- Sandboxed, and with no `allow-scripts`: this frame renders a document the
             page composed, and it stays unable to run anything or reach the console
             around it. -->
        <iframe
          v-else
          :srcdoc="result.body"
          sandbox=""
          title="Function response preview"
          class="min-h-0 w-full flex-1 border-0 bg-[var(--bg-canvas)]"
        />
      </div>
    </ResizablePanelPane>
  </ResizablePanel>
</template>
