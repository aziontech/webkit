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
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <AppHeader.Center>
        <div class="flex w-full min-w-0 items-center">
          <Button
            href="/pricing"
            label="Pricing"
            variant="ghost"
            size="medium"
          />
        </div>
      </AppHeader.Center>
      <AppHeader.End>
        <Button
          label="Start for free"
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
        Deploy applications, secure them and watch them run, on one platform close to your users.
      </p>
    </section>
  </div>
</template>
