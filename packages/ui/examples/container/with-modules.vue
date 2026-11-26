<script setup>
  import Container from '@aziontech/webkit/container'
  import Module from '@aziontech/webkit/module'
  import Spacer from '@aziontech/webkit/spacer'

  const regions = [
    { name: 'North America', latency: '18 ms' },
    { name: 'Europe', latency: '21 ms' },
    { name: 'Asia Pacific', latency: '26 ms' }
  ]
</script>

<template>
  <Container max-width="site">
    <Module
      :divided="false"
      eyebrow="Platform"
      title="Build and run close to your users"
      description="Deploy the Acme storefront once and serve it from every region."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Functions, cache and storage share one deploy, so a release reaches every region in seconds.
      </p>
    </Module>

    <Module
      title="Secure every request"
      description="Firewall rules run before your code, on the same network."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Block bots and abusive traffic without adding a hop to the request.
      </p>
    </Module>

    <Spacer hatch />

    <Module
      :divided="false"
      :padded="false"
      title="Median latency by region"
      description="Measured from the last 24 hours of storefront traffic."
    >
      <dl class="m-0 grid grid-cols-1 gap-px bg-(--border-default) sm:grid-cols-3">
        <div
          v-for="region in regions"
          :key="region.name"
          class="flex flex-col gap-(--spacing-2xs) bg-(--bg-canvas) p-(--spacing-xl)"
        >
          <dt class="text-body-sm text-(--text-muted)">{{ region.name }}</dt>
          <dd class="m-0 text-heading-sm text-(--text-default)">{{ region.latency }}</dd>
        </div>
      </dl>
    </Module>
  </Container>
</template>
