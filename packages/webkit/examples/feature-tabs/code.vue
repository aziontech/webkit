<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'

  const file = (value, fileName, code) => ({
    label: fileName,
    value,
    language: 'javascript',
    code,
    fileName,
    fileIcon: 'ai-color ai-javascript'
  })

  const tabs = [
    {
      value: 'config',
      title: 'Declare the workload in code',
      description:
        'The hostname, the build preset and the routing live in the repository, so shipping a change is a commit rather than a console session.',
      code: file(
        'config',
        'azion.config.js',
        `export default {
  build: { preset: 'vue' },
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|svg|png|webp|woff2)$',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      }
    ]
  }
}`
      )
    },
    {
      value: 'handler',
      title: 'Answer the request yourself',
      description:
        'Return a response from the handler when a route needs logic — an auth check, a redirect, a shaped payload — instead of sending it to the origin.',
      code: file(
        'handler',
        'main.js',
        `export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/status') {
      return Response.json({ region: 'edge', ok: true })
    }

    return fetch(request)
  }
}`
      )
    },
    {
      value: 'storage',
      title: 'Serve objects from storage',
      description:
        'Bind a bucket to the workload and let it answer with the object directly, with no server in front of it and no egress charge behind it.',
      code: file(
        'storage',
        'assets.js',
        `export default {
  async fetch(request) {
    const url = new URL(request.url)
    const asset = await fetch(new URL(url.pathname, 'file://site-assets/'))

    return new Response(asset.body, {
      headers: { 'cache-control': 'public, max-age=86400' }
    })
  }
}`
      )
    }
  ]
</script>

<template>
  <FeatureTabs
    title="From a hostname to a full stack, on one platform"
    description="Storage, a database, a firewall and a cache policy all bind to the same workload. Each one is a binding, not another deployment to run."
    copy-aria-label="Copy the workload sample"
    :tabs="tabs"
    :primary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</template>
