<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        kind="outlined"
        size="medium"
        icon="pi pi-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Deploy"
          novalidate
          @submit.prevent
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Deploy</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Deploy project-01. Review what goes live and where.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <SettingsSection
              title="Resources"
              hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
            >
              <Card>
                <template #content>
                  <p class="text-body-sm text-(--text-muted)">
                    Nothing is bound to project-01 yet.
                  </p>
                </template>
              </Card>
            </SettingsSection>

            <SettingsSection title="Environment">
              <EmptyState
                bordered
                size="small"
                icon="pi pi-link"
                title="No environment on this project"
                description="project-01 has no environment yet, so there is nowhere to deploy it. Add a domain and the environment it answers in, then deploy."
              >
                <template #actions>
                  <Button
                    label="Add environment"
                    kind="outlined"
                    size="small"
                    icon="pi pi-plus"
                  />
                </template>
              </EmptyState>
            </SettingsSection>
          </PanelContent>

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
                kind="primary"
                size="medium"
                type="submit"
                disabled
                aria-describedby="deploy-drawer-no-environment-reason"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
