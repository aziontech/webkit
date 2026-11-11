<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { ref } from 'vue'

  const prompt = ref(
    'Write a function that redirects every request from the old blog path to the new one, keeps the query string, answers with a permanent redirect and logs the original path so I can check later which links people still use. It should also skip the redirect for requests that already come from the new path, and it should run before the cache.'
  )
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :max-length="280"
    />
  </div>
</template>
