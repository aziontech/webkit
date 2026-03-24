<template>
  <div
    @click="setVisibility(true)"
    :class="disableVisibilityToggle ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <slot name="action" />
  </div>

  <div class="px-container">
    <Dialog
      v-model:visible="visible"
      dismissableMask
      closeOnEscape
      modal
      :showHeader="showHeader"
      @update:visible="onVisibleChange"
    >
      <template
        #header
        v-if="$slots.header"
      >
        <slot name="header" />
      </template>
      <div :class="{ 'border surface-border rounded': backgroundColor == 'outlined' }">
        <slot name="content" />
      </div>
      <template
        #footer
        v-if="$slots.footer"
      >
        <slot name="footer" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
  import Dialog from 'primevue/dialog'
  import { ref } from 'vue'

  const props = defineProps({
    backgroundColor: {
      type: String,
      required: false,
      default: 'default',
      options: ['outlined', 'default']
    },
    showHeader: {
      type: Boolean,
      required: false,
      default: true
    },
    disableVisibilityToggle: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const visible = ref(false)

  const setVisibility = function (visibility = true) {
    if (props.disableVisibilityToggle) return
    onVisibleChange(visibility)
    visible.value = visibility
  }

  const onVisibleChange = function (newValue) {
    emit('update:visible', newValue)
  }

  const emit = defineEmits(['update:visible'])
</script>
