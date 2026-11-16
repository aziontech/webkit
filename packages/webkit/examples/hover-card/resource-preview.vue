<script setup>
  import HoverCard from '@aziontech/webkit/hover-card'
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-xs) pb-48">
    <span class="text-label-sm text-(--text-muted)">Application</span>
    <HoverCard
      default-open
      side="bottom"
      align="start"
    >
      <HoverCard.Trigger>
        <Link
          href="https://example.com/applications/acme-store"
          label="acme-store"
          size="small"
        />
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div class="flex items-center justify-between gap-(--spacing-sm)">
          <span class="text-label-md text-(--text-default)">acme-store</span>
          <Tag
            label="Active"
            severity="success"
            size="small"
          />
        </div>
        <dl class="grid grid-cols-2 gap-(--spacing-xs) text-body-sm">
          <dt class="text-(--text-muted)">Region</dt>
          <dd class="text-(--text-default)">United States</dd>
          <dt class="text-(--text-muted)">Last deploy</dt>
          <dd class="text-(--text-default)">2026-11-12 14:30 UTC</dd>
          <dt class="text-(--text-muted)">Domain</dt>
          <dd class="text-(--text-default)"><bdi>app.example.com</bdi></dd>
        </dl>
      </HoverCard.Content>
    </HoverCard>
  </div>
</template>
