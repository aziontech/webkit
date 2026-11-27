<script setup lang="ts">
  import { computed, defineComponent, nextTick, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Input from '../../input/input/input.vue'
  import { usePopoverContext } from '../../overlay/popover/composables/use-popover-context'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverDescription from '../../overlay/popover/popover-description/popover-description.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'

  defineOptions({ name: 'CopyButtonFallback' })

  const props = defineProps<{
    value: string
    anchor: globalThis.HTMLElement | null
    testId: string
  }>()

  const open = defineModel<boolean>('open', { required: true })

  const { t } = useTranslate({ copyButton: en.copyButton })

  const Anchor = defineComponent({
    props: { el: { type: Object as () => globalThis.HTMLElement | null, default: null } },
    setup(anchorProps) {
      const ctx = usePopoverContext()
      watch(
        () => anchorProps.el,
        (el) => {
          ctx.triggerEl.value = el
        },
        { immediate: true }
      )
      return () => null
    }
  })

  const keys = computed<string>(() =>
    /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '') ? '⌘C' : 'Ctrl+C'
  )

  watch(
    open,
    async (now) => {
      if (!now) return
      await nextTick()
      const input = globalThis.document?.querySelector<globalThis.HTMLInputElement>(
        `input[data-testid="${props.testId}__fallback-input"]`
      )
      input?.focus({ preventScroll: true })
      input?.select()
    },
    { immediate: true }
  )
</script>

<template>
  <Popover
    v-model:open="open"
    side="auto"
    :data-testid="`${testId}__fallback`"
  >
    <Anchor :el="anchor" />
    <PopoverContent :data-testid="`${testId}__fallback__panel`">
      <div class="flex flex-col gap-(--spacing-xs) p-(--spacing-sm)">
        <PopoverTitle>{{ t('copyButton.fallbackTitle') }}</PopoverTitle>
        <Input
          :model-value="value"
          readonly
          size="small"
          :aria-label="t('copyButton.fallbackField')"
          :data-testid="`${testId}__fallback-input`"
          @focus="(event: FocusEvent) => (event.target as HTMLInputElement | null)?.select()"
        />
        <PopoverDescription>{{ t('copyButton.fallbackHint', { keys }) }}</PopoverDescription>
      </div>
    </PopoverContent>
  </Popover>
</template>
