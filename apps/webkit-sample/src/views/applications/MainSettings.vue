<script setup>
  // Application → Main Settings. Core configuration for one edge application,
  // shaped as TWO ItemGroups with INDEPENDENT saves (the /form skill's Approach A):
  // General and Modules. Each topic group owns its OWN footer Save and locks
  // INDEPENDENTLY off its own submitting flag — that group's fields and its Save
  // disable while its request runs, and the group beside it stays live.
  //
  // A group's Save stays DISABLED until that group is actually edited: `useBaseline`
  // keeps a snapshot of the saved state and reports dirty only while the live values
  // diverge from it. Saving commits a new baseline, so Save disables again until the
  // next edit — an unchanged group has nothing to save.
  //
  // LAYOUT — this band picks its own measure. Main Settings is a single stacked
  // column of fields, so it takes the FORM measure (`.layout-column-form`, 1192px):
  // past ~1200px the extra width lands entirely inside the controls, leaving a label
  // at the far left of the row from the input it names. The Build tab beside it
  // carries a table and so measures as data — per layout.css, the unit that picks a
  // class is the BAND, not the file, and a tabbed module is several pages in one
  // route.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { reactive, ref } from 'vue'

  import PageHeading from '../../components/ui/PageHeading.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { saveGroup, useBaseline } from '../../lib/forms'

  const props = defineProps({
    // The application being configured — `{ id, name }`.
    application: { type: Object, required: true }
  })

  // ── Group 1 — General ─────────────────────────────────────────────────────
  const general = reactive({
    name: props.application.name,
    active: true
  })
  const savingGeneral = ref(false)
  const { dirty: generalDirty, commit: commitGeneral } = useBaseline(general)

  const saveGeneral = () => saveGroup(savingGeneral, 'General settings saved.', commitGeneral)

  // ── Group 2 — Modules ─────────────────────────────────────────────────────
  const modules = reactive({
    applicationAccelerator: true,
    cache: true,
    deviceDetection: false,
    functions: true,
    imageProcessor: false,
    loadBalancer: false,
    webSocketProxy: false
  })
  const savingModules = ref(false)
  const { dirty: modulesDirty, commit: commitModules } = useBaseline(modules)

  const saveModules = () => saveGroup(savingModules, 'Module settings saved.', commitModules)

  // The module catalog. `defaultModules` ship on every plan and are all
  // user-toggleable — including Cache, which is enabled by default in every account
  // but can be turned off here. `subscriptionModules` are paid add-ons closed by a
  // "Contact sales" CTA. Toggle state lives in the `modules` object above, so the
  // group's dirty tracking and independent Save keep working unchanged.
  const defaultModules = [
    {
      key: 'applicationAccelerator',
      title: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    {
      key: 'cache',
      title: 'Cache',
      description: 'Customize advanced cache settings.'
    },
    {
      key: 'deviceDetection',
      title: 'Device Detection',
      description: 'Activate DeviceAtlas variables to configure responsive rules.'
    },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Build ultra-low latency functions that run on the edge.'
    },
    {
      key: 'imageProcessor',
      title: 'Image Processor',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'loadBalancer',
      title: 'Load Balancer',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const subscriptionModules = [
    {
      key: 'webSocketProxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.'
    }
  ]
  // `label` is the group's ACCESSIBLE name (the fieldset legend), always present.
  // `titled` is what decides whether it also renders as a visible sub-heading: the
  // default group is the band's subject, already named by the "Modules" section
  // title above it, so a second "Default Modules" line only repeats it. The
  // subscription group is the exception that needs naming — it is a different kind
  // of module, so it keeps its muted sub-heading.
  const moduleSections = [
    { id: 'default', label: 'Default modules', titled: false, modules: defaultModules },
    {
      id: 'subscription',
      label: 'Subscription modules',
      titled: true,
      modules: subscriptionModules
    }
  ]
</script>

<template>
  <div
    class="layout-column-form layout-boundary flex min-w-0 flex-col"
  >
    <PageHeading
      title="Main Settings"
      description="Core configuration for this edge application."
      size="small"
    />

    <section class="layout-section-start flex flex-col gap-[var(--layout-section-gap)]">
      <!-- Group 1 — General (section title, its own footer save). -->
      <form
        class="flex flex-col gap-[var(--layout-group-gap)]"
        aria-label="General settings"
        novalidate
        @submit.prevent="saveGeneral"
      >
        <SectionHeading
          title="General"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingGeneral"
            >
              <legend class="sr-only">General</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Name</Item.Title>
                    <Item.Description>
                      A unique and descriptive name to identify the application.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="general.name"
                      size="large"
                      :disabled="savingGeneral"
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
                      v-model="general.active"
                      aria-label="Active"
                      :disabled="savingGeneral"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingGeneral"
                :disabled="!generalDirty"
                @click="saveGeneral"
              />
            </div>
          </template>
        </CardBox>
      </form>

      <!-- Group 2 — Modules (its own independent Save). Keeps the ItemGroup pattern
           (Item.Title label + description left, Switch right), split into two
           CardBoxes: the default modules (ship on every plan) sit straight under
           the "Modules" title, unlabelled — that title already names them; the
           paid add-ons below carry the muted "Subscription modules" sub-heading
           and are closed by a "Contact sales" CTA. Every default module is
           user-toggleable — Cache ships on in every account but can be turned off
           here. One footer Save commits the group. -->
      <form
        class="flex flex-col gap-[var(--layout-group-gap)]"
        aria-label="Module settings"
        novalidate
        @submit.prevent="saveModules"
      >
        <SectionHeading
          title="Modules"
          anchor
          documentation="https://www.azion.com/en/documentation/"
        />

        <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
          <section
            v-for="group in moduleSections"
            :key="group.id"
            class="flex flex-col gap-[var(--spacing-sm)]"
          >
            <!-- Only a group the "Modules" title does not already name gets a
                 visible label — and at the subordinate scale, not a second
                 section title. The default group carries none: it IS the band. -->
            <SectionHeading
              v-if="group.titled"
              size="small"
              :title="group.label"
            />
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingModules"
                >
                  <legend class="sr-only">{{ group.label }}</legend>
                  <Item.List>
                    <Item
                      v-for="mod in group.modules"
                      :key="mod.key"
                      size="small"
                    >
                      <Item.Content>
                        <Item.Title>{{ mod.title }}</Item.Title>
                        <Item.Description>{{ mod.description }}</Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <!-- Subscription modules can't be toggled directly —
                             activation is sales-driven, surfaced as a tooltip on
                             the (disabled) switch. -->
                        <Tooltip
                          v-if="group.id === 'subscription'"
                          text="Contact sales to activate this module."
                        >
                          <Switch
                            v-model="modules[mod.key]"
                            disabled
                            :aria-label="mod.title"
                          />
                        </Tooltip>
                        <Switch
                          v-else
                          v-model="modules[mod.key]"
                          :disabled="savingModules"
                          :aria-label="mod.title"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <!-- Only the Default modules are user-toggleable, so the group's Save
                   lives in the Default card footer (same footer-Save pattern as
                   General). The Subscription card has no footer — activation is
                   sales-driven (see the switch tooltip). -->
              <template
                v-if="group.id === 'default'"
                #footer
              >
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingModules"
                    :disabled="!modulesDirty"
                    @click="saveModules"
                  />
                </div>
              </template>
            </CardBox>
          </section>
        </div>
      </form>
    </section>
  </div>
</template>
