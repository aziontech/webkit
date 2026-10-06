<script setup lang="ts">
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  interface Props {
    items?: unknown[]
    noun?: string
    visible?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    noun: 'items',
    visible: 2
  })

  const shown = computed(() => props.items.slice(0, props.visible))
  const hiddenCount = computed(() => Math.max(0, props.items.length - props.visible))
</script>

<template>
  <span
    v-if="!items.length"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <span
    v-else
    class="flex min-w-0 items-center gap-(--spacing-xxs)"
  >
    <Tag
      v-for="item in shown"
      :key="item"
      severity="secondary"
      size="small"
      class="min-w-0 max-w-full"
    >
      <span class="min-w-0 truncate">{{ item }}</span>
    </Tag>

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="small"
    >
      <Popover.Trigger @click.stop>
        <Tooltip :text="`Show all ${items.length} ${noun}`">
          <Tag
            :label="`+${hiddenCount}`"
            :aria-label="`Show all ${items.length} ${noun}`"
            severity="secondary"
            size="small"
            class="shrink-0 cursor-pointer"
          />
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <p
          class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)"
        >
          {{ items.length }} {{ noun }}
        </p>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="item in items"
            :key="item"
            class="block truncate rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>
  </span>
</template>
