<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        The footer bar renders only when the footer slot is filled.
      </p>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <Link
          href="/docs"
          label="Check documentation"
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
            variant="outline"
            size="small"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
