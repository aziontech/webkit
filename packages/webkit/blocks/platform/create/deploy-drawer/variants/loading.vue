<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Skeleton from '@aziontech/webkit/skeleton'
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
                Publish project-01. Review what this release carries and where it lands.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <div
              class="flex min-w-0 flex-col"
              aria-busy="true"
            >
              <SettingsSection
                title="Resources"
                hint="Everything this project serves, at the version this deployment publishes, with the version of every dependency they reference."
              >
                <div aria-hidden="true">
                  <Skeleton height="var(--size-40)" />
                </div>
              </SettingsSection>

              <SettingsSection
                title="Environment"
                hint="Where the deployment goes live. Each environment publishes with its own Deployment Settings."
              >
                <div
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                  aria-hidden="true"
                >
                  <Skeleton
                    v-for="row in 2"
                    :key="row"
                    height="var(--size-16)"
                  />
                </div>
              </SettingsSection>

              <span
                class="sr-only"
                role="status"
              >
                Loading the resources and environments for this deployment.
              </span>
            </div>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
                type="submit"
                disabled
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
