<script setup>
  import { ref } from 'vue'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open empty palette"
    kind="primary"
    @click="open = true"
  />

  <CommandRoot
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandEmpty>No commands found.</CommandEmpty>
    </CommandList>
  </CommandRoot>
</template>
