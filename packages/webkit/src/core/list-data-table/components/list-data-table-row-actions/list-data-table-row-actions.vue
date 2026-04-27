<script setup>
  import PrimeButton from 'primevue/button'
  import PrimeMenu from 'primevue/menu'
  import { computed, ref } from 'vue'

  const props = defineProps({
    rowData: {
      type: Object,
      required: true
    },
    actions: {
      type: [Array, Function],
      required: true
    },
    /**
     * When set, renders a single inline button instead of the ellipsis menu.
     * Accepts an object with:
     *   - icon: string (e.g. 'pi pi-trash', 'pi pi-pencil')
     *   - label: string (used as tooltip)
     *   - command: function(rowData) — action to execute on click
     *   - disabled: boolean | function(rowData)
     *
     * Example: :inlineAction="{ icon: 'pi pi-trash', label: 'Delete', command: handleDelete }"
     */
    inlineAction: {
      type: Object,
      default: null
    },
    onActionExecute: {
      type: Function,
      default: null
    },
    onMenuToggle: {
      type: Function,
      default: null
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

  const resolvedInlineDisabled = computed(() => {
    if (!props.inlineAction) return false
    if (typeof props.inlineAction.disabled === 'function') {
      return props.inlineAction.disabled(props.rowData)
    }
    return !!props.inlineAction.disabled
  })

  const inlineTooltip = computed(() => {
    if (!props.inlineAction?.label) return null
    return { value: props.inlineAction.label, showDelay: 200 }
  })

  const executeInlineAction = () => {
    if (!props.inlineAction?.command) return
    props.inlineAction.command(props.rowData)
  }

  const handleMenuToggle = (event) => {
    if (props.onMenuToggle && props.menuRefSetter) {
      props.onMenuToggle(event, props.rowData.id)
    } else {
      menuRef.value?.toggle(event)
    }
  }

  const setMenuRef = (el) => {
    menuRef.value = el
    if (props.menuRefSetter && props.rowData.id) {
      props.menuRefSetter(props.rowData.id)(el)
    }
  }
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <!-- Inline mode: show direct button with action icon (opt-in via prop) -->
    <div
      v-if="inlineAction"
      class="flex justify-end"
      data-testid="data-table-actions-column-body-action"
    >
      <PrimeButton
        size="small"
        outlined
        :icon="inlineAction.icon || 'pi pi-ellipsis-v'"
        :disabled="resolvedInlineDisabled"
        v-tooltip.top="inlineTooltip"
        @click="executeInlineAction"
        class="cursor-pointer table-button"
        data-testid="data-table-actions-column-body-action-button"
      />
    </div>
    <!-- Default mode: ellipsis menu -->
    <div
      v-else
      class="flex justify-end"
      data-testid="data-table-actions-column-body-actions"
    >
      <PrimeMenu
        :ref="setMenuRef"
        id="overlay_menu"
        v-bind:model="menuActions"
        :popup="true"
        data-testid="data-table-actions-column-body-actions-menu"
        :pt="{
          menuitem: ({ context }) => ({
            'data-testid': `data-table__actions-menu-item__${context.item?.label}-button`
          })
        }"
      />
      <PrimeButton
        v-tooltip.top="{ value: 'Actions', showDelay: 200 }"
        size="small"
        icon="pi pi-ellipsis-v"
        outlined
        @click="handleMenuToggle"
        data-testid="data-table-actions-column-body-actions-menu-button"
        class="cursor-pointer table-button"
      />
    </div>
  </div>
</template>
