<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import type { StatusIndicatorSeverity } from '../../feedback/status-indicator/status-indicator.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'

  export type ToolCallState = 'pending' | 'running' | 'success' | 'error' | 'denied'

  defineOptions({
    name: 'ToolCall',
    inheritAttrs: false
  })

  interface Props {
    /** The tool or command identifier, shown in code font (`list_workloads`). */
    name: string
    /** What the call does in the reader's words (`Listing your workloads`). Empty shows only the name. */
    title?: string
    /** `pending` waits for authorization, `running` is in flight, then `success`, `error` or `denied` (the reader refused it). */
    state?: ToolCallState
    /** Controlled open state of the input and output details. Use with `v-model:open`. */
    open?: boolean
    /** Initial open state when uncontrolled; details start collapsed. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    state: 'running',
    open: undefined,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /** The details were expanded or collapsed. */
    'update:open': [value: boolean]
  }>()

  const slots = defineSlots<{
    /** The parameters the tool is called with, usually a `CodeBlock` or `KeyValuePairs`. */
    input?(): unknown
    /** What the tool returned, or the error it failed with. */
    output?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ toolCall: en.toolCall })
  const uid = useId()
  const panelId = `${uid}-panel`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-tool-call'
  )
  const openProp = computed(() => props.open)
  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value) => emit('update:open', value)
  })
  const expandable = () => Boolean(slots.input || slots.output)

  const severity = computed<StatusIndicatorSeverity>(() => {
    if (props.state === 'success') return 'success'
    if (props.state === 'error') return 'danger'
    if (props.state === 'denied') return 'warning'
    if (props.state === 'running') return 'info'
    return 'neutral'
  })

  function toggle(): void {
    isOpen.set(!isOpen.value)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="state"
    :data-state="expandable() ? (isOpen ? 'open' : 'closed') : undefined"
    class="flex w-full flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div class="flex min-h-10 items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)">
      <button
        v-if="expandable()"
        type="button"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        :data-testid="`${testId}__trigger`"
        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-elements) text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        @click="toggle"
      >
        <i
          class="pi pi-wrench shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span
          v-if="title"
          class="truncate text-label-sm text-(--text-default)"
        >
          {{ title }}
        </span>
        <code
          dir="ltr"
          class="truncate rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 text-label-code text-(--text-muted)"
          >{{ name }}</code
        >
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="pi pi-chevron-down ms-auto shrink-0 text-body-xs text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </button>
      <div
        v-else
        class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)"
      >
        <i
          class="pi pi-wrench shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span
          v-if="title"
          class="truncate text-label-sm text-(--text-default)"
        >
          {{ title }}
        </span>
        <code
          dir="ltr"
          class="truncate rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 text-label-code text-(--text-muted)"
          >{{ name }}</code
        >
      </div>
      <StatusIndicator
        :severity="severity"
        :loading="state === 'running'"
        :label="t(`toolCall.${state}`)"
        :data-testid="`${testId}__status`"
        class="shrink-0"
      />
    </div>
    <div
      v-if="expandable()"
      v-show="isOpen"
      :id="panelId"
      :data-testid="`${testId}__details`"
      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
    >
      <section
        v-if="slots.input"
        :aria-labelledby="`${uid}-input`"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <h4
          :id="`${uid}-input`"
          class="m-0 text-label-sm text-(--text-muted)"
        >
          {{ t('toolCall.input') }}
        </h4>
        <slot name="input" />
      </section>
      <section
        v-if="slots.output"
        :aria-labelledby="`${uid}-output`"
        class="flex flex-col gap-(--spacing-xs)"
      >
        <h4
          :id="`${uid}-output`"
          class="m-0 text-label-sm text-(--text-muted)"
        >
          {{ t('toolCall.output') }}
        </h4>
        <slot name="output" />
      </section>
    </div>
  </div>
</template>
