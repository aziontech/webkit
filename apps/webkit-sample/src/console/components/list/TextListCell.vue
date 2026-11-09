<script setup lang="ts">
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  defineOptions({ name: 'TextListCell', inheritAttrs: false })

  interface Props {
    /** Values shown in the cell: the first one inline, every one in the overflow popover. */
    items?: string[]
    /** Plural noun the popover summary counts, such as threat types. */
    noun?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    noun: 'items'
  })

  const hiddenCount = computed(() => Math.max(0, props.items.length - 1))
  const summary = computed(() => `${props.items.length} ${props.noun}`)
</script>

<template>
  <span
    v-if="!items.length"
    v-bind="$attrs"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <span
    v-else
    v-bind="$attrs"
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <span class="min-w-0 truncate text-body-sm text-(--text-default)">{{ items[0] }}</span>

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="small"
    >
      <Popover.Trigger @click.stop>
        <Tag
          :label="`+${hiddenCount}`"
          severity="secondary"
          size="small"
          class="shrink-0 cursor-pointer"
        />
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <div class="flex max-h-(--container-xs) flex-col overflow-auto overscroll-contain p-(--spacing-xxs)">
          <p class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)">
            {{ summary }}
          </p>
          <span
            v-for="item in items"
            :key="item"
            class="truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>
  </span>
</template>
