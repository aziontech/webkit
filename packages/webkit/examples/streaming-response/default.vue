<script setup>
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const content = [
    '## Purge one URL',
    '',
    'Use **Real-Time Purge** when one object changed at the origin. Purges by `URL` take effect in a few seconds.',
    '',
    '1. Open Real-Time Purge from the products menu.',
    '2. Choose *URL* as the purge type.',
    '3. Paste the address and select Purge.',
    '',
    '| Purge type | When to use it |',
    '| --- | --- |',
    '| URL | One object changed |',
    '| Wildcard | A folder changed |',
    '',
    'The same purge from the CLI:',
    '',
    '```bash',
    'azion purge urls --urls https://www.example.com/styles.css',
    '```'
  ].join('\n')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <StreamingResponse :content="content" />
  </div>
</template>
