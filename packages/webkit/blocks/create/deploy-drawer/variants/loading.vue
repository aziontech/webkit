<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelBody from '@aziontech/webkit/panel-body'
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
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="ai ai-cloud-upload"
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
          <div
            class="flex min-w-0 flex-col"
            aria-busy="true"
          >
            <SettingsSection
              title="Resources"
              hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
            >
              <div aria-hidden="true">
                <Skeleton height="var(--size-40)" />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Environment"
              hint="Where the deployment goes live. Each environment goes live with its own Deployment Settings."
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
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              type="submit"
              disabled
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
