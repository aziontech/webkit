<script setup lang="ts">
  import Badge from '@aziontech/webkit/badge'
  import CardBox from '@aziontech/webkit/card-box'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import { resourceIcon, resourceLabel } from '../../lib/data/releases'
  import ReleaseDependenciesSection from './ReleaseDependenciesSection.vue'
  import ResourceVersionField from './ResourceVersionField.vue'

  interface Props {
    cards?: unknown[]
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    cards: () => [],
    disabled: false
  })

  const dependencyCount = (card) =>
    (card.groups ?? []).reduce((total, group) => total + group.rows.length, 0)

  const emit = defineEmits<{
    'update-resource': []
    'update-version': []
    toggle: []
    'update-dependency-version': []
    'set-dependency-resource': []
    build: []
  }>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <section
      v-for="card in cards"
      :key="card.type"
      class="flex min-w-0 flex-col rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface)"
      :data-included="card.enabled || null"
    >
      <header
        class="flex min-h-14 min-w-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            :class="[resourceIcon(card.type), 'shrink-0 text-(--text-muted)']"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-(--text-default)">
            {{ resourceLabel(card.type) }}
          </span>
        </span>

        <span class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Tag
            key="tag-1"
            v-if="card.readonly"
            label="Read-only"
            severity="secondary"
            size="medium"
            icon="pi pi-lock"
          />
          <Tag
            key="tag-2"
            v-else-if="card.required"
            label="Required"
            severity="warning"
            size="medium"
          />

          <Tooltip
            v-if="card.canToggle"
            :text="
              card.enabled
                ? `Leave ${resourceLabel(card.type)} out of this release`
                : `Include ${resourceLabel(card.type)} in this release`
            "
          >
            <Switch
              :model-value="card.enabled"
              :disabled="disabled"
              :aria-label="`Include ${resourceLabel(card.type)} in this release`"
              @update:model-value="emit('toggle', card.type, $event)"
            />
          </Tooltip>
        </span>
      </header>

      <p
        v-if="!card.enabled"
        class="p-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        {{ card.note }}
      </p>

      <div
        v-else
        class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md)"
      >
        <p
          v-if="card.readonly"
          class="text-body-sm text-(--text-muted)"
        >
          Kept from the active release.
        </p>

        <ResourceVersionField
          :type="card.type"
          :resource-id="card.resourceId"
          :version-id="card.versionId"
          :fixed="card.readonly"
          :disabled="disabled || card.readonly"
          @update:resource-id="emit('update-resource', card.type, $event)"
          @update:version-id="emit('update-version', card.type, $event)"
          @build="(type, id) => emit('build', type, id)"
        />

        <CardBox
          v-if="card.groups?.length"
          :padded="false"
        >
          <template #header>
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-label-md text-(--text-default)">Dependencies</span>
              <Badge
                v-if="!card.detecting"
                :label="String(dependencyCount(card))"
                severity="warning"
                size="medium"
              />
            </span>
          </template>

          <template #content>
            <ReleaseDependenciesSection
              :groups="card.groups"
              :detecting="card.detecting"
              :detecting-label="card.detectingLabel"
              :disabled="disabled || card.readonly"
              @update-version="
                (type, index, versionId) =>
                  emit('update-dependency-version', card.type, type, index, versionId)
              "
              @set-resource="
                (type, index, resourceId) =>
                  emit('set-dependency-resource', card.type, type, index, resourceId)
              "
              @build="(type, id) => emit('build', type, id)"
            />
          </template>
        </CardBox>
      </div>
    </section>
  </div>
</template>
