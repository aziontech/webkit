<script setup>
  import ContextMenu from '@aziontech/webkit/context-menu'
  import { ref } from 'vue'

  const resources = ['production', 'staging', 'docs-site']
  const target = ref('')
  const last = ref('')

  const onSelect = (event, value) => {
    last.value = `${value} · ${target.value}`
  }

  const RESOURCE_ROW_CLASS =
    'flex h-10 items-center border-b border-(--border-default) px-(--spacing-md) text-body-sm text-(--text-default) outline-none ' +
    'last:border-b-0 focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-sm)">
    <ContextMenu
      :aria-label="target ? `Actions for ${target}` : 'Resource actions'"
      @select="onSelect"
    >
      <ContextMenu.Trigger>
        <ul
          class="flex flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
        >
          <li
            v-for="name in resources"
            :key="name"
            tabindex="0"
            :class="RESOURCE_ROW_CLASS"
            @contextmenu="target = name"
            @focus="target = name"
          >
            {{ name }}
          </li>
        </ul>
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
        <ContextMenu.Item
          value="duplicate"
          label="Duplicate"
        />
      </ContextMenu.Group>
      <ContextMenu.Group>
        <ContextMenu.Item
          value="delete"
          label="Delete"
        />
      </ContextMenu.Group>
    </ContextMenu>

    <p class="text-body-sm text-(--text-muted)">
      Right-click a row, press Shift+F10 on a focused row, or long-press it on touch.
      <span v-if="last">Last action: {{ last }}</span>
    </p>
  </div>
</template>
