<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #content>
      <p class="text-body-sm text-(--text-muted)">
        The footer bar renders only when the footer slot is filled.
      </p>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <span class="text-body-xs text-(--text-muted)">
          <a
            href="/docs"
            class="text-link"
            >Check documentation:</a
          >
        </span>
        <div class="flex gap-(--spacing-sm)">
          <Button
            label="Cancel"
            kind="outlined"
            size="small"
          />
          <Button
            label="Save"
            kind="outlined"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
