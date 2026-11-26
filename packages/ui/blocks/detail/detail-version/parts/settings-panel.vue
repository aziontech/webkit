<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { VersionDetailSettings } from '../detail-version.vue'

  export interface SettingsPanelProps {
    /** Resource name, read in the fieldset legend. */
    resourceName: string
    /** Version name, read in the fieldset legend. */
    versionName: string
    /** Whether the version is an editable draft. */
    isDraft: boolean
  }

  defineProps<SettingsPanelProps>()

  const form = defineModel<VersionDetailSettings>('form', { required: true })

  const defaultModules = [
    {
      key: 'protocol_optimization',
      title: 'Protocol Optimization',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Detect device types to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on every request.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
</script>

<template>
  <section
    class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
  >
    <ScrollArea
      aria-label="Version settings"
      fade
    >
      <div class="flex min-h-full flex-col">
        <fieldset
          :disabled="!isDraft"
          class="contents"
        >
          <legend class="sr-only">
            {{ resourceName }} {{ versionName }}{{ isDraft ? '' : ', read-only' }}
          </legend>
          <form
            class="flex min-h-full flex-col"
            aria-label="Main settings"
            novalidate
            @submit.prevent
          >
            <div
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
            >
              <PageHeader
                title="Settings"
                description="Core configuration for this resource."
                size="small"
              />

              <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
                <legend class="sr-only">Main settings</legend>

                <SettingsGroup
                  label="General"
                  hint="How this resource is identified across the console, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="Name"
                          description="A unique and descriptive name to identify the resource."
                        >
                          <Input
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                          />
                        </SettingsRow>
                        <SettingsRow
                          title="Active"
                          description="When disabled, the resource stops serving traffic."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Modules"
                  hint="The capabilities this resource runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="WebSocket Proxy"
                          variant="compact"
                        >
                          <template #description>
                            Enhance real-time data exchange between your resource and backend
                            services using the WebSocket protocol.
                            <Link
                              href="https://example.com/contact-sales"
                              target="_blank"
                              inline
                              >Contact sales</Link
                            >
                          </template>
                          <Tooltip content="Contact sales to activate this module.">
                            <Switch
                              v-model="form.modules.web_socket_proxy"
                              disabled
                              aria-label="WebSocket Proxy"
                            />
                          </Tooltip>
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>
              </fieldset>
            </div>
          </form>
        </fieldset>
      </div>
    </ScrollArea>
  </section>
</template>
