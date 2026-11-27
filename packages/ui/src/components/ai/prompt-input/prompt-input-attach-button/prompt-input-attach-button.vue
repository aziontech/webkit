<script setup lang="ts">
  import {
    type Component,
    computed,
    onMounted,
    onScopeDispose,
    ref,
    useAttrs,
    watchEffect
  } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import { matchesAccept } from '../../../../utils/file-accept'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import type { PromptInputMenuOption } from '../types'

  defineOptions({
    name: 'PromptInputAttachButton',
    inheritAttrs: false
  })

  export interface PromptInputAttachButtonProps {
    /** Accessible name of the control. Empty uses the locale catalog (`Attach files`). */
    ariaLabel?: string
    /** Azion icon class of the glyph. Empty uses `az az-plus`. */
    icon?: string
    /** Tools the reader can turn on for the next prompt, such as web search. Given, the control opens a menu of Camera (touch screens), Photos and Files, then these tools. */
    tools?: PromptInputMenuOption[]
  }

  const props = withDefaults(defineProps<PromptInputAttachButtonProps>(), {
    ariaLabel: '',
    icon: '',
    tools: () => []
  })

  /** The turned-on tools' values, in `tools` order; each shows as a removable chip in the bar. */
  const model = defineModel<string[]>({ default: () => [] })

  const attrs = useAttrs()
  const { t, formatFileSize } = useLocale({ promptInput: en.promptInput })
  const context = usePromptInputContext()
  const { disabled, accept, maxFiles } = context

  const inputEl = ref<HTMLInputElement | null>(null)
  let depth = 0

  const enabled = computed<number>(
    () => props.tools.filter((tool) => model.value.includes(tool.value)).length
  )

  let addMenu: Component | undefined
  const menuReady = ref<boolean>(false)

  const mounted = ref<boolean>(false)
  onMounted(() => (mounted.value = true))

  watchEffect(() => {
    if (!mounted.value || !props.tools.length || menuReady.value) return
    void import('../parts/prompt-input-add-menu.vue').then((loaded) => {
      addMenu = loaded.default
      menuReady.value = true
    })
  })

  watchEffect(() => context.setChips(enabled.value))
  onScopeDispose(() => context.setChips(0))

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
    const input = event.target
    if (!(input instanceof HTMLInputElement)) return
    attach(event, Array.from(input.files ?? []))
    input.value = ''
  }
</script>

<template>
  <component
    :is="addMenu"
    v-if="menuReady && tools.length"
    v-bind="$attrs"
    v-model="model"
    :icon="icon || 'az az-plus'"
    :label="ariaLabel || t('promptInput.attach')"
    :disabled="disabled"
    :accept="accept"
    :multiple="maxFiles !== 1"
    :tools="tools"
    :labels="{
      add: t('promptInput.addMenu'),
      camera: t('promptInput.camera'),
      photos: t('promptInput.photos'),
      files: t('promptInput.files'),
      tools: t('promptInput.tools'),
      chips: t('promptInput.toolsEnabled')
    }"
    :test-id="testId"
    @files="attach"
    @browse="pick"
  />
  <IconButton
    v-else
    v-bind="$attrs"
    :icon="icon || 'az az-plus'"
    variant="ghost"
    size="medium"
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
