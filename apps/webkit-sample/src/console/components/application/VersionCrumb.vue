<script setup lang="ts">
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import { versionStateMeta } from '../../lib/data/versioning'

  interface VersionEntry {
    id: string
    name: string
    state: string
  }

  interface Props {
    /** Every version of the application, newest first. */
    versions?: VersionEntry[]
  }

  const props = withDefaults(defineProps<Props>(), {
    versions: () => []
  })

  const emit = defineEmits<{
    create: []
  }>()

  const model = defineModel<string>({ default: '' })

  const CREATE_VERSION = '__create-version__'

  const query = ref('')

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.versions
    return props.versions.filter((entry) => entry.name.toLowerCase().includes(needle))
  })

  const nameOf = (id: unknown) =>
    props.versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')

  const pick = (value: unknown) => {
    if (value === CREATE_VERSION) return emit('create')
    if (typeof value === 'string' && value !== model.value) model.value = value
  }

  const onOpen = (open: boolean) => {
    if (!open) query.value = ''
  }
</script>

<template>
  <Select
    :model-value="model"
    :display-value="nameOf"
    class="flex! w-auto! min-w-0"
    @update:model-value="pick"
    @update:open="onOpen"
  >
    <Select.Trigger
      aria-label="Switch version"
      class="h-6! w-auto! min-w-0 gap-(--spacing-xxs)! border-0! bg-transparent! px-(--spacing-xs)! text-label-md! hover:bg-(--bg-mask)! focus-visible:ring-offset-0! data-[state=open]:bg-(--bg-mask)!"
    />
    <Select.Content class="min-w-57">
      <template #search>
        <InputText
          v-model="query"
          size="small"
          placeholder="Search versions"
          aria-label="Search versions"
          @keydown.stop
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </template>
      <Select.Group label="Versions">
        <Select.Option
          v-for="entry in matches"
          :key="entry.id"
          :value="entry.id"
        >
          {{ entry.name }}
          <template #tag>
            <Tag
              :label="versionStateMeta(entry.state).label"
              :severity="versionStateMeta(entry.state).severity"
              :icon="versionStateMeta(entry.state).icon"
              size="small"
            />
          </template>
        </Select.Option>
        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
        >
          No versions match "{{ query }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Option
          :value="CREATE_VERSION"
          class="w-full"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="pi pi-plus-circle"
              aria-hidden="true"
            />
            Create new Version
          </span>
        </Select.Option>
      </template>
    </Select.Content>
  </Select>
</template>
