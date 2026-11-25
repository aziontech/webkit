<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailTab, VersionDetailVersion } from '../detail-version.vue'
  import { CREATING_TAG, tagFor, VERSION_TABS as tabs } from '../detail-version-states'

  export interface VersionTabBarProps {
    /** The version the page is on. */
    viewed: VersionDetailVersion
    /** Whether Version history is open. */
    historyExpanded: boolean
    /** A new version is being copied from the viewed one. */
    creating?: boolean
  }

  const props = withDefaults(defineProps<VersionTabBarProps>(), { creating: false })

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const activeTab = defineModel<VersionDetailTab>('tab', { required: true })

  const isDraft = computed(() => props.viewed.state === 'draft')
  const tag = computed(() => (props.creating ? CREATING_TAG : tagFor(props.viewed)))
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
        v-if="!isDraft && !creating && viewed.createdOn"
        class="hidden text-body-sm text-(--text-muted) md:inline"
      >
        Created {{ viewed.createdOn }}
      </span>
      <Tag
        :label="tag.label"
        :variant="tag.variant"
        :severity="tag.severity"
        :icon="tag.icon"
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
