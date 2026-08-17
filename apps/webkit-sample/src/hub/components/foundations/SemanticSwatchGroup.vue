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
      return 'bg-(--swatch-on) text-(--swatch-color) border-2 border-solid border-(--border-muted)'
    }
    if (item.kind === 'border') {
      return 'bg-(--bg-canvas) border-4 border-solid border-(--swatch-color)'
    }
    return 'bg-(--swatch-color) border-2 border-solid border-(--border-muted)'
  }

  function onRowClick(event, row) {
    if (!row?.name) return
    navigator.clipboard?.writeText(row.name).catch(() => {})
    toast.success(`Copied ${row.name}`)
  }
</script>

<template>
  <section class="mb-(--spacing-xl)">
    <div class="mb-(--spacing-md)">
      <h2
        class="m-0 mb-(--spacing-xs) border-b border-solid border-(--border-default) pb-(--spacing-xs) text-overline-md! text-(--text-muted)"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="m-0 max-w-(--container-3xl) text-body-sm text-(--text-muted)"
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
        <span class="flex min-w-0 items-center gap-(--spacing-sm)">
          <span
            :style="swatchVars(row)"
            :class="[
              'flex size-7 shrink-0 items-center justify-center rounded-(--shape-elements) font-code text-body-xs',
              swatchKindClass(row)
            ]"
          >
            <span v-if="row.kind === 'text'">Aa</span>
          </span>
          <code class="truncate font-code text-body-sm text-(--text-default)">{{
            row.name
          }}</code>
        </span>
      </template>
      <template #cell-description="{ value }">
        <span class="text-body-sm text-(--text-muted)">{{ value }}</span>
      </template>
    </Table>
  </section>
</template>
