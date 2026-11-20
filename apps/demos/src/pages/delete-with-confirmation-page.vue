<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeleteDialog from '../blocks/delete-dialog.vue'
  import { deleteResource, findResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const resource = findResource(route.params.id)
  const name = resource?.name ?? ''
  const open = ref(false)
  const deleting = ref(false)

  watch(open, (isOpen) => {
    if (!isOpen && route.name === 'resource-delete') router.push('/resources')
  })

  onMounted(() => {
    if (resource) open.value = true
    else router.replace('/resources')
  })

  const onDelete = () => {
    if (!resource) return
    deleting.value = true
    setTimeout(() => {
      deleteResource(resource.id)
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
