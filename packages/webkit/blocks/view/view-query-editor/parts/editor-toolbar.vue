<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import { toAriaKeyshortcuts } from '@aziontech/webkit/use-shortcuts'

  export interface EditorToolbarProps {
    /** A query is in flight: Run query spins and the other actions lock. */
    running?: boolean
    /** The history panel is open; while it is closed a History button shows on small screens. */
    historyOpen?: boolean
  }

  withDefaults(defineProps<EditorToolbarProps>(), { running: false, historyOpen: true })

  const emit = defineEmits<{
    run: [event: MouseEvent]
    templates: []
    'show-history': []
  }>()
</script>

<template>
  <div
    class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
  >
    <div
      v-if="!historyOpen"
      class="flex shrink-0 md:hidden"
    >
      <Button
        label="History"
        icon="az az-history"
        variant="outline"
        size="medium"
        @click="emit('show-history')"
      />
    </div>
    <Button
      variant="primary"
      size="medium"
      icon="az az-play"
      :loading="running"
      :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
      @click="(event: MouseEvent) => emit('run', event)"
    >
      Run query
      <span
        class="max-lg:hidden"
        aria-hidden="true"
      >
        <Kbd
          meta
          key-name="enter"
          size="small"
        />
      </span>
    </Button>
    <div class="ms-auto flex items-center gap-(--spacing-xs)">
      <Button
        label="Prettify"
        variant="outline"
        size="medium"
        icon="az az-align-left"
        :disabled="running"
      />
      <Button
        label="Templates"
        variant="outline"
        size="medium"
        icon="az az-bolt"
        :disabled="running"
        @click="emit('templates')"
      />
    </div>
  </div>
</template>
