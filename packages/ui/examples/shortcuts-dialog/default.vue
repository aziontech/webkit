<script setup>
  import Button from '@aziontech/ui/button'
  import Input from '@aziontech/ui/input'
  import ShortcutsDialog from '@aziontech/ui/shortcuts-dialog'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/ui/use-shortcuts'
  import { ref } from 'vue'

  const searchEl = ref(null)
  const saved = ref(false)

  useShortcuts([
    {
      keys: '/',
      label: 'Focus search',
      group: 'Page',
      handler: () => searchEl.value?.focus()
    },
    {
      keys: 'meta+s',
      label: 'Save changes',
      group: 'Page',
      handler: () => {
        saved.value = true
      }
    },
    {
      keys: 'meta+enter',
      label: 'Submit the form',
      group: 'Editor',
      handler: () => {
        saved.value = true
      }
    }
  ])
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <Input
      ref="searchEl"
      aria-label="Search domains"
      placeholder="Search domains"
    />
    <p
      class="text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      {{ saved ? 'Changes saved.' : 'Press ? to see every shortcut.' }}
    </p>
    <ShortcutsDialog>
      <template #trigger>
        <Button
          label="Keyboard shortcuts"
          variant="outline"
          size="medium"
          :aria-keyshortcuts="toAriaKeyshortcuts('?')"
        />
      </template>
    </ShortcutsDialog>
  </div>
</template>
