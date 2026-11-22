<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import { matchesAccept } from '../../../../utils/file-accept'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'

  defineOptions({
    name: 'PromptInputAttachButton',
    inheritAttrs: false
  })

  export interface PromptInputAttachButtonProps {
    /** Accessible name of the control. Empty uses the locale catalog (`Attach files`). */
    ariaLabel?: string
    /** Azion icon class of the glyph. Empty uses `az az-plus`. */
    icon?: string
  }

  withDefaults(defineProps<PromptInputAttachButtonProps>(), {
    ariaLabel: '',
    icon: ''
  })

  const attrs = useAttrs()
  const { t, formatFileSize } = useLocale({ promptInput: en.promptInput })
  const context = usePromptInputContext()
  const { disabled, accept, maxFiles } = context

  const inputEl = ref<HTMLInputElement | null>(null)
  let depth = 0

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-attach-button'
  )

  function attach(event: Event, incoming: File[]): void {
    if (disabled.value || incoming.length === 0) return
    const limit = context.maxFileSize.value
    const wrongType = incoming.filter((file) => !matchesAccept(file, accept.value))
    const tooLarge = incoming.filter(
      (file) => !wrongType.includes(file) && limit > 0 && file.size > limit
    )
    const fitting = incoming.filter((file) => !wrongType.includes(file) && !tooLarge.includes(file))
    const room =
      maxFiles.value > 0
        ? Math.max(0, maxFiles.value - context.fileCount.value)
        : Number.POSITIVE_INFINITY
    const accepted = fitting.slice(0, room)
    const overflow = fitting.slice(accepted.length)
    if (accepted.length) context.appendFiles(accepted)
    const messages: string[] = []
    if (wrongType.length) {
      context.reject(event, wrongType, 'accept')
      messages.push(t('promptInput.rejectedAccept', { count: wrongType.length }))
    }
    if (tooLarge.length) {
      context.reject(event, tooLarge, 'max-file-size')
      messages.push(
        t('promptInput.rejectedSize', { count: tooLarge.length, size: formatFileSize(limit) })
      )
    }
    if (overflow.length) {
      context.reject(event, overflow, 'max-files')
      messages.push(t('promptInput.rejectedCount', { count: overflow.length, max: maxFiles.value }))
    }
    context.setRejection(messages.join(' '))
  }

  function drag(event: DragEvent): void {
    if (disabled.value || !Array.from(event.dataTransfer?.types ?? []).includes('Files')) return
    event.preventDefault()
    if (event.type === 'dragenter') depth += 1
    if (event.type === 'dragleave') depth = Math.max(0, depth - 1)
    if (event.type === 'dragover' && event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    if (event.type === 'drop') {
      depth = 0
      attach(event, Array.from(event.dataTransfer?.files ?? []))
    }
    context.setDragging(depth > 0)
  }

  function paste(event: ClipboardEvent): void {
    const pasted = Array.from(event.clipboardData?.files ?? [])
    if (disabled.value || !pasted.length) return
    if (!event.clipboardData?.types.includes('text/plain')) event.preventDefault()
    attach(event, pasted)
  }

  onScopeDispose(context.registerAttach({ drag, paste }))

  function pick(): void {
    inputEl.value?.click()
  }

  function onChange(event: Event): void {
    const input = event.target as HTMLInputElement
    attach(event, Array.from(input.files ?? []))
    input.value = ''
  }
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :icon="icon || 'az az-plus'"
    variant="ghost"
    size="medium"
    class="rounded-full!"
    :ariaLabel="ariaLabel || t('promptInput.attach')"
    :disabled="disabled"
    :data-testid="testId"
    @click="pick"
  />
  <input
    ref="inputEl"
    type="file"
    class="hidden"
    tabindex="-1"
    aria-hidden="true"
    :accept="accept || undefined"
    :multiple="maxFiles !== 1"
    :disabled="disabled"
    :data-testid="`${testId}__input`"
    @change="onChange"
  />
</template>
