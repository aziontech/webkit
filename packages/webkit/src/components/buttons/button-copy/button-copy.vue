<script setup>
  import Button from 'primevue/button'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const emit = defineEmits(['copy'])

  const props = defineProps({
    'data-testid': { type: String, default: 'button-copy' },
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    iconPos: {
      type: String,
      default: 'left'
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isCopyVisible: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    copiedLabel: {
      type: String,
      default: 'Copied'
    }
  })

  const copied = ref(false)
  let timeoutId = null

  const icon = computed(() => (copied.value ? 'pi pi-check' : 'pi pi-copy'))

  const labelText = computed(() => {
    if (!props.label) return undefined
    return copied.value ? props.copiedLabel : props.label
  })

  const ariaLabel = computed(() => labelText.value || 'Copy')

  const handleCopy = () => {
    copied.value = true
    emit('copy')
    navigator.clipboard.writeText(props.value)

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      copied.value = false
      timeoutId = null
    }, 2000)
  }

  onBeforeUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })
</script>

<style scoped>
  :deep(.p-button:focus) {
    box-shadow: none;
  }
</style>

<template>
  <div>
    <Button
      :icon="icon"
      :iconPos="iconPos"
      :data-testid="dataTestid"
      type="button"
      :aria-label="ariaLabel"
      :label="labelText"
      :outlined="outlined"
      :text="!outlined"
      :disabled="disabled"
      :size="size"
      @click="handleCopy"
      :class="['transition-opacity duration-200', isCopyVisible ? 'opacity-100' : 'opacity-0']"
    />
  </div>
</template>
