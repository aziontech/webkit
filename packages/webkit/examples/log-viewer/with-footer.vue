<script setup>
  import Button from '@aziontech/webkit/button'
  import LogViewer from '@aziontech/webkit/log-viewer'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    { id: '3', time: '13:47:44', type: 'text', message: 'Deployed to https://app.example.com' }
  ]
</script>

<template>
  <div class="h-[420px]">
    <LogViewer
      :lines="lines"
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
      <LogViewer.Footer>
        <span class="text-(--text-muted)">Finished in 11 s</span>
        <Button
          label="Open site"
          variant="secondary"
          size="small"
          href="https://app.example.com"
        />
      </LogViewer.Footer>
    </LogViewer>
  </div>
</template>
