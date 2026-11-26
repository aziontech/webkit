<script setup lang="ts">
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { computed, ref } from 'vue'

  const props = defineProps<{ title: string; versions: string[]; downloadable: boolean }>()

  const emit = defineEmits<{ close: [] }>()

  const version = defineModel<number>('version', { required: true })

  const canvasEl = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const code = computed(() => props.versions[version.value] ?? '')
  const lines = computed(() => code.value.split('\n').length)

  defineExpose({ focus: () => canvasEl.value?.focus() })
</script>

<template>
  <ArtifactCanvas
    ref="canvasEl"
    v-model:version="version"
    :title="title"
    :meta="`SQL · ${lines} lines`"
    type="code"
    :versions="versions.length"
    :copy-value="code"
    :download-href="
      downloadable ? `data:application/sql;charset=utf-8,${encodeURIComponent(code)}` : ''
    "
    @close="emit('close')"
  >
    <CodeBlock
      :tabs="[{ label: 'SQL', value: 'sql', code, language: 'sql' }]"
      :copyable="false"
      :bordered="false"
    />
  </ArtifactCanvas>
</template>
