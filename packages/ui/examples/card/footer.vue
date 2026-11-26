<script setup>
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Link from '@aziontech/ui/link'
</script>

<template>
  <Card
    title="Cache settings"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        Cache static assets for 30 days and HTML for 5 minutes.
      </p>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <Link
          href="https://example.com/docs/caching"
          label="Read the caching guide"
          size="small"
        />
        <div class="flex gap-(--spacing-sm)">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
          />
          <Button
            label="Save"
            variant="primary"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
