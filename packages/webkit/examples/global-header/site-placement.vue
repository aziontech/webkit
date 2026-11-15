<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <GlobalHeader
      variant="site"
      aria-label="Azion"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          ><Brand
            variant="default"
            size="small"
        /></a>
      </GlobalHeader.Brand>
      <GlobalHeader.Center>
        <div class="flex w-full min-w-0 items-center">
          <a
            class="text-label-md text-(--text-default) no-underline"
            href="/pricing"
            >Pricing</a
          >
        </div>
      </GlobalHeader.Center>
      <GlobalHeader.End>
        <Button
          label="Start for Free"
          variant="primary"
          size="medium"
        />
      </GlobalHeader.End>
    </GlobalHeader>
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
