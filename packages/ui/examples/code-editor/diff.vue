<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import { ref } from 'vue'

  const original = `{
  "cache": {
    "ttl": 60,
    "bypass": false
  }
}
`

  const next = ref(`{
  "cache": {
    "ttl": 300,
    "bypass": false,
    "stale": true
  }
}
`)
</script>

<template>
  <CodeEditor
    v-model="next"
    :original="original"
    language="json"
    diff
    height="12rem"
    aria-label="Cache settings"
  />
</template>
