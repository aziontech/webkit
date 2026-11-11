<script setup>
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const content = [
    'Here is the page you asked for: <script>alert("hi")</' + 'script>',
    '',
    '<img src="x" onerror="alert(1)"> and a [harmless looking link](javascript:alert(1)).',
    '',
    'A safe link stays a link: [Azion documentation](https://www.azion.com/en/documentation/).'
  ].join('\n')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <StreamingResponse :content="content" />
  </div>
</template>
