<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeleteDialog from '../blocks/delete-dialog.vue'
  import { deleteResource, findResource, resources } from '../lib/store'
  import { focusResourceRow } from '../router'

  const route = useRoute()
  const router = useRouter()
  const resource = findResource(route.params.id)
  const name = resource?.name ?? ''
  const open = ref(false)
  const deleting = ref(false)

  let focusAfter = resource?.id ?? ''

  watch(open, async (isOpen) => {
    if (isOpen || route.name !== 'resource-delete') return
    await router.push('/resources')
    await nextTick()
    focusResourceRow(focusAfter)
  })

  onMounted(() => {
    if (resource) open.value = true
    else router.replace('/resources')
  })

  const onDelete = () => {
    if (!resource) return
    deleting.value = true
    setTimeout(() => {
      const index = resources.value.findIndex((item) => item.id === resource.id)
      deleteResource(resource.id)
      focusAfter = (resources.value[index] ?? resources.value[index - 1])?.id ?? ''
      deleting.value = false
    }, 600)
  }
</script>

<template>
  <div hidden>
    <DeleteDialog
      v-model:open="open"
      :name="name"
      :loading="deleting"
      @delete="onDelete"
    />
  </div>
</template>
