<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { chosenVersion } from '../../lib/data/releases'
  import VersionPicker from './VersionPicker.vue'

  interface VersionChoice {
    id: string
    name: string
    author?: string
    active?: boolean
    fresh?: boolean
  }

  interface Status {
    label: string
    severity: string
  }

  interface Props {
    name: string
    label?: string
    icon: string
    kind?: 'inline' | 'outline'
    versions?: VersionChoice[]
    status?: Status | null
    note?: string
    disabled?: boolean
    nested?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'inline',
    label: '',
    versions: () => [],
    status: null,
    note: '',
    disabled: false,
    nested: false
  })

  const model = defineModel<string>({ default: '' })

  const version = computed(() => chosenVersion(props.versions, model.value))

  const description = computed(() => props.note || version.value?.name || '')
</script>

<template>
  <Item
    :kind="kind"
    size="small"
  >
    <Item.Media>
      <span
        v-if="nested"
        class="flex size-5 items-center justify-center"
      >
        <i
          :class="icon"
          class="text-body-xs text-(--text-muted)"
          aria-hidden="true"
        />
      </span>
      <span
        v-else
        class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <i
          :class="icon"
          class="text-body-xs text-(--text-default)"
          aria-hidden="true"
        />
      </span>
    </Item.Media>
    <Item.Content>
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <span
          v-if="label"
          class="shrink-0 text-body-sm text-(--text-muted)"
        >
          {{ label }}
        </span>
        <Item.Title class="truncate">{{ name }}</Item.Title>
        <Tag
          v-if="!note"
          :label="version ? 'Ready' : 'No ready version'"
          :severity="version ? 'success' : 'warning'"
          size="small"
          class="shrink-0"
        />
        <Tag
          v-if="status"
          :label="status.label"
          :severity="status.severity"
          size="small"
          class="shrink-0"
        />
      </span>
      <Item.Description
        v-if="description"
        class="truncate"
      >
        {{ description }}
      </Item.Description>
    </Item.Content>
    <Item.Actions v-if="!note">
      <VersionPicker
        :model-value="version?.id ?? ''"
        :versions="versions"
        :disabled="disabled"
        @update:model-value="(id) => (model = id)"
      />
    </Item.Actions>
  </Item>
</template>
