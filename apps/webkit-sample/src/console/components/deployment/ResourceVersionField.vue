<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, useId } from 'vue'

  import {
    hasDeployableVersion,
    LATEST_READY,
    resourceLabel,
    resourceName,
    resourceOptions,
    versionOptions
  } from '../../lib/data/releases'
  import { relativeTime } from '../../lib/format/relative-time'

  interface Props {
    type: string
    resourceId?: string
    versionId?: string
    fixed?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    resourceId: '',
    versionId: '',
    fixed: false,
    disabled: false
  })

  const emit = defineEmits<{
    'update:resourceId': []
    'update:versionId': []
    build: []
  }>()

  const scope = useId()
  const resourceFieldId = `${scope}-resource`
  const versionFieldId = `${scope}-version`

  const label = computed(() => resourceLabel(props.type))
  const options = computed(() => resourceOptions(props.type))
  const versions = computed(() => versionOptions(props.type, props.resourceId))
  const deployable = computed(() => hasDeployableVersion(props.type, props.resourceId))
  const name = computed(() => resourceName(props.type, props.resourceId))

  const resourceDisplay = (value) =>
    options.value.find((option) => option.value === value)?.label ?? ''

  const versionDisplay = (value) => {
    if (value === LATEST_READY) return 'latest Ready'
    return versions.value.find((option) => option.value === value)?.label ?? value
  }
</script>

<template>
  <div class="grid min-w-0 gap-(--spacing-sm) sm:grid-cols-2">
    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <Label
        :for="fixed ? undefined : resourceFieldId"
        :required="!fixed"
        >Resource</Label
      >

      <div
        v-if="fixed"
        class="flex min-h-9 min-w-0 items-center justify-between gap-(--spacing-xs) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) px-(--spacing-sm)"
      >
        <span class="truncate text-body-sm text-(--text-default)">{{ name }}</span>
        <i
          class="pi pi-lock shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
      </div>

      <Select
        v-else
        :model-value="resourceId"
        size="large"
        class="w-full"
        :placeholder="`Select ${label.toLowerCase()}`"
        :disabled="disabled"
        :display-value="resourceDisplay"
        @update:model-value="emit('update:resourceId', $event)"
      >
        <Select.Trigger :id="resourceFieldId" />
        <Select.Content>
          <Select.Option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>

    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <Label :for="versionFieldId">Version</Label>

      <Select
        :model-value="versionId"
        size="large"
        class="w-full"
        placeholder="Select a version"
        :disabled="disabled || !deployable"
        :required="!versionId"
        :display-value="versionDisplay"
        @update:model-value="emit('update:versionId', $event)"
      >
        <Select.Trigger
          :id="versionFieldId"
          :aria-describedby="`${versionFieldId}-message`"
        />
        <Select.Content>
          <Select.Option
            :value="LATEST_READY"
            icon="pi pi-sync"
          >
            Track latest Ready
            <template #tag>
              <span class="shrink-0 text-body-xs text-(--text-muted)">
                resolves at deploy
              </span>
            </template>
          </Select.Option>

          <Select.Group label="Pin a ready version">
            <Select.Option
              v-for="option in versions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
              <template #tag>
                <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tag
                    v-if="option.isCurrent"
                    label="Current"
                    severity="success"
                    size="medium"
                  />
                  <span class="text-body-xs text-(--text-muted)">
                    {{ relativeTime(option.createdAt) }}
                  </span>
                </span>
              </template>
            </Select.Option>
          </Select.Group>
        </Select.Content>
      </Select>

      <HelperText
        key="helper-text-1"
        v-if="!deployable"
        :id="`${versionFieldId}-message`"
        kind="invalid"
        :label="`${name || label} has no Ready version, so it cannot be deployed.`"
      />
      <HelperText
        key="helper-text-2"
        v-else-if="!versionId"
        :id="`${versionFieldId}-message`"
        kind="required"
        label="Select the version to deploy."
      />

      <Button
        v-if="!deployable"
        class="self-start"
        label="Build a version"
        kind="text"
        size="small"
        icon="pi pi-external-link"
        @click="emit('build', type, resourceId)"
      />
    </div>
  </div>
</template>
