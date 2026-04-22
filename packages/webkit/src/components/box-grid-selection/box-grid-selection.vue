<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 3
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const columnsClass = computed(() => {
    if (props.columns <= 1) return 'grid-cols-1'
    if (props.columns === 2) return 'grid-cols-2'
    if (props.columns === 4) return 'grid-cols-4'
    return 'grid-cols-3'
  })

  const isSelected = (item) => item?.value === props.modelValue

  const isItemDisabled = (item) => props.disabled || item?.disabled

  const getCardClasses = (item) => {
    if (isItemDisabled(item)) {
      return 'border surface-border surface-section opacity-50 cursor-not-allowed'
    }

    return isSelected(item)
      ? 'cursor-pointer border-2 border-primary bg-primary-mask'
      : 'cursor-pointer border surface-border surface-section'
  }

  const getIconClass = (item) => {
    if (isSelected(item)) {
      return 'text-sm leading-[14px] text-primary'
    }

    return 'text-sm leading-[14px] text-muted'
  }

  const getTextClass = (item) => (isSelected(item) ? 'text-default' : 'text-muted')

  const getAriaLabel = (item) => item?.ariaLabel || item?.description || String(item?.value || '')

  const handleSelect = (item) => {
    if (isItemDisabled(item)) return

    emit('update:modelValue', item.value)
    emit('change', item)
  }

  const getEdgeRadiusClass = (index) => {
    if (index === 0) return 'rounded-l-[6px]'
    if (index === props.items.length - 1) return 'rounded-r-[6px]'

    return 'rounded-none'
  }
</script>

<template>
  <div
    class="grid"
    :class="columnsClass"
    style="row-gap: 0; column-gap: 0"
    role="radiogroup"
    :aria-disabled="disabled"
  >
    <div
      v-for="(item, index) in items"
      :key="item.value"
      class="flex flex-1 flex-col items-start gap-2.5 px-4 py-3 transition-all h-[160px]"
      :class="[getCardClasses(item), getEdgeRadiusClass(index)]"
      role="radio"
      :aria-checked="isSelected(item)"
      :aria-disabled="isItemDisabled(item)"
      :aria-label="getAriaLabel(item)"
      :tabindex="isItemDisabled(item) ? -1 : 0"
      @click="handleSelect(item)"
      @keypress.enter="handleSelect(item)"
      @keypress.space.prevent="handleSelect(item)"
    >
      <div class="w-[14px] h-[14px] shrink-0 flex items-center justify-center">
        <i
          v-if="item.icon"
          :class="[item.icon, getIconClass(item)]"
        ></i>
      </div>

      <div class="flex flex-col h-full justify-between gap-2 w-full">
        <p
          class="w-full font-sans text-xs font-normal leading-[1.3]"
          :class="getTextClass(item)"
        >
          {{ item.description }}
        </p>

        <slot
          name="tag"
          :item="item"
          :selected="isSelected(item)"
        ></slot>
      </div>
    </div>
  </div>
</template>
