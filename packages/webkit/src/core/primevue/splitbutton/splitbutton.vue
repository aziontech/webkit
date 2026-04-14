<script setup>
  import SplitButton from 'primevue/splitbutton'

  defineOptions({ name: 'SplitButton' })

  const props = defineProps({
    label: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },
    model: {
      type: Array,
      default: () => []
    },
    severity: {
      type: String,
      default: undefined,
      validator: (val) =>
        ['secondary', 'success', 'info', 'warning', 'danger', 'contrast'].includes(val)
    },
    raised: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: undefined,
      validator: (val) => ['small', 'large'].includes(val)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['click'])
</script>

<template>
  <SplitButton
    :label="props.label"
    :icon="props.icon"
    :model="props.model"
    :severity="props.severity"
    :raised="props.raised"
    :rounded="props.rounded"
    :text="props.text"
    :outlined="props.outlined"
    :size="props.size"
    :disabled="props.disabled"
    :class="props.class"
    @click="emit('click')"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </SplitButton>
</template>
