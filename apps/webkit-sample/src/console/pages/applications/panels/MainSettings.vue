<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { reactive, ref } from 'vue'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { useVersionChange } from '../../../lib/behavior/version-commit'

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const settings = reactive({
    name: props.application.name,
    active: props.application.active !== false,
    modules: {
      application_accelerator: true,
      cache: true,
      device_detection: false,
      functions: true,
      image_processor: false,
      load_balancer: false,
      web_socket_proxy: false
    }
  })

  const saving = ref(false)
  const { dirty, commit } = useBaseline(settings)

  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

  const noteChange = useVersionChange()

  const save = () =>
    saveGroup(saving, 'Settings saved.', () => {
      commit()
      noteChange('Update application settings')
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })

  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
  }

  useTabDirty(
    'main-settings',
    { dirty, saving },
    { label: 'Application settings changed.', save, discard }
  )

  const defaultModules = [
    {
      key: 'application_accelerator',
      title: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    {
      key: 'cache',
      title: 'Cache',
      description: 'Customize advanced cache settings.'
    },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Activate DeviceAtlas variables to configure responsive rules.'
    },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Build ultra-low latency functions that run on Azion.'
    },
    {
      key: 'image_processor',
      title: 'Image Processor',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancer',
      title: 'Load Balancer',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const subscriptionModules = [
    {
      key: 'web_socket_proxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.'
    }
  ]
  const CONTACT_SALES = 'https://www.azion.com/en/contact-sales/'
</script>

<template>
  <form
    class="flex min-h-full flex-col"
    aria-label="Main settings"
    novalidate
    @submit.prevent="save"
  >
    <div
      class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
    >
      <PageHeading
        title="Settings"
        description="Core configuration for this application."
        size="small"
      />

      <fieldset
        class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Main settings</legend>

        <Section
          stacked
          anchor
          :divided="false"
          title="General"
          hint="How this application is identified across the console, and whether it is serving traffic."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Name</Item.Title>
                    <Item.Description>
                      A unique and descriptive name to identify the application.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputText
                      v-model="settings.name"
                      size="large"
                      :disabled="saving"
                      class="w-full"
                      aria-label="Name"
                    />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Active</Item.Title>
                    <Item.Description>
                      When disabled, the application stops serving traffic.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="settings.active"
                      aria-label="Active"
                      :disabled="saving"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="Modules"
          hint="The capabilities this application runs with, each of which can be toggled here."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="mod in defaultModules"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>{{ mod.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="settings.modules[mod.key]"
                      :aria-label="mod.title"
                      :disabled="saving"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="Subscription modules"
          hint="Paid add-ons that are activated with sales, not from this page."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="mod in subscriptionModules"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>
                      {{ mod.description }}
                      <a
                        :href="CONTACT_SALES"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                      >
                        Contact sales
                        <i
                          class="pi pi-external-link shrink-0 text-body-sm leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Tooltip text="Contact sales to activate this module.">
                      <Switch
                        v-model="settings.modules[mod.key]"
                        disabled
                        :aria-label="mod.title"
                      />
                    </Tooltip>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </fieldset>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Application settings changed."
      hint="Saving publishes them on the next deployment."
      @save="save"
      @discard="discard"
    />
  </form>
</template>
