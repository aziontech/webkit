<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Resizable from '@aziontech/webkit/resizable'
  import { nextTick, ref } from 'vue'

  const versions = [
    'SELECT * FROM orders;',
    'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC;',
    'SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval 7 day\nORDER BY total DESC\nLIMIT 10;'
  ]
  const version = ref(versions.length - 1)
  const open = ref(true)
  const width = ref(420)
  const canvas = ref(null)
  const opener = ref(null)

  const show = async () => {
    open.value = true
    await nextTick()
    canvas.value?.focus()
  }
  const hide = async () => {
    open.value = false
    await nextTick()
    opener.value?.querySelector('button')?.focus()
  }
</script>

<template>
  <Resizable
    class="h-(--container-xs) w-full rounded-(--shape-card) border border-(--border-default)"
    aria-label="Conversation and artifact"
  >
    <Resizable.Pane>
      <div
        ref="opener"
        class="flex h-full flex-col gap-(--spacing-sm) overflow-auto p-(--spacing-md)"
      >
        <p class="m-0 text-body-sm text-(--text-default)">
          Here are the ten biggest orders of the last seven days.
        </p>
        <ArtifactPreview
          title="top-orders.sql"
          meta="SQL"
          icon="pi pi-code"
          openable
          @open="show"
        />
      </div>
    </Resizable.Pane>
    <Resizable.Handle
      v-if="open"
      aria-label="Resize the artifact"
    />
    <Resizable.Pane
      v-if="open"
      v-model:basis="width"
      :min="300"
      :max="720"
    >
      <ArtifactCanvas
        ref="canvas"
        v-model:version="version"
        title="top-orders.sql"
        :meta="`SQL · ${versions[version].split('\n').length} lines`"
        kind="code"
        :versions="versions.length"
        :copy-value="versions[version]"
        @close="hide"
      >
        <CodeBlock
          :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
          :copyable="false"
          :bordered="false"
        />
      </ArtifactCanvas>
    </Resizable.Pane>
  </Resizable>
</template>
