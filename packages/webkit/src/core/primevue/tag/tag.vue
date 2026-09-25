<script setup>
  import PrimeTag from 'primevue/tag'

  defineOptions({ name: 'PrimeTag' })

  const props = defineProps({
    value: {
      type: String,
      default: undefined
    },
    severity: {
      type: String,
      default: undefined,
      validator: (val) =>
        ['secondary', 'success', 'info', 'warning', 'danger', 'contrast'].includes(val)
    },
    rounded: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: undefined
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
</script>

<template>
  <PrimeTag
    :value="props.value"
    :severity="props.severity"
    :rounded="props.rounded"
    :icon="props.icon"
    :class="props.class"
    :pt="props.pt"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </PrimeTag>
</template>
