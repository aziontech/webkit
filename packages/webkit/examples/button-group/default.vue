<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const wrap = ref(false)
  const last = ref('')

  const items = [
    { id: 'copy', label: 'Copy code', icon: 'pi pi-copy' },
    { id: 'format', label: 'Format document', icon: 'pi pi-align-left' },
    { id: 'wrap', type: 'toggle', label: 'Wrap lines', icon: 'pi pi-arrows-h' },
    {
      id: 'download',
      type: 'menu',
      label: 'Download',
      icon: 'pi pi-download',
      options: [
        { id: 'download-js', label: 'Download as .js' },
        { id: 'download-zip', label: 'Download as .zip' }
      ]
    }
  ]

  const resolved = computed(() =>
    items.map((item) => (item.type === 'toggle' ? { ...item, pressed: wrap.value } : item))
  )

  const onToggle = ({ id, pressed }) => {
    if (id === 'wrap') wrap.value = pressed
    last.value = `${id}: ${pressed ? 'on' : 'off'}`
  }
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-sm)">
    <ButtonGroup
      :items="resolved"
      aria-label="Editor actions"
      @click="({ id }) => (last = id)"
      @toggle="onToggle"
    />
    <p
      class="m-0 text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      Last action: {{ last || 'none' }}
    </p>
  </div>
</template>
