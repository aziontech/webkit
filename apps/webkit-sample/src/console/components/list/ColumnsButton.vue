<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Popover from '@aziontech/webkit/popover'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  interface Props {
    columns: unknown[]
    size?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'medium'
  })

  const model = defineModel<Record<string, unknown>>({ default: () => ({}) })

  const ROW_CLASS =
    'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none'

  const columnId = (column) => column.id ?? column.accessorKey

  const columnName = (column) => column.label ?? column.header

  const listedColumns = computed(() =>
    props.columns
      .filter((column) => column.kind !== 'action' && columnId(column) && columnName(column))
      .map((column) => ({
        id: columnId(column),
        label: columnName(column),
        locked: column.hideable === false
      }))
  )

  const isVisible = (id) => model.value[id] !== false

  const setVisible = (id, visible) => {
    const next = { ...model.value }
    if (visible) delete next[id]
    else next[id] = false
    model.value = next
  }

  const hiddenCount = computed(
    () => listedColumns.value.filter((column) => !isVisible(column.id)).length
  )

  const showAll = () => (model.value = {})

  const panelOpen = ref(false)
  const tipOpen = ref(false)
  watch(panelOpen, (open) => {
    if (open) tipOpen.value = false
  })
</script>

<template>
  <Popover
    v-model:open="panelOpen"
    placement="bottom-end"
    class="shrink-0"
  >
    <Popover.Trigger>
      <Tooltip
        v-model:open="tipOpen"
        text="Columns"
        :disabled="panelOpen"
      >
        <IconButton
          icon="ai ai-column"
          kind="outlined"
          :size="size"
          ariaLabel="Columns"
          data-testid="columns-button__trigger"
        />
      </Tooltip>
    </Popover.Trigger>

    <Popover.Content>
      <div class="flex flex-col">
        <div class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
          <p class="text-label-md text-(--text-default)">Columns</p>
        </div>

        <div
          class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
        >
          <label
            v-for="column in listedColumns"
            :key="column.id"
            :class="[
              ROW_CLASS,
              column.locked
                ? 'cursor-default text-(--text-muted)'
                : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'
            ]"
          >
            <Switch
              :model-value="isVisible(column.id)"
              :disabled="column.locked"
              :data-testid="`columns-button__switch-${column.id}`"
              @update:model-value="(value) => setVisible(column.id, !!value)"
            />
            <span class="min-w-0 truncate">{{ column.label }}</span>
            <span
              v-if="column.locked"
              class="ml-auto shrink-0 text-label-xs text-(--text-muted)"
              >Always shown</span
            >
          </label>
        </div>

        <div
          v-if="hiddenCount"
          class="border-t border-(--border-default) p-(--spacing-xxs)"
        >
          <Button
            label="Show all columns"
            kind="text"
            size="small"
            class="w-full"
            data-testid="columns-button__reset"
            @click="showAll"
          />
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>
