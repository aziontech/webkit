<script setup>
  import HeroRoot from '@aziontech/ui/hero-root'
</script>

<template>
  <div>
    <HeroRoot max-width="4xl">
      <p
        class="m-0 w-full rounded-(--shape-card) border border-dashed border-(--border-default) p-(--spacing-md) text-center text-body-md text-(--text-muted)"
      >
        4xl
      </p>
    </HeroRoot>
    <HeroRoot max-width="7xl">
      <p
        class="m-0 w-full rounded-(--shape-card) border border-dashed border-(--border-default) p-(--spacing-md) text-center text-body-md text-(--text-muted)"
      >
        7xl
      </p>
    </HeroRoot>
    <HeroRoot max-width="full">
      <p
        class="m-0 w-full rounded-(--shape-card) border border-dashed border-(--border-default) p-(--spacing-md) text-center text-body-md text-(--text-muted)"
      >
        full
      </p>
    </HeroRoot>
  </div>
</template>
