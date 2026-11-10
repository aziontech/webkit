<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
</script>

<template>
  <div class="flex w-full flex-col bg-(--bg-canvas)">
    <GlobalHeader
      kind="site"
      aria-label="Azion"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          ><Brand
            kind="default"
            size="small"
        /></a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle class="justify-start!">
        <a
          class="text-label-md text-(--text-default) no-underline"
          href="/pricing"
          >Pricing</a
        >
      </GlobalHeader.Middle>
      <GlobalHeader.Right>
        <Button
          label="Start for Free"
          kind="primary"
          size="medium"
        />
      </GlobalHeader.Right>
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
