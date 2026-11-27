<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import DropdownMenu from '@aziontech/ui/dropdown-menu'
  import Input from '@aziontech/ui/input'
  import Tag from '@aziontech/ui/tag'
  import { useLocale } from '@aziontech/ui/use-locale'

  import type { DeployDrawerDependency } from '../types'

  export interface VersionPickerProps {
    /** The resource whose Ready versions the menu lists. */
    row: DeployDrawerDependency
    /** The version picked now, marked selected. */
    selectedId?: string
  }

  withDefaults(defineProps<VersionPickerProps>(), { selectedId: '' })

  const emit = defineEmits<{
    pick: [id: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const versionSummary = (row: DeployDrawerDependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    side="bottom"
    align="end"
    @select="(_event, id) => emit('pick', String(id))"
  >
    <DropdownMenu.Trigger>
      <Button
        label="Change version"
        :aria-label="`Change version of ${row.name}`"
        variant="outline"
        size="small"
        icon="az az-chevron-down"
        icon-position="trailing"
        :disabled="!row.versions.length"
      />
    </DropdownMenu.Trigger>
    <template #header>
      <div class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)">
        <p class="text-label-sm text-(--text-muted)">
          {{ versionSummary(row) }}
        </p>
        <Input
          v-if="row.total > row.versions.length"
          size="medium"
          placeholder="Search versions"
          aria-label="Search versions"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
    </template>
    <DropdownMenu.Group>
      <DropdownMenu.Item
        v-for="entry in row.versions"
        :key="entry.id"
        :value="entry.id"
        :label="entry.name"
        :selected="entry.id === selectedId"
        :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${ago(entry.createdAt)}`"
      >
        <template #leading>
          <Avatar
            :alt="entry.author"
            :label="entry.author"
            size="small"
            variant="square"
          />
        </template>
        <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
          <span class="truncate">{{ entry.name }}</span>
          <Tag
            v-if="entry.active"
            label="Active"
            severity="success"
            size="small"
            class="shrink-0"
          />
        </span>
        <template #trailing>
          <span class="text-body-xs text-(--text-muted)">{{ ago(entry.createdAt) }}</span>
        </template>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <template
      v-if="row.total > row.versions.length"
      #bottom
    >
      <div class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)">
        <Button
          :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
          variant="ghost"
          size="small"
          class="w-full"
        />
      </div>
    </template>
  </DropdownMenu>
</template>
