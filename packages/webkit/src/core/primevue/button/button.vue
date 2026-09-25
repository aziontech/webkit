<script setup>
  import Button from 'primevue/button'

  defineOptions({ name: 'Button' })

  const props = defineProps({
    label: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },
    iconPos: {
      type: String,
      default: 'left',
      validator: (val) => ['left', 'right', 'top', 'bottom'].includes(val)
    },
    iconClass: {
      type: String,
      default: undefined
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
    loading: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
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

  const emit = defineEmits(['click'])
</script>

<template>
  <Button
    :label="props.label"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :iconClass="props.iconClass"
    :severity="props.severity"
    :raised="props.raised"
    :rounded="props.rounded"
    :text="props.text"
    :outlined="props.outlined"
    :size="props.size"
    :disabled="props.disabled || props.loading"
    :loading="props.loading"
    :link="props.link"
    :class="props.class"
    :pt="props.pt"
    @click="emit('click', $event)"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </Button>
</template>
