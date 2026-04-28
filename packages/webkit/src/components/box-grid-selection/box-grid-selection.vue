<script setup>
  defineOptions({
    name: 'BoxGridSelection'
  })

  defineProps({
    modelValue: {
      type: [String, Number],
      default: null
    },
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        return items.every((item) => 'value' in item && 'label' in item)
      }
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const handleSelect = (value) => {
    emit('update:modelValue', value)
  }
</script>

<template>
  <div
    class="box-grid-selection flex flex-wrap items-center gap-2"
    role="radiogroup"
  >
    <div
      v-for="item in items"
      :key="item.value"
      class="box-item border rounded-md px-4 py-3 transition-colors shrink-0"
      :class="
        modelValue === item.value
          ? 'border-2 border-primary bg-primary-mask'
          : 'border-subtle bg-surface hover:bg-surfaceRaised cursor-pointer'
      "
      role="radio"
      :aria-checked="String(modelValue === item.value)"
      :aria-label="item.ariaLabel || item.label"
      tabindex="0"
      @click="handleSelect(item.value)"
      @keydown.enter.prevent="handleSelect(item.value)"
      @keydown.space.prevent="handleSelect(item.value)"
    >
      <slot
        name="default"
        :item="item"
        :selected="modelValue === item.value"
      >
        <div class="flex flex-col gap-[2px]">
          <div class="flex items-center gap-2">
            <i
              v-if="item.icon"
              :class="item.icon"
              class="text-sm text-default"
            />
            <span class="text-xs leading-[1.3] font-medium text-default">{{ item.label }}</span>
          </div>
          <p
            v-if="item.description"
            class="text-xs leading-4 text-muted"
          >
            {{ item.description }}
          </p>
          <slot
            name="tag"
            :item="item"
            :selected="modelValue === item.value"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  .box-item {
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;
  }
</style>
