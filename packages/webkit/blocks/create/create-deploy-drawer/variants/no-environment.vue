<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SettingsGroup from '@aziontech/webkit/settings-group'

  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'
</script>

<template>
  <DeployDrawerFrame
    description="Deploy project-01. Review what goes live and where."
    blocked
    reason-id="deploy-drawer-no-environment-reason"
  >
    <SettingsGroup
      label="Resources"
      hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
    >
      <Card>
        <template #default>
          <p class="text-body-sm text-(--text-muted)">Nothing is bound to project-01 yet.</p>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup label="Environment">
      <EmptyState
        bordered
        size="small"
        icon="az az-link"
        title="No environment on this project"
        description="project-01 has no environment yet, so there is nowhere to deploy it. Add a domain and the environment it answers in, then deploy."
      >
        <template #actions>
          <Button
            label="Add environment"
            variant="outline"
            size="small"
            icon="az az-plus"
          />
        </template>
      </EmptyState>
    </SettingsGroup>

    <template #footer-start>
      <p
        id="deploy-drawer-no-environment-reason"
        class="min-w-0 text-body-xs text-(--text-muted)"
      >
        Add an environment to deploy.
      </p>
    </template>
  </DeployDrawerFrame>
</template>
