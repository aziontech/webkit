<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { provideDataStream } from '../use-data-stream'
  import DataStreamDestinationGroup from './data-stream-destination-group.vue'
  import DataStreamInputRow from './data-stream-input-row.vue'
  import DataStreamSamplingGroup from './data-stream-sampling-group.vue'
  import DataStreamSourceGroup from './data-stream-source-group.vue'
  import DataStreamTemplateGroup from './data-stream-template-group.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  const { form, saving, dirty, save, discard, leave } = provideDataStream()
</script>

<template>
  <form
    class="flex min-h-0 min-w-0 flex-1 flex-col"
    aria-label="Data stream settings"
    novalidate
    @submit.prevent="save"
  >
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Ship the records of your workloads to your own observability or storage platform. One stream, one destination."
        size="small"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Data stream settings</legend>

        <SettingsGroup
          label="General"
          hint="How the stream is identified, and whether it is collecting records."
          anchor="general"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <TransitionGroup
                  enter-active-class="animate-content-enter motion-reduce:animate-none"
                >
                  <DataStreamInputRow
                    key="name"
                    field="name"
                    title="Name"
                    description="Give a unique and descriptive name to identify the data stream."
                    label="Name"
                    placeholder="my-data-stream"
                  />
                  <SettingsRow
                    key="active"
                    title="Active"
                    description="When off, the stream stops collecting records and nothing is sent to the destination."
                    variant="compact"
                  >
                    <Switch
                      v-model="form.active"
                      aria-label="Active"
                      :disabled="saving"
                    />
                  </SettingsRow>
                </TransitionGroup>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <DataStreamSourceGroup />

        <DataStreamSamplingGroup />

        <DataStreamTemplateGroup />

        <DataStreamDestinationGroup />
      </fieldset>
    </div>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      Data stream settings changed.
      <span class="text-(--text-muted)">Saving sends one test record to the destination.</span>
    </SettingsSaveBar>
  </form>
</template>
