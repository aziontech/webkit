<script setup lang="ts">
  import { computed, defineAsyncComponent, h, onBeforeUnmount, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({ name: 'CopyPromptButton', inheritAttrs: false })

  /** One coding agent the prompt works with, drawn as a single-colour mark after the label. */
  export type CopyPromptAgent = {
    /** Brand name, read by screen readers in the "Works with" description. */
    name: string
    /** Icon-font class of the single-colour mark, such as `ai ai-claude`; used when `logo` is not set. */
    icon?: string
    /** URL of the agent's mark file, such as the `@aziontech/webkit/assets/claude-symbol-color.svg` asset, drawn through `Logo` in the chip's own ink. */
    logo?: string
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
    /** Shows a dismiss button beside the chip; activating it removes both from the layout and emits `close`. */
    closable?: boolean
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
    disabled: false,
    closable: false
  })

  const emit = defineEmits<{
    copy: [event: MouseEvent, value: string]
    close: [event: MouseEvent]
  }>()

  /** Whether the chip is shown (v-model:open). The dismiss button sets it to false; bind it to persist or restore the dismissal. */
  const open = defineModel<boolean>('open', { default: true })

  const attrs = useAttrs()
  const { t } = useTranslate({ copyPromptButton: en.copyPromptButton })

  const CopyButtonFallback = defineAsyncComponent(
    () => import('../copy-button/copy-button-fallback.vue')
  )
  const Logo = defineAsyncComponent({
    loader: () => import('../../content/logo/logo.vue'),
    loadingComponent: () => h('span', { 'aria-hidden': 'true', class: 'inline-block size-5' }),
    delay: 0
  })
  const IconButton = defineAsyncComponent({
    loader: () => import('../icon-button/icon-button.vue'),
    loadingComponent: () => h('span', { 'aria-hidden': 'true', class: 'inline-block size-7' }),
    delay: 0
  })

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

  async function onClick(event: MouseEvent) {
    if (props.disabled || !props.value || typeof globalThis.navigator === 'undefined') return
    try {
      await globalThis.navigator.clipboard.writeText(props.value)
    } catch {
      fallbackRequested.value = true
      fallbackOpen.value = true
      return
    }
    copied.value = true
    emit('copy', event, props.value)
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
      resetTimer = null
    }, 2000)
  }

  function onClose(event: MouseEvent) {
    open.value = false
    emit('close', event)
  }

  onBeforeUnmount(() => {
    if (resetTimer) clearTimeout(resetTimer)
  })
</script>

<template>
  <span
    v-if="open"
    :data-testid="`${testId}__frame`"
    class="inline-flex max-w-full items-center gap-(--spacing-xxs)"
  >
    <Tooltip
      :text="t('copyPromptButton.tooltip')"
      placement="top"
      :data-testid="`${testId}__tooltip`"
      class="min-w-0 max-w-full"
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
        class="group/copy-prompt relative isolate inline-flex h-10 min-w-0 max-w-full cursor-pointer items-center overflow-hidden rounded-(--shape-button) border border-(length:--border-width-default) border-(--secondary-mask) p-px text-button-lg whitespace-nowrap transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:border-transparent disabled:bg-(--bg-disabled) motion-reduce:transition-none pointer-coarse:min-h-11 forced-colors:border-[ButtonBorder]"
        @click="onClick"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 animate-spin [animation-duration:8s] [animation-timing-function:linear] [background:linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-brand-primary-500))] [filter:blur(12px)] motion-reduce:animate-none group-disabled/copy-prompt:hidden"
        />
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] [background-image:linear-gradient(120deg,var(--color-brand-accent-900)_17%,var(--color-brand-accent-100)_53%,var(--color-brand-accent-600)_96%)] transition-opacity duration-300 ease-out motion-reduce:transition-none group-enabled/copy-prompt:group-hover/copy-prompt:opacity-25 group-disabled/copy-prompt:hidden"
        />
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] bg-(--bg-backdrop) transition-opacity duration-300 ease-out motion-reduce:transition-none group-enabled/copy-prompt:group-hover/copy-prompt:opacity-25 group-disabled/copy-prompt:hidden"
        />
        <span
          class="relative z-1 inline-flex h-full w-full min-w-0 items-center gap-(--spacing-xs) ps-(--spacing-md) pe-(--spacing-sm) text-(--color-base-white) sm:gap-(--spacing-sm) group-disabled/copy-prompt:text-(--text-disabled)"
        >
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
            class="inline-flex shrink-0 items-center gap-(--spacing-xxs) sm:gap-(--spacing-xs)"
          >
            <template
              v-for="agent in agents"
              :key="agent.name"
            >
              <Logo
                v-if="agent.logo"
                :name="agent.name"
                :src="agent.logo"
                kind="current"
                decorative
                :data-agent="agent.name"
                class="size-5"
              />
              <i
                v-else
                :class="agent.icon"
                class="text-label-lg leading-none"
                :data-agent="agent.name"
              />
            </template>
          </span>
        </span>
      </button>
    </Tooltip>
    <Tooltip
      v-if="closable"
      :text="t('copyPromptButton.dismiss')"
      placement="top"
    >
      <IconButton
        icon="pi pi-times"
        kind="transparent"
        size="small"
        :aria-label="t('copyPromptButton.dismiss')"
        :data-testid="`${testId}__close`"
        @click="onClose"
      />
    </Tooltip>
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
