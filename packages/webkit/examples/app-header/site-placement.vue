<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <AppHeader
      variant="site"
      aria-label="Azion"
    >
      <AppHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          ><Brand
            variant="default"
            size="small"
        /></a>
      </AppHeader.Brand>
      <AppHeader.Center>
        <div class="flex w-full min-w-0 items-center">
          <a
            class="text-label-md text-(--text-default) no-underline"
            href="/pricing"
            >Pricing</a
          >
        </div>
      </AppHeader.Center>
      <AppHeader.End>
        <Button
          label="Start for Free"
          variant="primary"
          size="medium"
        />
      </AppHeader.End>
    </AppHeader>
    <section
      class="mx-auto w-full max-w-(--layout-measure-site) px-(--layout-boundary-inline) py-(--spacing-xl)"
    >
      <h1 class="text-heading-xl text-(--text-default)">
        Distributed infrastructure for modern workloads
      </h1>
      <p class="text-body-md text-(--text-muted)">
        The page frame is one rung narrower than the bar above it: the two share an inset until the
        window passes their caps.
      </p>
    </section>
  </div>
</template>
