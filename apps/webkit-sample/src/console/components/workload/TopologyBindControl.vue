<script setup lang="ts">
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  interface Props {
    target: Record<string, unknown>
    options?: unknown[]
    boundId?: string | number
    removable?: boolean
  }

  withDefaults(defineProps<Props>(), {
    options: () => [],
    boundId: '',
    removable: true
  })

  const emit = defineEmits<{
    bind: [value: unknown]
    remove: []
    create: []
  }>()

  const CREATE = '__create__'

  const onSelect = (event, value) => {
    if (value === CREATE) return emit('create')
    emit('bind', value)
  }
</script>

<template>
  <div class="flex shrink-0 items-center gap-(--spacing-xxs)">
    <Dropdown
      placement="bottom-end"
      @select="onSelect"
    >
      <Dropdown.Trigger>
        <Tooltip :text="boundId ? target.changeLabel : target.bindLabel">
          <IconButton
            :icon="boundId ? 'pi pi-pencil' : 'pi pi-plus'"
            kind="outlined"
            size="small"
            :aria-label="boundId ? target.changeLabel : target.bindLabel"
          />
        </Tooltip>
      </Dropdown.Trigger>

      <Dropdown.Group :label="options.length ? target.groupLabel : ''">
        <template
          v-if="!options.length"
          #top
        >
          <span class="text-body-xs text-(--text-muted)">{{ target.emptyLabel }}</span>
        </template>
        <Dropdown.Option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :selected="String(option.value) === String(boundId)"
        />
      </Dropdown.Group>

      <Dropdown.Group>
        <Dropdown.Option
          :value="CREATE"
          :label="target.createLabel"
        />
      </Dropdown.Group>
    </Dropdown>

    <Tooltip
      v-if="boundId && removable"
      :text="target.removeLabel"
    >
      <IconButton
        icon="pi pi-times"
        kind="outlined"
        size="small"
        :aria-label="target.removeLabel"
        @click="emit('remove')"
      />
    </Tooltip>
  </div>
</template>
