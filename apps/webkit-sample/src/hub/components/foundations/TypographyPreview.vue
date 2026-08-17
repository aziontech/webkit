<script setup>
  // The semantic text-style catalog, rendered on the webkit Data Table (Token Name
  // / Usage): the class name on the left, a live sample rendered in that class on
  // the right. Clicking a row copies the .text-* class and fires a toast.
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'

  import { typographyCatalog, typographyLinkDemo } from '../../data/typography.js'

  const columns = [
    { accessorKey: 'name', header: 'Token Name', principal: true, grow: 2 },
    { accessorKey: 'usage', header: 'Usage', grow: 3 }
  ]

  const rows = computed(() => [
    ...typographyCatalog.map((item) => ({
      id: item.className,
      name: item.className,
      sample: item.sample,
      link: false
    })),
    {
      id: typographyLinkDemo.linkClass,
      name: typographyLinkDemo.linkClass,
      sample: typographyLinkDemo.linkLabel,
      parentClass: typographyLinkDemo.parentClass,
      before: typographyLinkDemo.beforeLink,
      after: typographyLinkDemo.afterLink,
      link: true
    }
  ])

  function onRowClick(event, row) {
    if (!row?.name) return
    navigator.clipboard?.writeText(row.name).catch(() => {})
    toast.success(`Copied ${row.name}`)
  }
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    :border="true"
    @row-click="onRowClick"
  >
    <template #cell-name="{ row }">
      <code class="font-code text-body-sm text-[var(--text-default)]">{{ row.name }}</code>
    </template>
    <template #cell-usage="{ row }">
      <span
        v-if="row.link"
        :class="[row.parentClass, 'min-w-0 truncate text-[var(--text-default)]']"
      >
        {{ row.before }}<span :class="row.name">{{ row.sample }}</span
        >{{ row.after }}
      </span>
      <span
        v-else
        :class="[row.name, 'min-w-0 truncate leading-tight text-[var(--text-default)]']"
      >
        {{ row.sample }}
      </span>
    </template>
  </Table>
</template>
