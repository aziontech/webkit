<script setup>
  import Link from '@aziontech/webkit/link'
  import SkipLink from '@aziontech/webkit/skip-link'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <SkipLink href="#skip-link-demo-content" />
    <nav
      aria-label="Product"
      class="flex flex-wrap gap-(--spacing-md)"
    >
      <Link
        label="Overview"
        href="https://example.com/overview"
        size="medium"
      />
      <Link
        label="Pricing"
        href="https://example.com/pricing"
        size="medium"
      />
      <Link
        label="Documentation"
        href="https://example.com/docs"
        size="medium"
      />
    </nav>
    <section
      id="skip-link-demo-content"
      aria-label="Content"
      class="text-body-md text-(--text-default)"
    >
      Focus lands here after the skip link is activated.
    </section>
  </div>
</template>
