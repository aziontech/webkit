<script setup>
  import Button from '@aziontech/webkit/button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const full = [
    'Your cache hit ratio dropped because **query strings** reach the cache key.',
    '',
    'Ignore the parameters that do not change the response:',
    '',
    '```json',
    '{ "cache_by_query_string": "ignore", "query_string_fields": ["utm_source"] }',
    '```',
    '',
    'Then purge the affected paths so the new key takes effect.'
  ].join('\n')

  const content = ref('')
  const streaming = ref(false)
  let timer

  function play() {
    clearInterval(timer)
    content.value = ''
    streaming.value = true
    let index = 0
    timer = setInterval(() => {
      index = Math.min(full.length, index + 4)
      content.value = full.slice(0, index)
      if (index >= full.length) {
        clearInterval(timer)
        streaming.value = false
      }
    }, 40)
  }

  onMounted(play)
  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <StreamingResponse
      :content="content"
      :streaming="streaming"
    />
    <Button
      label="Replay"
      kind="outlined"
      size="small"
      icon="pi pi-refresh"
      :disabled="streaming"
      @click="play"
    />
  </div>
</template>
