<script setup>
  import Button from '@aziontech/ui/button'
  import CommandEmpty from '@aziontech/ui/command-empty'
  import CommandInput from '@aziontech/ui/command-input'
  import CommandList from '@aziontech/ui/command-list'
  import CommandRoot from '@aziontech/ui/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open empty palette"
    variant="primary"
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
