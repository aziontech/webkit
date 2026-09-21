<script setup>
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  defineProps({
    /** A `TOPOLOGY_BIND_TARGETS` entry — every label on this control comes from it. */
    target: { type: Object, required: true },
    /** Bindable resources, `{ value, label }`. */
    options: { type: Array, default: () => [] },
    /** The resource this slot holds, by id. Empty turns the pencil into a plus. */
    boundId: { type: [String, Number], default: '' },
    /**
     * Whether the slot may be emptied. A resource the create provisioned is part of how
     * the workload was made, so it can be re-pointed but not taken away.
     */
    removable: { type: Boolean, default: true }
  })

  /**
   * `bind` carries the picked resource id, `remove` empties the slot, and `create`
   * leaves for the resource's own create page.
   */
  const emit = defineEmits(['bind', 'remove', 'create'])

  const CREATE = '__create__'

  const onSelect = (event, value) => {
    if (value === CREATE) return emit('create')
    emit('bind', value)
  }
</script>

<template>
  <div class="flex shrink-0 items-center gap-(--spacing-xxs)">
    <!-- `bottom-end`: the control sits at the node's right edge and a node column is
         ~216px, so a panel anchored by its left edge would hang off the diagram. -->
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
