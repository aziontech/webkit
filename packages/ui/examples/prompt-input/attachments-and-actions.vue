<script setup>
  import PromptInput from '@aziontech/ui/prompt-input'
  import { onBeforeUnmount, ref } from 'vue'

  const prompt = ref('Explain the errors in these logs')
  const files = ref([
    { file: { name: 'access-log-14h.txt', size: 182000, type: 'text/plain' } },
    {
      file: { name: 'edge-trace.json', size: 64000, type: 'application/json' },
      error: 'The upload failed. Remove the file and attach it again.'
    }
  ])
  const timers = []

  function attach(next) {
    const added = next.filter((item) => !files.value.includes(item))
    files.value = next.map((item) => (added.includes(item) ? { ...item, loading: true } : item))
    timers.push(
      setTimeout(() => {
        files.value = files.value.map((item) => (item.loading ? { file: item.file } : item))
      }, 1200)
    )
  }

  function send() {
    prompt.value = ''
    files.value = []
  }

  onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :files="files"
      accept=".txt,.log,.json,image/*"
      :max-files="3"
      :max-file-size="10485760"
      @update:files="attach"
      @submit="send"
    >
      <template #actions>
        <PromptInput.AttachButton />
      </template>
      <template #hint>
        Up to 3 logs, JSON files or images, 10 MB each. Pick them, drop them on the box or paste
        them.
      </template>
    </PromptInput>
  </div>
</template>
