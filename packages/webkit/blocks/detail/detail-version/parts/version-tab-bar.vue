<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailTab, VersionDetailVersion } from '../detail-version.vue'
  import { tagFor, VERSION_TABS as tabs } from '../detail-version-states'

  export interface VersionTabBarProps {
    /** The version the page is on. */
    viewed: VersionDetailVersion
    /** Whether Version history is open. */
    historyExpanded: boolean
  }

  const props = defineProps<VersionTabBarProps>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const activeTab = defineModel<VersionDetailTab>('tab', { required: true })

  const isDraft = computed(() => props.viewed.state === 'draft')
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Trigger
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
    <template #actions>
      <span
        v-if="!isDraft && viewed.createdOn"
        class="hidden text-body-sm text-(--text-muted) md:inline"
      >
        Created {{ viewed.createdOn }}
      </span>
      <Tag
        :label="tagFor(viewed).label"
        :variant="tagFor(viewed).variant"
        :severity="tagFor(viewed).severity"
        :icon="tagFor(viewed).icon"
        size="medium"
      />
      <DropdownMenu
        side="bottom"
        align="end"
        @select="(event, value) => emit('select', event, value)"
      >
        <DropdownMenu.Trigger>
          <IconButton
            icon="az az-ellipsis"
            variant="ghost"
            size="small"
            aria-label="Version actions"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            v-if="isDraft"
            value="edit"
            label="Edit version info"
          >
            <template #leading>
              <i
                class="az az-pencil"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="history"
            :label="historyExpanded ? 'Hide version history' : 'Show version history'"
          >
            <template #leading>
              <i
                class="az az-history"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </template>
  </PageTabs>
</template>
