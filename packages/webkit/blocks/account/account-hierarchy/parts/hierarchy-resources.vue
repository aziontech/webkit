<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'

  import type { AccountHierarchyResource } from '../account-hierarchy.vue'
  import type { ResourceNode } from '../hierarchy-model'
  import HierarchyResourcesTable from './hierarchy-resources-table.vue'

  export interface HierarchyResourcesProps {
    /** The prefix of the ids the section labels itself with. */
    uid: string
    /** Why the resources could not load. */
    error: string
    /** A request is in flight. */
    loading: boolean
    /** How many resources the account holds. */
    itemCount: number
    /** How many resources are selected. */
    selectedCount: number
    /** The search, trimmed and lower-cased. */
    needle: string
    /** The tree the table shows, pruned by the search. */
    visibleTree: ResourceNode[]
    /** The id of the workspace the person is in. */
    currentId: string
  }

  defineProps<HierarchyResourcesProps>()

  const query = defineModel<string>('query', { required: true })
  const tableExpanded = defineModel<string[]>('openKeys', { required: true })
  const selectedKeys = defineModel<string[]>('selectedKeys', { required: true })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    'row-action': [value: DropdownMenuItemValue, row: AccountHierarchyResource]
  }>()

  const clearSelection = () => {
    selectedKeys.value = []
  }
  const clearQuery = () => {
    query.value = ''
  }
</script>

<template>
  <section
    :aria-labelledby="`${uid}-resources`"
    class="flex min-w-0 flex-1 flex-col gap-(--spacing-sm)"
  >
    <div class="flex min-h-8 items-center justify-between gap-(--spacing-xs)">
      <h2
        :id="`${uid}-resources`"
        class="text-heading-xs text-(--text-default)"
      >
        Resources
      </h2>
      <Button
        v-if="selectedCount"
        label="Clear selection"
        variant="ghost"
        size="small"
        @click="clearSelection"
      />
    </div>

    <Alert
      v-if="error"
      severity="danger"
    >
      {{ error }}
      <template #actions>
        <Button
          label="Retry"
          variant="secondary"
          size="small"
          @click="emit('retry', $event)"
        />
      </template>
    </Alert>

    <Card
      key="card-1"
      v-else-if="!loading && !itemCount"
      :padded="false"
    >
      <template #default>
        <EmptyState
          size="medium"
          icon="az az-sitemap"
          title="No resources yet"
          description="Create a workspace, then group workspaces under organizations and groups to share role bindings."
        >
          <template #actions>
            <Button
              label="Create Workspace"
              icon="az az-plus"
              variant="secondary"
              size="small"
              href="/account/resources/new"
            />
          </template>
        </EmptyState>
      </template>
    </Card>

    <template v-else>
      <Input
        v-model="query"
        placeholder="Search by name, ID, type or label"
        aria-label="Search resources"
        class="w-full"
      >
        <template #leading>
          <i
            class="az az-search"
            aria-hidden="true"
          />
        </template>
      </Input>

      <Card
        key="card-3"
        v-if="needle && !visibleTree.length"
        :padded="false"
      >
        <template #default>
          <EmptyState
            size="small"
            icon="az az-search"
            title="No matching resources"
            :description="`No resource matches “${query.trim()}”.`"
          >
            <template #actions>
              <Button
                label="Clear search"
                variant="outline"
                size="small"
                @click="clearQuery"
              />
            </template>
          </EmptyState>
        </template>
      </Card>

      <HierarchyResourcesTable
        key="card-2"
        v-else
        v-model:open-keys="tableExpanded"
        v-model:selected-keys="selectedKeys"
        :visible-tree="visibleTree"
        :current-id="currentId"
        :loading="loading"
        :labelledby="`${uid}-resources`"
        @row-action="(value, row) => emit('row-action', value, row)"
      />
    </template>

    <Link
      label="Resources pending deletion"
      size="medium"
      href="/account/resources/pending-deletion"
      class="self-start"
    />
  </section>
</template>
