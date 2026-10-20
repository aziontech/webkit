<script setup lang="ts">
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import Tag from '@aziontech/webkit/tag'
  import { computed, useId } from 'vue'

  interface Props {
    kind: string
    icon?: string
    name?: string
    status: string
    severity?: string
    dashed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: '',
    name: '',
    severity: 'neutral',
    dashed: false
  })

  defineSlots<{
    identity(): unknown
    actions(): unknown
    default(): unknown
  }>()

  const open = defineModel('open', { type: Boolean, default: false })

  const tagSeverity = computed(() => (props.severity === 'neutral' ? 'secondary' : props.severity))

  const uid = useId()
  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`
</script>

<template>
  <div
    :data-state="open ? 'open' : 'closed'"
    :data-dashed="dashed || null"
    class="w-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-sm transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-dashed:border-dashed"
  >
    <FlowAnchor>
      <button
        :id="triggerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        class="group flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs) text-left outline-none transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
        @click="open = !open"
      >
        <i
          :class="icon"
          class="shrink-0 text-body-xs leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-label-sm text-(--text-muted)">{{ kind }}</span>
        <Tag
          class="ml-auto shrink-0"
          :severity="tagSeverity"
          :label="status"
          size="small"
        />
        <i
          class="pi pi-chevron-down shrink-0 text-(--text-muted) transition-transform duration-150 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </FlowAnchor>

    <div class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)">
      <slot name="identity">
        <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ name || '—' }}</span>
      </slot>
      <div
        v-if="$slots.actions"
        class="ml-auto flex shrink-0 items-center"
      >
        <slot name="actions" />
      </div>
    </div>

    <div
      :id="bodyId"
      role="region"
      :aria-labelledby="triggerId"
      :inert="!open || undefined"
      :data-state="open ? 'open' : 'closed'"
      class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="overflow-hidden">
        <div
          class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
