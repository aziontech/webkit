<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Kbd from '@aziontech/webkit/kbd'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  export interface DeployDrawerFrameProps {
    /** One line under the title; empty for none. */
    description?: string
    /** The deploy targets are loading: skeletons stand in for the body. */
    loading?: boolean
    /** Deploy cannot run: the button is disabled and submit does nothing. */
    blocked?: boolean
    /** The id of the footer text that says why Deploy cannot run. */
    reasonId?: string
  }

  const props = withDefaults(defineProps<DeployDrawerFrameProps>(), {
    description: '',
    loading: false,
    blocked: false,
    reasonId: ''
  })

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** The sections of the drawer body. */
    default(): unknown
    /** What sits before Deploy in the footer, such as why it cannot run. */
    'footer-start'(): unknown
  }>()

  const formEl = ref<HTMLFormElement | null>(null)

  const onSubmit = () => {
    if (!props.blocked) open.value = false
  }

  useShortcuts({
    keys: 'meta+enter',
    label: 'Deploy',
    group: 'Drawer',
    element: formEl,
    when: () => open.value && !props.blocked,
    handler: () => formEl.value?.requestSubmit()
  })
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
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Deploy"
        novalidate
        @submit.prevent="onSubmit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Deploy</DrawerTitle>
            <p
              v-if="description"
              class="text-body-sm text-(--text-muted)"
            >
              {{ description }}
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div
            v-if="loading"
            class="flex min-w-0 flex-col"
            aria-busy="true"
          >
            <SettingsGroup
              label="Resources"
              hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
            >
              <div aria-hidden="true">
                <Skeleton height="var(--size-40)" />
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Environment"
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
            </SettingsGroup>

            <span
              class="sr-only"
              role="status"
            >
              Loading the resources and environments for this deployment.
            </span>
          </div>
          <slot v-else />
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <slot name="footer-start">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
            </slot>
            <Button
              variant="primary"
              size="medium"
              type="submit"
              :disabled="blocked"
              :aria-describedby="reasonId || undefined"
              :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
            >
              Deploy
              <Kbd
                meta
                key-name="enter"
                size="small"
                aria-hidden="true"
              />
            </Button>
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
