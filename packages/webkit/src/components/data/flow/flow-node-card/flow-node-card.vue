<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import Tag, { type TagSeverity } from '../../../tag/tag.vue'
  import FlowAnchor from '../flow-anchor/flow-anchor.vue'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowNodeCard',
    inheritAttrs: false
  })

  /** Severity the node's state word is painted with. */
  export type FlowNodeCardSeverity = TagSeverity

  const props = withDefaults(
    defineProps<{
      /** The node's class in the diagram, rendered as the card's overline. */
      eyebrow?: string
      /** Icon name rendered beside the eyebrow. */
      icon?: string
      /** The resource's own name, on the identity row; the `title` slot replaces it. */
      title?: string
      /** State word rendered in the header tag; the `status` slot replaces it. */
      label?: string
      /** Severity the state word is painted with. */
      severity?: FlowNodeCardSeverity
      /** Collapse the body behind the header, which becomes a disclosure trigger. */
      collapsible?: boolean
      /** Draw the frame dashed — the register for a position that is still unfilled. */
      dashed?: boolean
      /** Marks the node disabled; adjacent connectors render at reduced opacity. */
      disabled?: boolean
      /** Ends its branch: the node receives an incoming connector but originates none. */
      terminal?: boolean
    }>(),
    {
      eyebrow: '',
      icon: '',
      title: '',
      label: '',
      severity: 'secondary',
      collapsible: false,
      dashed: false,
      disabled: false,
      terminal: false
    }
  )

  /** Whether the body is disclosed. Uncontrolled until the consumer binds it. */
  const open = defineModel<boolean>('open', { default: false })

  const slots = defineSlots<{
    /** The node's fields, inside the body. */
    default(): unknown
    /** Replaces the name on the identity row — a link out to the resource, typically. */
    title?(): unknown
    /** Replaces the state tag in the header row. */
    status?(): unknown
    /** Controls on the identity row, trailing the name. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)
  const uid = useId()

  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__node-card`
  )

  const ROOT_CLASS =
    'group relative z-1 flex w-full animate-flow-node-enter [animation-delay:var(--flow-node-enter-delay,calc(var(--flow-index,0)*var(--flow-enter-step,0ms)))] flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) text-(--text-default) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-[dashed]:border-dashed data-[disabled]:text-(--text-disabled) data-[disabled]:opacity-60 motion-reduce:animate-none motion-reduce:transition-none'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  const hasBody = computed<boolean>(() => Boolean(slots.default))
  const disclosure = computed<boolean>(() => props.collapsible && hasBody.value)

  const toggle = () => {
    if (disclosure.value) open.value = !open.value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    role="listitem"
    data-flow-kind="node"
    :data-flow-disabled="disabled ? 'true' : null"
    :data-flow-terminal="terminal ? 'true' : null"
    :data-disabled="disabled || null"
    :data-dashed="dashed || null"
    :data-collapsible="disclosure || null"
    :data-state="open ? 'open' : 'closed'"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :class="rootClass"
  >
    <FlowAnchor>
      <component
        :is="disclosure ? 'button' : 'div'"
        :id="disclosure ? triggerId : undefined"
        :type="disclosure ? 'button' : undefined"
        :aria-expanded="disclosure ? open : undefined"
        :aria-controls="disclosure ? bodyId : undefined"
        :data-state="open ? 'open' : 'closed'"
        class="flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs) text-left outline-none transition-colors duration-moderate-01 ease-productive-entrance focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset group-data-[collapsible]:hover:bg-(--bg-hover) motion-reduce:transition-none"
        @click="toggle"
      >
        <i
          v-if="icon"
          :class="icon"
          aria-hidden="true"
          class="shrink-0 text-label-sm leading-none text-(--text-muted)"
        />
        <span
          v-if="eyebrow"
          class="truncate text-label-sm text-(--text-muted)"
          >{{ eyebrow }}</span
        >
        <span class="ml-auto flex shrink-0 items-center gap-(--spacing-xxs)">
          <slot name="status">
            <Tag
              v-if="label"
              :severity="severity"
              :label="label"
              size="small"
            />
          </slot>
          <i
            v-if="disclosure"
            aria-hidden="true"
            class="pi pi-chevron-down text-(--text-muted) transition-transform duration-moderate-01 ease-productive-entrance group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </component>
    </FlowAnchor>

    <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
      <slot name="title">
        <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ title || '—' }}</span>
      </slot>
      <span
        v-if="slots.actions"
        class="ml-auto flex shrink-0 items-center"
      >
        <slot name="actions" />
      </span>
    </div>

    <div
      v-if="hasBody"
      :id="bodyId"
      role="region"
      :aria-labelledby="disclosure ? triggerId : undefined"
      :inert="disclosure && !open ? true : undefined"
      :data-state="open ? 'open' : 'closed'"
      class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance group-data-[collapsible]:grid-rows-[0fr] group-data-[collapsible]:data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="overflow-hidden">
        <div
          class="flex flex-col gap-(--spacing-sm) border-t border-solid border-[length:var(--border-width-default,1px)] border-(--border-muted) p-(--spacing-md)"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
