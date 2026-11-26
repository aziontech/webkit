<script setup>
  import ContextMenu from '@aziontech/ui/context-menu'
</script>

<template>
  <ContextMenu
    disabled
    aria-label="File actions"
  >
    <ContextMenu.Trigger>
      <div
        class="flex h-40 w-full max-w-(--container-sm) items-center justify-center rounded-(--shape-card) border border-dashed border-(--border-default) text-body-sm text-(--text-muted)"
      >
        Right-click shows the browser menu
      </div>
    </ContextMenu.Trigger>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="open"
        label="Open"
      />
    </ContextMenu.Group>
  </ContextMenu>
</template>
