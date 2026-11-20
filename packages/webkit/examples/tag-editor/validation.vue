<script setup>
  import Button from '@aziontech/webkit/button'
  import TagEditor from '@aziontech/webkit/tag-editor'
  import { ref } from 'vue'

  const tags = ref([
    { key: 'owner', value: 'platform-team', existing: true, markedForRemoval: true },
    { key: 'acme:managed', value: 'true' },
    { key: 'region', value: 'sa-east' },
    { key: 'region', value: 'us-east' }
  ])

  const editorEl = ref(null)
  const valid = ref(true)
  const save = () => {
    valid.value = editorEl.value?.validate() ?? false
  }
</script>

<template>
  <form
    class="flex flex-col gap-(--spacing-md)"
    novalidate
    @submit.prevent="save"
  >
    <TagEditor
      ref="editorEl"
      v-model:tags="tags"
      :limit="5"
      reserved-prefix="acme:"
      aria-label="Resource tags"
    />
    <div>
      <Button
        type="submit"
        label="Save tags"
        variant="primary"
        size="medium"
      />
    </div>
  </form>
</template>
