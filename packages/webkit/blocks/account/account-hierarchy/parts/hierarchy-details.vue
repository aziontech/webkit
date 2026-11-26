<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'

  import type {
    AccountHierarchyResource,
    AccountHierarchyRoleBinding
  } from '../account-hierarchy.vue'
  import { plural, types } from '../hierarchy-model'

  export interface HierarchyDetailsProps {
    /** The prefix of the ids the panel labels itself with. */
    uid: string
    /** What the panel heading says. */
    detailsTitle: string
    /** How many resources are selected. */
    selectedCount: number
    /** The single selected resource, or null. */
    focused: AccountHierarchyResource | null
    /** Role bindings of the selected resource. */
    roleBindings: AccountHierarchyRoleBinding[]
  }

  defineProps<HierarchyDetailsProps>()

  const detailsTab = defineModel<string>('tab', { required: true })

  const emit = defineEmits<{
    'edit-labels': [resource: AccountHierarchyResource]
  }>()

  const openLabels = ([resource]: AccountHierarchyResource[]) => emit('edit-labels', resource)
</script>

<template>
  <aside
    :id="`${uid}-details`"
    :aria-labelledby="`${uid}-details-heading`"
    class="w-full shrink-0 2xl:w-(--container-xs)"
  >
    <Card>
      <template #default>
        <div class="flex flex-col gap-(--spacing-md)">
          <h2
            :id="`${uid}-details-heading`"
            class="text-title-sm text-(--text-default)"
            aria-live="polite"
          >
            {{ detailsTitle }}
          </h2>

          <Tabs v-model="detailsTab">
            <div class="flex w-full flex-col">
              <Tabs.List aria-label="Details">
                <Tabs.Trigger
                  value="permissions"
                  label="Permissions"
                />
                <Tabs.Trigger
                  value="labels"
                  label="Labels"
                />
              </Tabs.List>
              <div class="relative isolate w-full">
                <Tabs.Content value="permissions">
                  <EmptyState
                    v-if="!focused"
                    size="small"
                    icon="az az-sitemap"
                    :title="selectedCount ? 'Several resources selected' : 'Select a resource'"
                    :description="
                      selectedCount
                        ? 'Select a single resource to see its role bindings.'
                        : 'Select a resource to see its role bindings and labels.'
                    "
                  />
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Tag
                        :label="types[focused.type].label"
                        :icon="types[focused.type].icon"
                        :variant="types[focused.type].variant"
                        :severity="types[focused.type].severity"
                        size="small"
                      />
                      <span class="truncate text-label-md text-(--text-default)">{{
                        focused.name
                      }}</span>
                    </div>
                    <KeyValueList
                      variant="split"
                      aria-label="Role bindings"
                    >
                      <KeyValueList.Item
                        v-for="binding in roleBindings"
                        :key="binding.role"
                        :label="binding.role"
                        >{{ plural(binding.members, 'member', 'members') }}</KeyValueList.Item
                      >
                    </KeyValueList>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="labels">
                  <EmptyState
                    v-if="!focused"
                    size="small"
                    icon="az az-tag"
                    :title="selectedCount ? 'Several resources selected' : 'Select a resource'"
                    :description="
                      selectedCount
                        ? 'Select a single resource to see its labels.'
                        : 'Select a resource to see its role bindings and labels.'
                    "
                  />
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <ul
                      v-if="focused.labels?.length"
                      aria-label="Labels"
                      class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0"
                    >
                      <li
                        v-for="label in focused.labels"
                        :key="label"
                      >
                        <Tag
                          :label="label"
                          severity="neutral"
                          size="medium"
                        />
                      </li>
                    </ul>
                    <EmptyState
                      v-else
                      size="small"
                      icon="az az-tag"
                      title="No labels"
                      description="This resource has no labels."
                    />
                    <Button
                      label="Edit labels"
                      icon="az az-tag"
                      variant="outline"
                      size="small"
                      class="self-start"
                      @click="openLabels([focused])"
                    />
                  </div>
                </Tabs.Content>
              </div>
            </div>
          </Tabs>
        </div>
      </template>
    </Card>
  </aside>
</template>
