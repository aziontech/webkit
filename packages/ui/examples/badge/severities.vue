<script setup>
  import Badge from '@aziontech/ui/badge'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Unread
      <Badge
        label="12"
        variant="primary"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Drafts
      <Badge
        label="4"
        variant="secondary"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Passed
      <Badge
        label="99"
        severity="success"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Updates
      <Badge
        label="7"
        severity="info"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Warnings
      <Badge
        label="3"
        severity="warning"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Errors
      <Badge
        label="2"
        severity="danger"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Archived
      <Badge
        label="18"
        severity="neutral"
      />
    </span>
  </div>
</template>
