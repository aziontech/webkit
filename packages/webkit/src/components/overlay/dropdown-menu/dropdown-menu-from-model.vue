<script setup lang="ts">
  import DropdownMenuGroup from './dropdown-menu-group.vue'
  import DropdownMenuItem from './dropdown-menu-item.vue'
  import DropdownMenuSeparator from './dropdown-menu-separator.vue'
  import type { DropdownMenuNode } from './factory'

  defineOptions({
    name: 'DropdownMenuFromModel',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Flat list of group, item, and separator nodes from the factory helpers. */
      nodes?: DropdownMenuNode[]
    }>(),
    {
      nodes: () => []
    }
  )

  const emit = defineEmits<{
    select: [value: string | undefined]
  }>()
</script>

<template>
  <template
    v-for="(node, index) in props.nodes"
    :key="`${node.type}-${index}-${node.type === 'item' ? node.label : node.type === 'group' ? node.label : 'sep'}`"
  >
    <DropdownMenuGroup
      v-if="node.type === 'group'"
      :label="node.label"
    />
    <DropdownMenuSeparator v-else-if="node.type === 'separator'" />
    <DropdownMenuItem
      v-else
      :label="node.label"
      :value="node.value"
      :selected="node.selected"
      :disabled="node.disabled"
      :icon="node.icon"
      :href="node.href"
      :target="node.target"
      @select="emit('select', $event)"
    />
  </template>
</template>
