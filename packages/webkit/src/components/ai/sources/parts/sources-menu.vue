<script setup lang="ts">
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { SourcesGroup } from '../lib/sources-menu'
  import type { SourcesItem } from '../types'
  import SourcesButton from './sources-button.vue'
  import SourcesMark from './sources-mark.vue'

  defineOptions({ name: 'SourcesMenu', inheritAttrs: false })

  export interface SourcesMenuProps {
    /** Prefix of the test ids, the test id of the Sources root. */
    testId: string
    /** Up to three sources whose marks overlap at the start of the pill. */
    marks: SourcesItem[]
    /** Visible label of the pill. */
    heading: string
    /** Accessible name of the pill; empty leaves the visible label as its name. */
    triggerName?: string
    /** Rows of the panel, cited first. */
    groups: SourcesGroup[]
    /** Shows each group's label above its rows. */
    grouped?: boolean
  }

  withDefaults(defineProps<SourcesMenuProps>(), {
    triggerName: '',
    grouped: false
  })

  /** Open state of the panel. */
  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    side="auto"
    align="start"
    :data-testid="`${testId}__menu`"
    class="shrink-0"
  >
    <DropdownMenuTrigger :data-testid="`${testId}__host`">
      <SourcesButton
        :test-id="testId"
        :marks="marks"
        :heading="heading"
        :trigger-name="triggerName"
        :open="open"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup
      v-for="group in groups"
      :key="group.key"
      :label="grouped ? group.label : ''"
      :data-testid="`${testId}__group`"
    >
      <DropdownMenuItem
        v-for="row in group.rows"
        :key="`${row.index}-${row.item.title}`"
        :value="row.index"
        :label="row.item.title"
        :href="row.href"
        :target="row.external ? '_blank' : '_self'"
        :description="row.meta"
        :data-testid="`${testId}__item`"
      >
        <template #leading>
          <SourcesMark
            :item="row.item"
            size="medium"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
