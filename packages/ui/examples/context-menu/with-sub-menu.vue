<script setup>
  import ContextMenu from '@aziontech/ui/context-menu'
  import { reactive } from 'vue'

  const view = reactive({ hidden: false, grid: true })

  const onSelect = (event, value) => {
    if (value in view) view[value] = !view[value]
  }
</script>

<template>
  <ContextMenu
    aria-label="File actions"
    @select="onSelect"
  >
    <ContextMenu.Trigger>
      <div
        class="flex h-40 w-full max-w-(--container-sm) items-center justify-center rounded-(--shape-card) border border-dashed border-(--border-default) text-body-sm text-(--text-muted)"
      >
        Right-click site-assets
      </div>
    </ContextMenu.Trigger>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="open"
        label="Open"
      />
      <ContextMenu.Item
        value="rename"
        label="Rename"
        command="F2"
      />
      <ContextMenu.Sub default-open>
        <ContextMenu.SubTrigger label="Move to" />
        <ContextMenu.SubContent>
          <ContextMenu.Group>
            <ContextMenu.Item
              value="production"
              label="production"
            />
            <ContextMenu.Item
              value="staging"
              label="staging"
            />
          </ContextMenu.Group>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </ContextMenu.Group>

    <ContextMenu.Group label="View">
      <ContextMenu.Item
        value="hidden"
        label="Show hidden files"
        type="checkbox"
        :selected="view.hidden"
      />
      <ContextMenu.Item
        value="grid"
        label="Grid layout"
        type="checkbox"
        :selected="view.grid"
      />
    </ContextMenu.Group>

    <ContextMenu.Group>
      <ContextMenu.Item
        value="delete"
        label="Delete"
        severity="danger"
      />
    </ContextMenu.Group>
  </ContextMenu>
</template>
