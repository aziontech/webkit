<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  interface Props {
    items?: string[]
    noun?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    noun: 'arguments'
  })

  const first = computed(() => props.items[0] ?? '')
  const hiddenCount = computed(() => Math.max(0, props.items.length - 1))
  const copyValue = computed(() => props.items.join('\n'))
  const showAllLabel = computed(() => `Show all ${props.items.length} ${props.noun}`)
</script>

<template>
  <span
    v-if="!items.length"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <div
    v-else
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <span
      class="min-w-0 truncate text-body-sm text-(--text-default)"
      :title="first"
      >{{ first }}</span
    >

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="medium"
    >
      <Popover.Trigger @click.stop>
        <Tooltip :text="showAllLabel">
          <button
            type="button"
            :aria-label="showAllLabel"
            class="flex shrink-0 cursor-pointer rounded-(--shape-elements) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          >
            <Tag
              :label="`+${hiddenCount}`"
              severity="secondary"
              size="small"
            />
          </button>
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
            class="block break-all rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>

    <span class="ml-auto flex shrink-0">
      <CopyButton
        kind="outlined"
        :value="copyValue"
        :aria-label="items.length === 1 ? 'Copy argument' : `Copy ${items.length} arguments`"
        @click.stop
      />
    </span>
  </div>
</template>
