<script setup>
  import Menu from 'primevue/menu'
  import { ref } from 'vue'

  defineOptions({ name: 'Menu' })

  const props = defineProps({
    model: {
      type: Array,
      default: () => []
    },
    popup: {
      type: Boolean,
      default: false
    },
    appendTo: {
      type: [String, Object],
      default: 'body'
    },
    class: {
      type: String,
      default: ''
    },
    pt: {
      type: Object,
      default: undefined
    }
  })

  const emit = defineEmits(['show', 'hide'])

  const menuRef = ref(null)

  defineExpose({
    toggle: (...args) => menuRef.value?.toggle(...args),
    show: (...args) => menuRef.value?.show(...args),
    hide: (...args) => menuRef.value?.hide(...args)
  })
</script>

<template>
  <Menu
    ref="menuRef"
    :model="props.model"
    :popup="props.popup"
    :appendTo="props.appendTo"
    :class="props.class"
    :pt="props.pt"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template
      v-if="$slots.start"
      #start
    >
      <slot name="start" />
    </template>
    <template
      v-if="$slots.end"
      #end
    >
      <slot name="end" />
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
    <template
      v-if="$slots.submenuheader"
      #submenuheader="slotProps"
    >
      <slot
        name="submenuheader"
        v-bind="slotProps"
      />
    </template>
  </Menu>
</template>
