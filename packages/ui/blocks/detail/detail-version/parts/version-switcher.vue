<script setup lang="ts">
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailEnvironment, VersionDetailVersion } from '../detail-version.vue'
  import { ADD_VERSION, tagFor } from '../detail-version-states'

  export interface VersionSwitcherProps {
    /** Every version, newest first. */
    versions: VersionDetailVersion[]
    /** The environments; each version names the ones it is live in. */
    environments: VersionDetailEnvironment[]
    /** Id of the version the page is on. */
    viewedId: string
  }

  const props = defineProps<VersionSwitcherProps>()

  const emit = defineEmits<{
    pick: [value: unknown]
    add: [event: MouseEvent | KeyboardEvent]
  }>()

  const query = defineModel<string>('query', { required: true })

  const matches = computed(() =>
    props.versions.filter((entry) =>
      entry.name.toLowerCase().includes(query.value.trim().toLowerCase())
    )
  )
  const servedIn = (id: string) =>
    props.environments.filter((entry) => entry.serves === id).map((entry) => entry.name)
</script>

<template>
  <Select
    :model-value="viewedId"
    @update:model-value="(value) => emit('pick', value)"
    :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
    @update:open="
      (open) => {
        if (!open) query = ''
      }
    "
  >
    <Select.Trigger aria-label="Switch version" />
    <Select.Content>
      <template #search>
        <Input
          v-model="query"
          size="small"
          placeholder="Search versions"
          aria-label="Search versions"
          @keydown.home.stop
          @keydown.end.stop
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </template>
      <Select.Group label="Versions">
        <Select.Item
          v-for="entry in matches"
          :key="entry.id"
          :value="entry.id"
        >
          {{ entry.name }}
          <span
            v-if="servedIn(entry.id).length"
            class="text-body-xs text-(--text-muted)"
            >Live in {{ servedIn(entry.id).join(', ') }}</span
          >
          <template #tag>
            <Tag
              :label="tagFor(entry).label"
              :variant="tagFor(entry).variant"
              :severity="tagFor(entry).severity"
              :icon="tagFor(entry).icon"
              size="small"
            />
          </template>
        </Select.Item>
        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          No versions match "{{ query }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Item
          :value="ADD_VERSION"
          class="w-full"
          @click="(event: MouseEvent) => emit('add', event)"
          @keydown.enter="(event: KeyboardEvent) => emit('add', event)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="az az-circle-plus"
              aria-hidden="true"
            />
            Add Version
          </span>
        </Select.Item>
      </template>
    </Select.Content>
  </Select>
</template>
