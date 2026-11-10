<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <DocPageHeader
      title="No breadcrumb"
      description="The trail is optional; the masthead closes up rather than leaving a gap."
      last-updated="2026-06-30"
    />
    <DocPageHeader
      title="No deck"
      :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'No deck' }]"
      last-updated="Updated this morning"
    />
    <DocPageHeader
      title="No date"
      description="Without a date the belt starts the line, and the line is pulled left by one step so the first label lands on the column the title and deck start on."
      :meta-actions="[
        {
          value: 'copy',
          label: 'Copy as Markdown',
          icon: 'pi pi-copy',
          tip: 'Copy this page as Markdown, ready to paste into an assistant.'
        },
        {
          value: 'markdown',
          label: 'View as Markdown',
          icon: 'pi pi-eye',
          tip: 'Open this page as plain Markdown in a new tab.'
        }
      ]"
    />
    <DocPageHeader
      title="Nothing to do with it"
      description="No date and no entries: the meta line renders no element at all."
    />
  </div>
</template>
