<script setup>
  import PickList from 'primevue/picklist'

  defineOptions({ name: 'PickList' })

  const props = defineProps({
    modelValue: {
      type: Array,
      default: undefined
    },
    selection: {
      type: Array,
      default: undefined
    },
    dataKey: {
      type: String,
      default: undefined
    },
    metaKeySelection: {
      type: Boolean,
      default: false
    },
    showSourceControls: {
      type: Boolean,
      default: true
    },
    showTargetControls: {
      type: Boolean,
      default: true
    },
    responsive: {
      type: Boolean,
      default: true
    },
    breakpoint: {
      type: String,
      default: '960px'
    },
    moveToTargetProps: {
      type: Object,
      default: undefined
    },
    moveAllToTargetProps: {
      type: Object,
      default: undefined
    },
    moveToSourceProps: {
      type: Object,
      default: undefined
    },
    moveAllToSourceProps: {
      type: Object,
      default: undefined
    },
    class: {
      type: String,
      default: ''
    },
    sourceSelection: {
      type: Array,
      default: undefined
    },
    targetSelection: {
      type: Array,
      default: undefined
    },
    listStyle: {
      type: [String, Object],
      default: undefined
    },
    pt: {
      type: Object,
      default: undefined
    }
  })

  const emit = defineEmits([
    'update:modelValue',
    'update:selection',
    'reorder',
    'move-to-target',
    'move-all-to-target',
    'move-to-source',
    'move-all-to-source'
  ])
</script>

<template>
  <PickList
    :modelValue="props.modelValue"
    :selection="props.selection"
    :dataKey="props.dataKey"
    :metaKeySelection="props.metaKeySelection"
    :showSourceControls="props.showSourceControls"
    :showTargetControls="props.showTargetControls"
    :responsive="props.responsive"
    :breakpoint="props.breakpoint"
    :moveToTargetProps="props.moveToTargetProps"
    :moveAllToTargetProps="props.moveAllToTargetProps"
    :moveToSourceProps="props.moveToSourceProps"
    :moveAllToSourceProps="props.moveAllToSourceProps"
    :sourceSelection="props.sourceSelection"
    :targetSelection="props.targetSelection"
    :listStyle="props.listStyle"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
    @update:selection="emit('update:selection', $event)"
    @reorder="emit('reorder', $event)"
    @move-to-target="emit('move-to-target', $event)"
    @move-all-to-target="emit('move-all-to-target', $event)"
    @move-to-source="emit('move-to-source', $event)"
    @move-all-to-source="emit('move-all-to-source', $event)"
  >
    <template
      v-if="$slots.sourceheader"
      #sourceheader
    >
      <slot name="sourceheader" />
    </template>
    <template
      v-if="$slots.targetheader"
      #targetheader
    >
      <slot name="targetheader" />
    </template>
    <template
      v-if="$slots.item"
      #item="slotProps"
    >
      <slot
        name="item"
        v-bind="slotProps"
      />
    </template>
  </PickList>
</template>
