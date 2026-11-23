<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import CopyButton from '../../action/copy-button/copy-button.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import { useCodeBlockLines } from './composables/use-code-block-lines'
  import { useCodeBlockMotion } from './composables/use-code-block-motion'
  import { resolveFileIcon } from './lib/file-icon'
  import { languageName, stripShellPrompts } from './lib/language-name'
  import type { CodeBlockLineChange } from './lib/line-decorations'
  import CodeBlockLines from './parts/code-block-lines.vue'
  import CodeBlockTabs from './parts/code-block-tabs.vue'

  export type { CodeBlockLineChange }

  export type CodeBlockType = 'code' | 'output'

  /** How a tab with an `original` draws its diff: one column of removed and added lines, or the two versions side by side. */
  export type CodeBlockDiffView = 'unified' | 'split'

  export type CodeBlockTab = {
    label: string
    value: string
    code: string
    language?: string
    fileName?: string
    fileIcon?: string
    highlightedLine?: number
    lineChanges?: CodeBlockLineChange[]
    original?: string
  }

  defineOptions({
    name: 'CodeBlock',
    inheritAttrs: false
  })

  export interface CodeBlockProps {
    /** Tab definitions with label, value, code, and optional language, filename, diff, or highlight metadata. */
    tabs?: CodeBlockTab[]
    /** Initial active tab when uncontrolled. */
    defaultValue?: string
    /** Code of a single snippet, used when `tabs` is empty. */
    code?: string
    /** Language of the single `code` snippet (highlighting and the label header). */
    language?: string
    /** Shows a fixed-width gutter with zero-padded line numbers before each code line. */
    showLineNumbers?: boolean
    /** Accessible name for the copy control (forwarded to CopyButton's aria-label). Empty uses the locale catalog (`Copy code`). */
    copyAriaLabel?: string
    /** Shows the copy control. Unset, a `code` block shows it and an `output` block does not; turn it off for a decorative block nobody copies from. */
    copyable?: boolean
    /** What the block holds: `code` the reader runs or reads, or `output` — what a command prints — drawn flat and muted under an "Output" label, without a copy control. */
    type?: CodeBlockType
    /** Shows a header naming the block when there is no tab strip or file name: the active tab's label, else the language's readable name (Shell, JavaScript). Docs blocks show it. */
    showLabel?: boolean
    /** Text of the label header; empty uses the tab label or the language name, or "Output" for an `output` block. */
    title?: string
    /** Staggered line entrance for website / marketing layouts (opacity + slide from -8 px). */
    animateLines?: boolean
    /** Draw the outer card border around the block. On by default; set to false to render flush inside a surface that already frames it. */
    bordered?: boolean
    /** How a tab with an `original` draws the diff the block computes: `unified` (one column) or `split` (side by side). */
    diffView?: CodeBlockDiffView
  }

  const props = withDefaults(defineProps<CodeBlockProps>(), {
    tabs: () => [],
    defaultValue: undefined,
    code: '',
    language: '',
    showLineNumbers: true,
    copyAriaLabel: '',
    copyable: undefined,
    type: 'code',
    showLabel: false,
    title: '',
    animateLines: false,
    bordered: true,
    diffView: 'unified'
  })

  const emit = defineEmits<{
    copy: [event: MouseEvent, code: string]
  }>()

  const valueModel = defineModel<string | undefined>({ default: undefined })

  defineSlots<{
    /** Leading mark of a tab in the tab strip; receives the tab. */
    'tab-icon'(props: { tab: CodeBlockTab }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ codeBlock: en.codeBlock })
  const internalValue = ref('')
  const contentEl = ref<HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'code-block')
  const uid = useId()
  const panelId = `${uid}-panel`

  const normalizedTabs = computed<CodeBlockTab[]>(() => {
    if (props.tabs.length === 0) {
      return props.code
        ? [{ label: '', value: 'code', code: props.code, language: props.language || undefined }]
        : []
    }
    return props.tabs.filter((tab): tab is CodeBlockTab => Boolean(tab && tab.value && tab.code))
  })

  const isControlled = computed(() => valueModel.value !== undefined)

  const activeValue = computed({
    get: () => (isControlled.value ? (valueModel.value ?? '') : internalValue.value),
    set: (next: string) => {
      if (!isControlled.value) internalValue.value = next
      valueModel.value = next
    }
  })

  const activeTab = computed(
    () =>
      normalizedTabs.value.find((tab) => tab.value === activeValue.value) ??
      normalizedTabs.value[0] ??
      null
  )

  const showTabHeader = computed(() => normalizedTabs.value.length > 1)

  const activeTabIndex = computed(() =>
    activeTab.value ? normalizedTabs.value.indexOf(activeTab.value) : -1
  )

  const showFileNameBar = computed(() => Boolean(activeTab.value?.fileName))

  const isOutput = computed(() => props.type === 'output')

  const canCopy = computed(() => props.copyable ?? !isOutput.value)

  const showLabelBar = computed(
    () =>
      Boolean(activeTab.value) &&
      !showTabHeader.value &&
      !showFileNameBar.value &&
      (props.showLabel || isOutput.value || Boolean(props.title))
  )

  const copyInHeader = computed(() => canCopy.value && showLabelBar.value)

  const copyGutter = computed(() => canCopy.value && !showLabelBar.value)

  const labelText = computed(() => {
    if (props.title) return props.title
    if (isOutput.value) return t('codeBlock.output')
    return activeTab.value?.label || languageName(activeTab.value?.language)
  })

  const copyValue = computed(() =>
    activeTab.value ? stripShellPrompts(activeTab.value.code, activeTab.value.language) : ''
  )

  const activeFileIcon = computed(() =>
    resolveFileIcon(activeTab.value?.language, activeTab.value?.fileIcon)
  )

  const { isSplit, showDiffGutter, displayLines, splitRows } = useCodeBlockLines(
    activeTab,
    isOutput,
    () => props.diffView === 'split'
  )

  const isSingleLine = computed(() => displayLines.value.length === 1)

  onMounted(() => {
    if (normalizedTabs.value.length && !activeValue.value)
      internalValue.value = props.defaultValue ?? normalizedTabs.value[0]?.value ?? ''
  })

  watch(
    normalizedTabs,
    (tabs) => {
      if (!tabs.length || tabs.some((tab) => tab.value === activeValue.value)) return
      const next = props.defaultValue ?? tabs[0]?.value ?? ''
      internalValue.value = next
      valueModel.value = next
    },
    { immediate: true }
  )

  const indexOf = (value: string) => normalizedTabs.value.findIndex((tab) => tab.value === value)
  const motion = useCodeBlockMotion({
    contentEl,
    animateLines: () => props.animateLines,
    value: () => activeValue.value,
    code: () => activeTab.value?.code,
    indexOf,
    activeIndex: () => indexOf(activeValue.value),
    hasTabs: () => normalizedTabs.value.length > 0,
    lineCount: () => displayLines.value.length
  })

  const onContentTransitionend = (event: globalThis.TransitionEvent) => {
    const el = contentEl.value
    if (el && event.propertyName === 'height' && event.target === el) el.style.height = ''
  }

  const CONTENT_CLASS =
    'relative flex max-h-[var(--code-block-max-height,320px)] min-h-0 shrink flex-col overflow-hidden transition-[height] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none'

  const LABEL_CLASS =
    'sticky top-0 z-3 flex h-10 shrink-0 items-center gap-(--spacing-xs) overflow-hidden bg-inherit ps-(--spacing-lg) pe-(--spacing-sm) ' +
    'in-data-[bordered]:border-b in-data-[bordered]:border-(--border-default)'

  const ROOT_CLASS =
    'group/code-block flex h-[var(--code-block-height,auto)] w-full @container flex-col overflow-clip rounded-(--shape-control) bg-(--bg-surface) ' +
    'data-[bordered]:border data-[bordered]:border-(--border-default) ' +
    'data-[type=output]:bg-(--bg-canvas)'
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-bordered="bordered || null"
    :data-copyable="canCopy || null"
    :data-copy-gutter="copyGutter || null"
    :data-type="type"
    :data-testid="testId"
  >
    <div
      v-if="showLabelBar"
      :class="LABEL_CLASS"
      :data-testid="`${testId}__label`"
    >
      <i
        :class="
          cn(
            'text-label-code-sm shrink-0 text-(--text-muted)',
            isOutput ? 'az az-align-left' : 'az az-code'
          )
        "
        aria-hidden="true"
      />
      <span
        class="text-label-code-sm min-w-0 flex-1 truncate text-(--text-muted)"
        :data-testid="`${testId}__label-text`"
      >
        {{ labelText }}
      </span>
      <CopyButton
        v-if="copyInHeader"
        :value="copyValue"
        :ariaLabel="copyAriaLabel || t('codeBlock.copy')"
        variant="ghost"
        size="small"
        :data-testid="`${testId}__copy`"
        @copy="(event: MouseEvent, code: string) => emit('copy', event, code)"
      />
    </div>

    <CodeBlockTabs
      v-if="showTabHeader"
      :tabs="normalizedTabs"
      :value="activeValue"
      :id-prefix="`${uid}-tab`"
      :panel-id="panelId"
      :test-id="testId"
      @select="(_event: Event, value: string) => (activeValue = value)"
    >
      <template
        v-if="$slots['tab-icon']"
        #tab-icon="{ tab }"
      >
        <slot
          name="tab-icon"
          :tab="tab"
        />
      </template>
    </CodeBlockTabs>

    <div
      v-if="showFileNameBar && activeTab"
      class="flex h-10 shrink-0 items-center gap-(--spacing-xs) overflow-hidden border-b border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm)"
      :data-testid="`${testId}__filename`"
    >
      <span
        class="text-label-code-sm flex size-4 shrink-0 items-center justify-center"
        :data-testid="`${testId}__filename-icon`"
      >
        <i
          :class="cn('text-(--text-default)', activeFileIcon)"
          aria-hidden="true"
        />
      </span>
      <span
        class="text-label-code-sm min-w-0 flex-1 text-(--text-muted)"
        :data-testid="`${testId}__filename-label`"
      >
        {{ activeTab.fileName }}
      </span>
    </div>

    <div
      ref="contentEl"
      dir="ltr"
      :class="CONTENT_CLASS"
      :data-testid="`${testId}__content`"
      @transitionend="onContentTransitionend"
    >
      <div
        v-if="copyGutter"
        class="absolute end-0 top-0 z-2 bg-(--bg-surface) pe-(--spacing-sm) ps-(--spacing-xs) pt-(--spacing-sm) data-[single-line]:top-1/2 data-[single-line]:-translate-y-1/2 data-[single-line]:pt-0"
        :data-single-line="isSingleLine || null"
        :data-testid="`${testId}__copy-anchor`"
      >
        <CopyButton
          :value="copyValue"
          :ariaLabel="copyAriaLabel || t('codeBlock.copy')"
          variant="outline"
          size="small"
          :data-testid="`${testId}__copy`"
          @copy="(event: MouseEvent, code: string) => emit('copy', event, code)"
        />
      </div>

      <ScrollArea
        orientation="both"
        :class="
          cn(
            'min-h-0 min-w-0 flex-1 py-(--spacing-sm) in-data-[copy-gutter]:pe-10',
            'focus-visible:ring-offset-(--bg-surface)'
          )
        "
        :data-testid="`${testId}__scroll`"
      >
        <div
          v-if="activeTab"
          :role="showTabHeader ? 'tabpanel' : undefined"
          :id="showTabHeader ? panelId : undefined"
          :aria-labelledby="showTabHeader ? `${uid}-tab-${activeTabIndex}` : undefined"
          class="min-w-full w-max data-[split]:w-full"
          :data-split="isSplit || null"
          :data-testid="`${testId}__panel`"
        >
          <CodeBlockLines
            :lines="displayLines"
            :rows="splitRows"
            :split="isSplit"
            :tab-value="activeTab.value"
            :show-line-numbers="showLineNumbers"
            :show-diff-gutter="showDiffGutter"
            :added-label="t('codeBlock.added')"
            :removed-label="t('codeBlock.removed')"
            :original-label="t('codeBlock.original')"
            :modified-label="t('codeBlock.modified')"
            :version="motion.version.value"
            :mode="motion.mode.value"
            :ready="motion.ready.value"
            :revealed="motion.revealed.value"
            :enter-from="motion.enterFrom.value"
            :test-id="testId"
          />
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
