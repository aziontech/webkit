<script setup lang="ts">
  import { computed, defineAsyncComponent, onBeforeUnmount, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  defineOptions({ name: 'CopyPromptButton', inheritAttrs: false })

  /** One coding agent the prompt works with, drawn as a single-colour mark after the label. */
  export type CopyPromptAgent = {
    /** Brand name, read by screen readers in the "Works with" description. */
    name: string
    /** Icon-font class of the single-colour mark, such as `ai ai-claude`. */
    icon: string
  }

  interface Props {
    /** The prompt copied to the clipboard on activation. */
    value: string
    /** Visible text and accessible name while idle; empty uses the catalog's `Copy prompt`. */
    label?: string
    /** Visible text announced after a copy; empty uses the catalog's `Copied`. */
    copiedLabel?: string
    /** The agents whose marks follow the label, in order; an empty list draws no marks. */
    agents?: CopyPromptAgent[]
    /** Disables the button; `copy` is not emitted. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    copiedLabel: '',
    agents: () => [
      { name: 'Claude', icon: 'ai ai-claude' },
      { name: 'ChatGPT', icon: 'ai ai-open' },
      { name: 'Gemini', icon: 'ai ai-gemini' },
      { name: 'Cursor', icon: 'ai ai-cursor' }
    ],
    disabled: false
  })

  const emit = defineEmits<{
    copy: [value: string]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ copyPromptButton: en.copyPromptButton })

  const CopyButtonFallback = defineAsyncComponent(
    () => import('../copy-button/copy-button-fallback.vue')
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-copy-prompt-button'
  )
  const describedBy = useId()

  const idleLabel = computed(() => props.label || t('copyPromptButton.label'))
  const doneLabel = computed(() => props.copiedLabel || t('copyPromptButton.copied'))
  const worksWith = computed(() =>
    props.agents.length
      ? t('copyPromptButton.worksWith', {
          agents: props.agents.map((agent) => agent.name).join(', ')
        })
      : ''
  )

  const root = ref<globalThis.HTMLButtonElement | null>(null)
  const copied = ref(false)
  const fallbackRequested = ref(false)
  const fallbackOpen = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  async function onClick() {
    if (props.disabled || !props.value || typeof globalThis.navigator === 'undefined') return
    try {
      await globalThis.navigator.clipboard.writeText(props.value)
    } catch {
      fallbackRequested.value = true
      fallbackOpen.value = true
      return
    }
    copied.value = true
    emit('copy', props.value)
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
      resetTimer = null
    }, 2000)
  }

  onBeforeUnmount(() => {
    if (resetTimer) clearTimeout(resetTimer)
  })
</script>

<template>
  <span
    :data-testid="`${testId}__frame`"
    class="inline-flex max-w-full rounded-(--shape-button) border border-(--border-default) p-px"
  >
    <button
      ref="root"
      type="button"
      v-bind="$attrs"
      data-theme="dark"
      :data-testid="testId"
      :data-state="copied ? 'copied' : 'idle'"
      :data-disabled="disabled ? '' : undefined"
      :disabled="disabled"
      :aria-label="copied ? doneLabel : idleLabel"
      :aria-describedby="worksWith ? describedBy : undefined"
      class="group/copy-prompt relative isolate inline-flex h-10 min-w-0 max-w-full cursor-pointer items-center gap-(--spacing-sm) overflow-hidden rounded-(--shape-button) border border-(--border-default) bg-(--bg-canvas) bg-linear-to-r rtl:bg-linear-to-l from-(--bg-canvas) via-(--bg-surface-raised) to-(--bg-canvas) ps-(--spacing-md) pe-(--spacing-sm) text-button-lg whitespace-nowrap text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] enabled:hover:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) disabled:cursor-not-allowed disabled:bg-none disabled:bg-(--bg-disabled) disabled:text-(--text-disabled) motion-reduce:transition-none motion-reduce:before:transition-none pointer-coarse:min-h-11 forced-colors:border-[ButtonBorder]"
      @click="onClick"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-(--spacing-xl) top-0 h-px bg-linear-to-r rtl:bg-linear-to-l from-transparent via-(--accent) to-transparent opacity-70 group-disabled/copy-prompt:hidden"
      />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-(--spacing-xl) bottom-0 h-px bg-linear-to-r rtl:bg-linear-to-l from-transparent via-(--accent) to-transparent group-disabled/copy-prompt:hidden"
      />
      <span class="grid min-w-0">
        <span
          :data-testid="`${testId}__label`"
          class="truncate [grid-area:1/1] group-data-[state=copied]/copy-prompt:invisible"
          >{{ idleLabel }}</span
        >
        <span
          aria-hidden="true"
          class="invisible inline-flex items-center gap-(--spacing-xxs) [grid-area:1/1] group-data-[state=copied]/copy-prompt:visible"
        >
          <i
            class="pi pi-check text-body-sm"
            aria-hidden="true"
          />{{ doneLabel }}</span
        >
      </span>
      <span
        v-if="agents.length"
        aria-hidden="true"
        :data-testid="`${testId}__agents`"
        class="inline-flex shrink-0 items-center gap-(--spacing-xs) text-(--text-default) group-disabled/copy-prompt:text-(--text-disabled)"
      >
        <i
          v-for="agent in agents"
          :key="agent.name"
          :class="agent.icon"
          class="text-label-lg leading-none"
          :data-agent="agent.name"
        />
      </span>
    </button>
    <span
      v-if="worksWith"
      :id="describedBy"
      class="sr-only"
      >{{ worksWith }}</span
    >
    <span
      role="status"
      class="sr-only"
      :data-testid="`${testId}__status`"
      >{{ copied ? doneLabel : '' }}</span
    >
    <CopyButtonFallback
      v-if="fallbackRequested"
      v-model:open="fallbackOpen"
      :value="value"
      :anchor="root"
      :test-id="testId"
    />
  </span>
</template>
