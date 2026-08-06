<script setup>
  // A semantic theme-token group, rendered on the webkit Data Table (Token Name /
  // Usage): a live token swatch + the CSS variable on the left, the usage note on
  // the right. Swatches use the live token, so they follow the active theme.
  // Clicking a row copies the variable and fires a toast.
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'

  defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    /** Array of { name, description, kind, on }. */
    items: { type: Array, default: () => [] }
  })

  const columns = [
    { accessorKey: 'name', header: 'Token Name', principal: true, grow: 2 },
    { accessorKey: 'description', header: 'Usage', grow: 3 }
  ]

  // The live token is passed as a CSS custom property, then consumed by the token
  // utilities below.
  function swatchVars(item) {
    return {
      '--swatch-color': `var(${item.name})`,
      '--swatch-on': item.on ?? 'var(--bg-surface)'
    }
  }

  // Swatch renders the live token, so it follows the theme toggle.
  function swatchKindClass(item) {
    if (item.kind === 'text') {
      return 'bg-[var(--swatch-on)] text-[var(--swatch-color)] border-2 border-solid border-[var(--border-muted)]'
    }
    if (item.kind === 'border') {
      return 'bg-[var(--bg-canvas)] border-4 border-solid border-[var(--swatch-color)]'
    }
    return 'bg-[var(--swatch-color)] border-2 border-solid border-[var(--border-muted)]'
  }

  function onRowClick(event, row) {
    if (!row?.name) return
    navigator.clipboard?.writeText(row.name).catch(() => {})
    toast.success(`Copied ${row.name}`)
  }
</script>

<template>
  <section class="mb-[var(--spacing-xl)]">
    <div class="mb-[var(--spacing-md)]">
      <h2
        class="m-0 mb-[var(--spacing-xs)] border-b border-solid border-[var(--border-default)] pb-[var(--spacing-xs)] text-overline-md! text-[var(--text-muted)]"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="m-0 max-w-[var(--container-3xl)] text-body-sm text-[var(--text-muted)]"
      >
        {{ description }}
      </p>
    </div>

    <Table
      :data="items"
      :columns="columns"
      :border="true"
      @row-click="onRowClick"
    >
      <template #cell-name="{ row }">
        <span class="flex min-w-0 items-center gap-[var(--spacing-sm)]">
          <span
            :style="swatchVars(row)"
            :class="[
              'flex size-7 shrink-0 items-center justify-center rounded-[var(--shape-elements)] font-code text-body-xs',
              swatchKindClass(row)
            ]"
          >
            <span v-if="row.kind === 'text'">Aa</span>
          </span>
          <code class="truncate font-code text-body-sm text-[var(--text-default)]">{{
            row.name
          }}</code>
        </span>
      </template>
      <template #cell-description="{ value }">
        <span class="text-body-sm text-[var(--text-muted)]">{{ value }}</span>
      </template>
    </Table>
  </section>
</template>
