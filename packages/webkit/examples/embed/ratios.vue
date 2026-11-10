<script setup>
  import Embed from '@aziontech/webkit/embed'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a 16:9 frame"
      ratio="video"
    />
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a square frame"
      ratio="square"
    />
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a 21:9 frame"
      ratio="wide"
    />
  </div>
</template>
