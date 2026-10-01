<script setup>
  import Flow from '@aziontech/webkit/flow'
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import Tag from '@aziontech/webkit/tag'

  defineProps({
    eyebrow: { type: String, default: '' },
    icon: { type: String, default: '' },
    title: { type: String, default: '' },
    label: { type: String, default: '' },
    severity: { type: String, default: 'secondary' },
    terminal: { type: Boolean, default: false }
  })
</script>

<template>
  <Flow.Node
    unstyled
    :terminal="terminal"
    class="flex w-full flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none"
  >
    <FlowAnchor>
      <div
        class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
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
        <Tag
          v-if="label"
          class="ml-auto shrink-0"
          :severity="severity"
          :label="label"
          size="small"
        />
      </div>
    </FlowAnchor>

    <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
      <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ title || '—' }}</span>
      <span
        v-if="$slots.actions"
        class="ml-auto flex shrink-0 items-center"
      >
        <slot name="actions" />
      </span>
    </div>

    <div
      v-if="$slots.default"
      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
    >
      <slot />
    </div>
  </Flow.Node>
</template>
