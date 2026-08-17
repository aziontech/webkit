<script setup>
  // Link Deployment Settings — the sub-drawer opened from an environment row in the
  // Environments section of Create Workload. It binds a Deployment Settings bundle
  // to one environment, and the resources it carries (Application, Firewall, and a
  // Custom Page) each at a chosen version. On save it emits the linked bundle back
  // to the parent, which flips that environment row from "unlinked" to "linked".
  //
  // Same discipline as every form drawer: one `submitting` flag locks the scope,
  // validation runs on submit only, and the drawer resets when it closes. ONE commit,
  // alone on the right — the X, the overlay and Escape are already the dismissal.
  //
  // IT IS AN ITEMGROUP FORM (Approach A), not a column of stacked label+control triads.
  // Seven controls across four decisions is a grouped, config-heavy create — the case the
  // form standard puts in Cards + ItemGroups: overline-titled sections, each a header-less
  // flush CardBox whose body is an Item.List of rows. The rows are `ui/FieldRow.vue`, the
  // same row every create page and in-resource drawer in this console is built from, so
  // this drawer and the page that opens it are one anatomy instead of two.
  //
  // IN AN ITEMGROUP THE ROW IS THE LABEL. There is no `<Label for>` here: `Item.Title`
  // names the field, `Item.Description` carries its guidance, and the control takes an
  // `aria-label` — which is why a row can hold TWO controls (a resource and its version)
  // and still name both, something a single `<label for>` cannot do. FieldRow also owns
  // the message column, so a HelperText appearing on a failed submit pushes nothing
  // sideways, and points the control's `aria-describedby` at it through its slot prop.
  //
  // Same discipline as every form drawer: one `submitting` flag locks the scope — the
  // native `<fieldset :disabled>` AND `:disabled` on every control, since a webkit Select
  // draws its disabled visual from its own prop, not from an ancestor fieldset.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldRow from '../form/FieldRow.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    // The environment this bundle links to; drives the title and the emitted record.
    environment: { type: String, default: 'Production' }
  })

  const emit = defineEmits(['link'])

  const title = computed(() => `Link Deployment Settings to ${props.environment}`)

  const bundleOptions = [
    { value: 'default', label: 'Default Deployment' },
    { value: 'azion', label: 'Azion Deployment' },
    { value: 'custom', label: 'Custom Bundle' }
  ]
  const applicationOptions = [
    { value: 'my-app', label: 'My app' },
    { value: 'web', label: 'web-frontend' },
    { value: 'api', label: 'api-gateway' }
  ]
  const firewallOptions = [
    { value: 'default-fw', label: 'Default Firewall' },
    { value: 'edge-fw', label: 'edge-firewall' }
  ]
  const customPageOptions = [
    { value: 'default-page', label: 'Default Custom Page' },
    { value: 'maintenance', label: 'maintenance-page' }
  ]
  const versionOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'v2', label: 'v2.0.0' },
    { value: 'v1', label: 'v1.0.0' }
  ]

  const labelFor = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    bundle: '',
    application: '',
    applicationVersion: 'latest',
    firewall: '',
    firewallVersion: 'latest',
    customPage: '',
    customPageVersion: 'latest'
  })
  const errors = reactive({
    bundle: '',
    application: '',
    firewall: '',
    customPage: ''
  })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) return
    form.bundle = ''
    form.application = ''
    form.applicationVersion = 'latest'
    form.firewall = ''
    form.firewallVersion = 'latest'
    form.customPage = ''
    form.customPageVersion = 'latest'
    errors.bundle = ''
    errors.application = ''
    errors.firewall = ''
    errors.customPage = ''
  })

  const validate = () => {
    errors.bundle = form.bundle ? '' : 'Select a deployment settings bundle.'
    errors.application = form.application ? '' : 'Select an application.'
    errors.firewall = form.firewall ? '' : 'Select a firewall.'
    errors.customPage = form.customPage ? '' : 'Select a custom page.'
    return !errors.bundle && !errors.application && !errors.firewall && !errors.customPage
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('link', {
        environment: props.environment,
        bundle: labelFor(bundleOptions)(form.bundle),
        application: {
          name: labelFor(applicationOptions)(form.application),
          version: labelFor(versionOptions)(form.applicationVersion)
        },
        firewall: {
          name: labelFor(firewallOptions)(form.firewall),
          version: labelFor(versionOptions)(form.firewallVersion)
        },
        customPage: {
          name: labelFor(customPageOptions)(form.customPage),
          version: labelFor(versionOptions)(form.customPageVersion)
        }
      })
      open.value = false
    } finally {
      submitting.value = false
    }
  }

  // The three resource rows share one shape, so the template renders them from a
  // small model to avoid repeating the Select markup four times.
  const resourceRows = computed(() => [
    {
      key: 'application',
      label: 'Application',
      description: 'Answers the requests that reach this environment.',
      options: applicationOptions,
      valueKey: 'application',
      versionKey: 'applicationVersion',
      error: errors.application
    },
    {
      key: 'firewall',
      label: 'Firewall',
      description: 'Inspects traffic before the application sees it.',
      options: firewallOptions,
      valueKey: 'firewall',
      versionKey: 'firewallVersion',
      error: errors.firewall
    },
    {
      key: 'customPage',
      label: 'Custom Page',
      description: "Served in place of the application's own error responses.",
      options: customPageOptions,
      valueKey: 'customPage',
      versionKey: 'customPageVersion',
      error: errors.customPage
    }
  ])
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="title"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Choose the bundle this environment serves, and the version of each resource it
                carries.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- Sections are --layout-section-gap apart; each title sits
                 --layout-group-gap above its flush CardBox — the Approach A section
                 rhythm, identical to the create page this drawer opens from. -->
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>

              <!-- Section: which saved bundle serves this environment -->
              <section class="flex flex-col gap-(--layout-group-gap)">
                <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                  Deployment Settings
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <FieldRow
                        title="Bundle"
                        description="The saved bundle this environment serves."
                        :message="errors.bundle"
                        message-kind="required"
                      >
                        <template #default="{ messageId }">
                          <Select
                            v-model="form.bundle"
                            size="large"
                            class="w-full"
                            placeholder="Select an option"
                            :disabled="submitting"
                            :required="!!errors.bundle"
                            :display-value="labelFor(bundleOptions)"
                            @update:model-value="errors.bundle = ''"
                          >
                            <!-- The accessible name goes on the TRIGGER: Select's attrs
                                 land on its wrapper div, and labelling a wrapper labels
                                 nothing. Same for aria-describedby. -->
                            <Select.Trigger
                              aria-label="Bundle"
                              :aria-describedby="messageId"
                            />
                            <Select.Content class="z-[1002]!">
                              <Select.Option
                                v-for="option in bundleOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </template>
                      </FieldRow>
                    </Item.List>
                  </template>
                </CardBox>
              </section>

              <!-- Section: what the bundle carries. Each resource and its version are ONE
                   decision, so they share a row: the row's title names the resource and
                   each control carries its own aria-label, which is what lets a second
                   control sit beside the first without three identical "Version" fields
                   in the tab order. `wide` because two selects cannot work in 256px. -->
              <section class="flex flex-col gap-(--layout-group-gap)">
                <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                  Resources
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <FieldRow
                        v-for="row in resourceRows"
                        :key="row.key"
                        kind="wide"
                        :title="row.label"
                        :description="row.description"
                        :message="row.error"
                        message-kind="required"
                      >
                        <template #default="{ messageId }">
                          <div class="flex min-w-0 gap-(--spacing-sm)">
                            <Select
                              v-model="form[row.valueKey]"
                              size="large"
                              class="min-w-0 flex-[2]"
                              placeholder="Select an option"
                              :disabled="submitting"
                              :required="!!row.error"
                              :display-value="labelFor(row.options)"
                              @update:model-value="errors[row.key] = ''"
                            >
                              <Select.Trigger
                                :aria-label="row.label"
                                :aria-describedby="messageId"
                              />
                              <Select.Content class="z-[1002]!">
                                <Select.Option
                                  v-for="option in row.options"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>

                            <Select
                              v-model="form[row.versionKey]"
                              size="large"
                              class="min-w-0 flex-1"
                              :disabled="submitting"
                              :display-value="labelFor(versionOptions)"
                            >
                              <Select.Trigger :aria-label="`${row.label} version`" />
                              <Select.Content class="z-[1002]!">
                                <Select.Option
                                  v-for="option in versionOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </div>
                        </template>
                      </FieldRow>
                    </Item.List>
                  </template>
                </CardBox>
              </section>
            </fieldset>
          </PanelContent>

          <!-- One commit, alone on the right. See the note at the top of the file. -->
          <PanelFooter class="md:justify-end">
            <Button
              class="w-full md:w-auto"
              label="Link Settings"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Link Settings
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
