<template>
  <div
    class="flex items-center gap-2 justify-end"
    data-testid="data-table-row-actions"
  >
    <div class="flex justify-end">
      <PrimeMenu
        :ref="setMenuRef"
        id="overlay_menu"
        v-bind:model="menuActions"
        :popup="true"
        data-testid="data-table-row-actions-menu"
      />
      <PrimeButton
        v-tooltip.top="{ value: 'Actions', showDelay: 200 }"
        size="small"
        icon="pi pi-ellipsis-v"
        outlined
        @click="handleMenuToggle"
        data-testid="data-table-row-actions-menu-button"
        class="table-button"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import PrimeButton from 'primevue/button'
  import PrimeMenu from 'primevue/menu'

  defineOptions({ name: 'DataTableRowActions' })

  const props = defineProps({
    rowData: {
      type: Object,
      required: true
    },
    actions: {
      type: [Array, Function],
      required: true
    },
    onActionExecute: {
      type: Function,
      default: () => {}
    },
    onMenuToggle: {
      type: Function,
      default: () => {}
    },
    menuRefSetter: {
      type: Function,
      default: null
    }
  })

  const menuRef = ref(null)

  const menuActions = computed(() => {
    if (typeof props.actions === 'function') {
      return props.actions(props.rowData)
    }
    return props.actions || []
  })

  const handleMenuToggle = (event) => {
    props.onMenuToggle(event, props.rowData.id)
  }

  const setMenuRef = (el) => {
    menuRef.value = el
    if (props.menuRefSetter && props.rowData.id) {
      props.menuRefSetter(props.rowData.id)(el)
    }
  }
</script>
