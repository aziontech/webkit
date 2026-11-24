<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../../composables/use-direction'
  import { useElementListener } from '../../../../composables/use-element-listener'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import type { MarkdownFormat } from '../lib/markdown-format'

  defineOptions({ name: 'MarkdownEditorToolbar', inheritAttrs: false })

  interface Props {
    /** Id of the field the buttons format. */
    controls: string
    /** Disables every button. */
    disabled: boolean
    /** Test id of the owning editor; each button appends its own part. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    format: [event: MouseEvent, format: MarkdownFormat]
  }>()

  const { t } = useTranslate({ markdownEditor: en.markdownEditor, kbd: en.kbd })
  const dir = useDirection()

  type ToolKey = 'bold' | 'italic' | 'link' | 'bulletedList' | 'numberedList' | 'quote' | 'code'

  const TOOLS: { format: MarkdownFormat; key: ToolKey; icon: string; shortcut?: string }[] = [
    { format: 'bold', key: 'bold', icon: 'az az-bold', shortcut: 'b' },
    { format: 'italic', key: 'italic', icon: 'az az-italic', shortcut: 'i' },
    { format: 'link', key: 'link', icon: 'az az-link', shortcut: 'k' },
    { format: 'bulleted-list', key: 'bulletedList', icon: 'az az-list' },
    { format: 'numbered-list', key: 'numberedList', icon: 'az az-list-ordered' },
    { format: 'quote', key: 'quote', icon: 'az az-quote' },
    { format: 'code', key: 'code', icon: 'az az-code' }
  ]

  const toolbarEl = ref<HTMLElement | null>(null)
  const current = ref(0)
  const apple = ref(false)

  onMounted(() => {
    apple.value = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent || '')
  })

  const tools = computed(() =>
    TOOLS.map((tool) => {
      const label = t(`markdownEditor.${tool.key}`)
      const keys = tool.shortcut
        ? `${apple.value ? '⌘' : `${t('kbd.ctrl')}+`}${tool.shortcut.toUpperCase()}`
        : ''
      return {
        ...tool,
        label,
        tooltip: keys ? t('markdownEditor.shortcut', { label, keys }) : label,
        ariaKeyshortcuts: tool.shortcut
          ? `Meta+${tool.shortcut.toUpperCase()} Control+${tool.shortcut.toUpperCase()}`
          : undefined
      }
    })
  )

  function moveTo(index: number): void {
    const buttons = toolbarEl.value?.querySelectorAll<HTMLElement>('[data-format]')
    if (!buttons?.length) return
    current.value = (index + buttons.length) % buttons.length
    buttons[current.value]?.focus()
  }

  function onKeydown(event: KeyboardEvent): void {
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') moveTo(current.value + 1)
    else if (key === 'ArrowLeft') moveTo(current.value - 1)
    else if (key === 'Home') moveTo(0)
    else if (key === 'End') moveTo(TOOLS.length - 1)
    else return
    event.preventDefault()
  }

  useElementListener(toolbarEl, 'keydown', onKeydown)
</script>

<template>
  <div
    ref="toolbarEl"
    role="toolbar"
    :aria-label="t('markdownEditor.toolbar')"
    :aria-controls="controls"
    :data-testid="`${testId}__toolbar`"
    data-slot="toolbar"
    class="ms-auto flex flex-wrap items-center gap-(--spacing-2xs)"
  >
    <Tooltip
      v-for="(tool, index) in tools"
      :key="tool.format"
      :content="tool.tooltip"
      :disabled="disabled"
    >
      <IconButton
        :icon="tool.icon"
        :aria-label="tool.label"
        :aria-keyshortcuts="tool.ariaKeyshortcuts"
        variant="ghost"
        size="small"
        :disabled="disabled"
        :tabindex="index === current ? 0 : -1"
        :data-format="tool.format"
        :data-testid="`${testId}__${tool.format}`"
        @mousedown.prevent
        @focus="current = index"
        @click="(event: MouseEvent) => emit('format', event, tool.format)"
      />
    </Tooltip>
  </div>
</template>
