<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { ref, watch } from 'vue'

  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'

  const open = ref(false)
  const retrying = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) retrying.value = false
  })
</script>

<template>
  <DeployDrawerFrame
    v-model:open="open"
    description="Deploy project-01. Review what goes live and where."
    :loading="retrying"
    blocked
  >
    <SettingsGroup label="Deploy targets">
      <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
        <Alert
          severity="danger"
          label="The deploy targets for project-01 couldn't be loaded. Check your connection and try again."
        />
        <Button
          label="Retry"
          variant="outline"
          size="small"
          icon="az az-refresh"
          @click="retrying = true"
        />
      </div>
    </SettingsGroup>
  </DeployDrawerFrame>
</template>
