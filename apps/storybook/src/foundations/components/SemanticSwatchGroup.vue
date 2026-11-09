<script setup>
  import { computed } from 'vue'

  import GroupHeader from './layout/GroupHeader.vue'
  import TokenTable from './TokenTable.vue'

  const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    /** Array of { name, description, kind, on, light, dark }. */
    items: { type: Array, default: () => [] }
  })

  const UTILITY = { fill: 'bg-', text: 'text-', border: 'border-' }
  const ROLE_PREFIX = [
    [/^--bg-/, 'bg-'],
    [/^--text-/, 'text-'],
    [/^--border-/, 'border-'],
    [/^--ring-color$/, 'ring-']
  ]

  function tailwindFor(item) {
    const role = ROLE_PREFIX.find(([pattern]) => pattern.test(item.name))
    return `${role ? role[1] : UTILITY[item.kind]}(${item.name})`
  }

  const rows = computed(() =>
    props.items.map((item) => ({
      ...item,
      tailwind: tailwindFor(item),
      css: `var(${item.name})`,
      raw: item.light === item.dark ? item.light : `${item.light} / ${item.dark}`
    }))
  )

  function swatchVars(item) {
    return {
      '--swatch-color': `var(${item.name})`,
      '--swatch-on': item.on ?? 'var(--bg-surface)'
    }
  }

  function swatchKindClass(item) {
    if (item.kind === 'text') {
      return 'bg-(--swatch-on) text-(--swatch-color) border-2 border-solid border-(--border-muted)'
    }
    if (item.kind === 'border') {
      return 'bg-(--bg-canvas) border-4 border-solid border-(--swatch-color)'
    }
    return 'bg-(--swatch-color) border-2 border-solid border-(--border-muted)'
  }
</script>

<template>
  <div class="mb-(--spacing-xl) last:mb-0">
    <GroupHeader
      :title="title"
      :description="description"
    />

    <TokenTable :rows="rows">
      <template #sample="{ row }">
        <span
          :style="swatchVars(row)"
          :class="[
            'flex h-9 w-14 shrink-0 items-center justify-center rounded-(--shape-elements) font-code text-body-xs',
            swatchKindClass(row)
          ]"
        >
          <span v-if="row.kind === 'text'">Aa</span>
        </span>
        <span
          class="min-w-0 max-w-(--container-xs) truncate text-body-sm text-(--text-muted)"
          :title="row.description"
          >{{ row.description }}</span
        >
      </template>
    </TokenTable>
  </div>
</template>
