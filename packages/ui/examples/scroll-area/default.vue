<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'

  const lines = [
    { time: '14:02:11', text: 'Build started for acme-store (commit 4f2a9c1)' },
    { time: '14:02:13', text: 'Installing dependencies' },
    { time: '14:02:41', text: 'Dependencies installed in 28s' },
    { time: '14:02:42', text: 'Running build script' },
    { time: '14:03:05', text: 'Bundled 214 modules into 3 files' },
    { time: '14:03:06', text: 'Uploading static assets to site-assets' },
    { time: '14:03:19', text: 'Uploaded 86 files (4.2 MB)' },
    { time: '14:03:20', text: 'Creating function instance for the storefront API' },
    { time: '14:03:24', text: 'Function instance ready' },
    { time: '14:03:25', text: 'Propagating to the edge network' },
    { time: '14:03:58', text: 'Deployed to production at acme-store.example.com' }
  ]
</script>

<template>
  <div
    class="h-[200px] max-w-(--container-md) rounded-(--shape-control) border border-(--border-default)"
  >
    <ScrollArea
      orientation="vertical"
      aria-label="Deployment log"
      class="h-full"
    >
      <ol class="flex flex-col gap-(--spacing-2xs) p-(--spacing-sm) text-label-code-sm">
        <li
          v-for="line in lines"
          :key="line.time + line.text"
          class="flex gap-(--spacing-sm)"
        >
          <span class="shrink-0 text-(--text-muted)">{{ line.time }}</span>
          <span class="min-w-0 text-(--text-default)">{{ line.text }}</span>
        </li>
      </ol>
    </ScrollArea>
  </div>
</template>
