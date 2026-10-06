<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  interface Props {
    label: string
    icon?: string
    kind?: string
    disabled?: boolean
    loading?: boolean
    href?: string
    target?: string
  }

  withDefaults(defineProps<Props>(), {
    icon: 'pi pi-plus',
    kind: 'outlined',
    disabled: false,
    loading: false,
    href: '',
    target: '_self'
  })

  defineEmits<{
    click: [event: Event]
  }>()
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :kind="kind"
    :disabled="disabled"
    :loading="loading"
    :href="href"
    :target="target"
    size="medium"
    class="w-full md:w-auto"
    @click="$emit('click', $event)"
  />
</template>
