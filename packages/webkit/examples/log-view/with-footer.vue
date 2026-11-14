<script setup>
  import Button from '@aziontech/webkit/button'
  import LogView from '@aziontech/webkit/log-view'

  const lines = [
    { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started' },
    { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
    { id: '3', time: '13:47:44', type: 'text', message: 'Deployed to https://app.example.com' }
  ]
</script>

<template>
  <div class="h-[420px]">
    <LogView
      :lines="lines"
      class="h-full"
    >
      <LogView.Header />
      <LogView.Content />
      <LogView.Footer>
        <span class="text-(--text-muted)">Finished in 11 s</span>
        <Button
          label="Open site"
          kind="secondary"
          size="small"
          href="https://app.example.com"
        />
      </LogView.Footer>
    </LogView>
  </div>
</template>
