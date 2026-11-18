<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="az az-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Deploy"
        novalidate
        @submit.prevent
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Deploy</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Deploy project-01. Review what goes live and where.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
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
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <p
              id="deploy-drawer-no-environment-reason"
              class="min-w-0 text-body-xs text-(--text-muted)"
            >
              Add an environment to deploy.
            </p>
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              type="submit"
              disabled
              aria-describedby="deploy-drawer-no-environment-reason"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
