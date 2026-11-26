<script setup lang="ts">
  import ImageGallery from '@aziontech/ui/image-gallery'

  const items = [
    {
      key: 'sunset',
      data:
        'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IG' +
        'lkPSJnIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0YzNjUyQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1j' +
        'b2xvcj0iIzdjMmQxMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0idXJsKCNnKS' +
        'IvPjxjaXJjbGUgY3g9IjQ0IiBjeT0iMjAiIHI9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNMCA1MmwxOC0x' +
        'OCAxNCAxNCAxMC0xMCAyMiAyMkgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMzUiLz48L3N2Zz4=',
      mimeType: 'image/svg+xml',
      alt: 'Orange sunset over low hills, drawn as a flat gradient'
    },
    {
      key: 'night',
      data:
        'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IG' +
        'lkPSJnIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFlM2E4YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1j' +
        'b2xvcj0iIzBmMTcyYSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0idXJsKCNnKS' +
        'IvPjxjaXJjbGUgY3g9IjQ0IiBjeT0iMjAiIHI9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNMCA1MmwxOC0x' +
        'OCAxNCAxNCAxMC0xMCAyMiAyMkgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMzUiLz48L3N2Zz4=',
      mimeType: 'image/svg+xml',
      alt: 'Blue night sky over low hills, drawn as a flat gradient'
    }
  ]
</script>

<template>
  <ImageGallery :items="items" />
</template>
