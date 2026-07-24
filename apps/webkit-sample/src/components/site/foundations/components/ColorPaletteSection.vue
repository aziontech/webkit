<script setup>
  // A primitive/brand color scale, rendered on the webkit Data Table (Token Name /
  // Usage) so the token catalogs read like a real reference table. Clicking a row
  // copies the CSS variable and fires a toast.
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'

  const props = defineProps({
    title: { type: String, required: true },
    items: { type: Array, default: () => [] }
  })

  const columns = [
    { accessorKey: 'name', header: 'Token Name', principal: true, grow: 2 },
    { accessorKey: 'usage', header: 'Usage', grow: 3 }
  ]

  const rows = computed(() =>
    props.items.map((item) => ({
      id: item.id,
      name: item.meta ?? item.label,
      usage: item.value,
      preview: item.preview ?? item.value
    }))
  )

  function onRowClick(event, row) {
    if (!row?.name) return
    navigator.clipboard?.writeText(row.name).catch(() => {})
    toast.success(`Copied ${row.name}`)
  }
</script>

<template>
  <section class="mb-[var(--spacing-xl)]">
    <h3
      class="m-0 mb-[var(--spacing-sm)] px-[var(--spacing-xxs)] text-overline-sm uppercase tracking-widest text-[var(--text-muted)]"
    >
      {{ title }}
    </h3>

    <Table
      :data="rows"
      :columns="columns"
      :border="true"
      @row-click="onRowClick"
    >
      <template #cell-name="{ row }">
        <span class="flex min-w-0 items-center gap-[var(--spacing-sm)]">
          <span
            class="size-7 shrink-0 rounded-[var(--shape-elements)] border border-[var(--border-muted)]"
            :style="{ background: row.preview }"
          />
          <code class="truncate font-code text-body-sm text-[var(--text-default)]">{{ row.name }}</code>
        </span>
      </template>
      <template #cell-usage="{ value }">
        <code class="font-code text-body-sm text-[var(--text-muted)]">{{ value }}</code>
      </template>
    </Table>
  </section>
</template>
