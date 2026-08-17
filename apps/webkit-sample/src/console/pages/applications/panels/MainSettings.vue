<script setup>
  // Application → Main Settings. Core configuration for one edge application, shaped as
  // TWO ItemGroups — General and Modules — committed as ONE page.
  //
  // ONE SAVE FOR THE PAGE, from the shared bar (../../components/ui/SettingsSaveBar.vue),
  // which is the rule for every internal settings surface in the console: the bands
  // describe one record, so they commit together, and the page keeps one `saving` flag and
  // one baseline. `useBaseline` snapshots the saved state and reports dirty only while the
  // live values diverge from it, which is what brings the bar in on the first real edit
  // and takes it away when the save lands.
  //
  // LAYOUT — the same pattern as Create Application: a Section (title + a `Hint` glyph,
  // never a paragraph) over a flush CardBox whose body is an Item.List, on the form
  // measure. A create page and the settings page it becomes are then the same object seen
  // twice — same bands, same rows, same order — so nothing has to be relearned after the
  // first save.
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

  const props = defineProps({
    // The application being configured — `{ id, name }`.
    application: { type: Object, required: true }
  })

  // ONE SAVE FOR THE PAGE. The two bands used to own independent saves in their
  // own card footers. That is right for a page whose groups are separate records;
  // here they are one application, and a per-band Save asked the reader to notice
  // which footer belonged to the switch they just flipped — and to press it twice
  // when they changed something in each.
  //
  // So the page has ONE editable object, one baseline, one Save. `useBaseline`
  // reports dirty only while the live values diverge from the last committed
  // snapshot, which is also what decides whether the action bar exists at all.
  const settings = reactive({
    name: props.application.name,
    active: true,
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

  // `useBaseline` reports dirtiness but does not hand the snapshot back, so the
  // page keeps its own copy — that copy is what Discard restores.
  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

  const save = () =>
    saveGroup(saving, 'Settings saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })

  // Discard returns every field to the last saved state in one step — the way out
  // of an edit the user changed their mind about, which a page-level bar owes them:
  // without it the only way back is to undo each field by hand and hope the bar
  // disappears.
  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
  }

  // The shell marks this tab and asks before letting the reader leave it: the bar below
  // sits in the same place as the Rules Engine tab's, and neither tab can see the
  // other's pending work (../../lib/tab-dirty.js).
  useTabDirty(
    'main-settings',
    { dirty, saving },
    { label: 'Application settings changed.', save, discard }
  )

  // The module catalog. `defaultModules` ship on every plan and are all
  // user-toggleable — including Cache, which is enabled by default in every account
  // but can be turned off here. `subscriptionModules` are paid add-ons closed by a
  // "Contact sales" CTA. Toggle state lives in the `modules` object above, so the
  // group's dirty tracking and independent Save keep working unchanged.
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
      description: 'Build ultra-low latency functions that run on the edge.'
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
  <!-- ONE form for the page: every band edits the same application record, so one
       submit commits all of it. -->
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
        title="Main Settings"
        description="Core configuration for this edge application."
        size="small"
      />

      <!-- One flag locks every control while the request is in flight. -->
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
          hint="How this application is identified across the console, and whether it is serving traffic at the edge."
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
                      When disabled, the application stops serving traffic at the edge.
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
          hint="The capabilities this application runs with. Every default module can be toggled here, including Cache."
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

        <!-- Locked capabilities with a sales path: no form, nothing to save. -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Subscription modules"
          hint="Paid add-ons. They cannot be switched on from this page — activating one starts with a conversation with sales."
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
                      <!-- The way forward lives on the ROW: a Tooltip panel is
                           `pointer-events-none`, so a link inside one could never be
                           clicked or tabbed to. -->
                      <a
                        :href="CONTACT_SALES"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                      >
                        Contact sales
                        <i
                          class="pi pi-external-link shrink-0 text-[0.9em] leading-none"
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

    <!-- ONE bar for the page, from the one component every settings surface in the
         console uses (../../components/ui/SettingsSaveBar.vue). It owns the placement,
         the entrance and the Discard/Save pair; this page only says whether there is
         anything to commit. -->
    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Application settings changed."
      hint="Saving publishes them to the edge on the next deployment."
      @save="save"
      @discard="discard"
    />
  </form>
</template>
