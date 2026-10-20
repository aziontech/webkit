<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import {
    resourceIcon,
    resourceLabel,
    resourceName,
    resourceNoun,
    resourceNounPlural
  } from '../../lib/data/releases'
  import ResourceVersionField from './ResourceVersionField.vue'

  interface Props {
    groups?: unknown[]
    detecting?: boolean
    detectingLabel?: string
    allowAdd?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    groups: () => [],
    detecting: false,
    detectingLabel: 'Detecting dependencies…',
    allowAdd: false,
    disabled: false
  })

  const emit = defineEmits<{
    'update-version': []
    'set-resource': []
    add: []
    remove: []
    build: []
  }>()

  const openGroups = ref([])
  watch(
    () => `${props.allowAdd}:${props.groups.map((group) => group.type).join('|')}`,
    () => {
      openGroups.value = props.allowAdd ? props.groups.map((group) => group.type) : []
    },
    { immediate: true }
  )

  const sharedIn = (group) => group.rows.filter((row) => row.sharedWith?.length > 0)
</script>

<template>
  <div
    v-if="detecting"
    class="flex items-center gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-sm)"
  >
    <Spinner class="size-4 shrink-0 text-(--text-muted)" />
    <span class="text-body-sm text-(--text-muted)">{{ detectingLabel }}</span>
  </div>

  <Accordion
    v-else
    v-model:value="openGroups"
    type="multiple"
  >
    <Accordion.Item
      v-for="group in groups"
      :key="group.type"
      :value="group.type"
    >
      <Accordion.Trigger>
        <span class="flex flex-1 items-center gap-(--spacing-xs)">
          <i
            :class="[resourceIcon(group.type), 'shrink-0 text-(--text-muted)']"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-(--text-default)">
            {{ resourceLabel(group.type) }}
          </span>
          <Badge
            :label="String(group.rows.length)"
            severity="warning"
            size="medium"
          />
        </span>
      </Accordion.Trigger>

      <Accordion.Content>
        <div
          class="flex min-w-0 flex-col gap-(--spacing-sm) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md)"
        >
          <Message
            v-if="sharedIn(group).length"
            severity="info"
            size="small"
            label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
          />

          <p
            v-if="!group.rows.length"
            class="text-body-sm text-(--text-muted)"
          >
            This release references no {{ resourceNounPlural(group.type) }}.
          </p>

          <div
            v-for="(row, index) in group.rows"
            :key="`${group.type}-${row.resourceId || index}`"
            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) p-(--spacing-sm)"
          >
            <div
              v-if="row.sharedWith?.length || allowAdd"
              class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
            >
              <Tooltip
                v-if="row.sharedWith?.length"
                :text="`Also referenced by ${row.sharedWith.join(' and ')}.`"
              >
                <Tag
                  label="Shared"
                  severity="info"
                  size="medium"
                  icon="pi pi-link"
                />
              </Tooltip>
              <span v-else />

              <Tooltip
                key="tooltip-2"
                v-if="allowAdd"
                text="Remove from this release"
              >
                <IconButton
                  icon="pi pi-times"
                  kind="text"
                  size="small"
                  :disabled="disabled"
                  :aria-label="`Remove ${resourceName(group.type, row.resourceId) || resourceLabel(group.type)} from this release`"
                  @click="emit('remove', group.type, index)"
                />
              </Tooltip>
            </div>

            <ResourceVersionField
              :type="group.type"
              :resource-id="row.resourceId"
              :version-id="row.versionId"
              :fixed="row.locked"
              :disabled="disabled"
              @update:resource-id="emit('set-resource', group.type, index, $event)"
              @update:version-id="emit('update-version', group.type, index, $event)"
              @build="(type, id) => emit('build', type, id)"
            />
          </div>

          <Dropdown
            v-if="allowAdd && group.addOptions?.length"
            placement="bottom-start"
            @select="(event, value) => emit('add', group.type, value)"
          >
            <Dropdown.Trigger>
              <Button
                class="self-start"
                :label="`Add ${resourceNoun(group.type)}`"
                kind="outlined"
                size="small"
                icon="pi pi-plus"
                :disabled="disabled"
              />
            </Dropdown.Trigger>
            <Dropdown.Group>
              <Dropdown.Option
                v-for="option in group.addOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </Dropdown.Group>
          </Dropdown>

          <p
            v-else-if="allowAdd"
            class="text-body-sm text-(--text-muted)"
          >
            Every {{ resourceNounPlural(group.type) }} in this workspace is already in this release.
          </p>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
