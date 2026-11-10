<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
    <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <h1
          data-size="medium"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          Resources
        </h1>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your resources.</p>
    </div>
    <div
      class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full"
    >
      <div class="w-full md:w-fit">
        <Button
          label="Documentation"
          icon="pi pi-book"
          kind="outlined"
          size="medium"
          href="https://example.com/docs/resources"
          target="_blank"
          class="w-full"
        />
      </div>
      <div class="w-full md:w-fit">
        <Button
          label="Create Resource"
          icon="pi pi-plus"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </div>
  </header>
</template>
