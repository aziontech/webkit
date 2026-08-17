<script setup>
  // New Settings — authoring a deployment STRATEGY.
  //
  // The counterpart of the release page, and the reason the Deployments module has
  // two create actions instead of one:
  //
  //   New release     → a real deploy, applying one or more strategies
  //   New Settings    → the STRATEGY itself, applied by many deployments
  //
  // A strategy is the reusable half of the request body Azion accepts for a
  // deployment (../ReleaseComposer.vue composes the whole of it):
  //
  //   strategy: { type: 'default', attributes: { application, firewall, custom_page } }
  //
  // Firewall and custom page are the two nullable attributes — separate resources in
  // Azion, created in their own modules and BOUND here. That binding is what makes a
  // strategy worth naming: "waf-strict + branded-errors" is a decision a team makes
  // once and then applies to every deployment that should behave that way.
  //
  // `application` is optional on purpose. Left open, the strategy binds whichever
  // application the deploy is for — so the same strategy is usable from every
  // resource page (which is what "Azion Default" is). Pinned, it becomes a strategy
  // for one application.
  //
  // `type` is not a field: `default` is the only strategy type the platform exposes,
  // so it rides in the body as a constant instead of as a Select with one option.
  //
  // FORM — Drawer form, FIELDS SEPARATED (`/webkit-form` Approach B), the same shape
  // as ./AddVariableDrawer.vue: flat triads on the panel surface — a real
  // `<Label for>`, the control, and its own message wired through `aria-describedby`,
  // surfaced only after a failed submit — with a single full-bleed `Divider` splitting
  // WHAT the strategy is (name, active) from WHAT it binds (the three attributes). A
  // composed `Select` labels its TRIGGER, never the wrapper. Fields sit at the compact
  // modal-body step (`--spacing-md`), one `submitting` flag locks the scope, and the
  // `sr-only` submit keeps Enter working.
  //
  // NESTED — opened from the deploy drawer, this is the child of the pair
  // (`:nested`), so it stacks above the parent panel (overlay `z-[1002]`, content
  // `z-[1003]`) and the parent keeps everything the user had filled in.
  import Button from '@aziontech/webkit/button'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { APPLICATIONS } from '@shared/lib/applications'
  import { provisionedApplications } from '@shared/lib/provisioning'
  import { computed, reactive, ref, useId, watch } from 'vue'

  import {
    addStrategy,
    CUSTOM_PAGE_OPTIONS,
    FIREWALL_OPTIONS
  } from '../../lib/data/deployment-strategies'

  const open = defineModel('open', { type: Boolean, default: false })

  defineProps({
    // True when this drawer is stacked over another one (opened from the deploy
    // drawer's Deployment Settings Select). Each drawer stays its own form with its
    // own scoped save; this only raises the panel above the parent's — the template
    // reads `nested` directly.
    nested: { type: Boolean, default: false }
  })

  const emit = defineEmits(['create'])

  // One id namespace per instance, so every `for` ↔ control pair stays unique.
  const scope = useId()
  const nameFieldId = `${scope}-name`
  const fieldIds = {
    application: `${scope}-application`,
    firewall: `${scope}-firewall`,
    customPage: `${scope}-custom-page`
  }

  // "Not bound" is a real choice, not an empty field: `firewall` and `custom_page`
  // are nullable in the request body, and most strategies leave them null.
  const NOT_BOUND = { value: '', label: 'Not bound' }
  const ANY_APPLICATION = { value: '', label: 'The application being deployed' }

  const applicationOptions = computed(() => [
    ANY_APPLICATION,
    ...[...provisionedApplications.value, ...APPLICATIONS].map((application) => ({
      value: application.name,
      label: application.name
    }))
  ])
  const firewallOptions = [NOT_BOUND, ...FIREWALL_OPTIONS]
  const customPageOptions = [NOT_BOUND, ...CUSTOM_PAGE_OPTIONS]

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    name: '',
    application: '',
    firewall: '',
    customPage: '',
    active: true
  })
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) return
    form.name = ''
    form.application = ''
    form.firewall = ''
    form.customPage = ''
    form.active = true
    errors.name = ''
    submitting.value = false
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.name
  }

  const cancel = () => {
    open.value = false
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const strategy = addStrategy({
        name: form.name,
        application: form.application,
        firewall: form.firewall,
        customPage: form.customPage,
        active: form.active
      })
      open.value = false
      emit('create', strategy)
    } finally {
      submitting.value = false
    }
  }

  // The three attributes of `strategy.attributes`, one triad each. They share a shape,
  // so the template renders them from a small model instead of repeating the markup.
  const bindingFields = computed(() => [
    {
      key: 'application',
      id: fieldIds.application,
      label: 'Application',
      hint: 'Leave it open and the strategy works for every application; pin one to scope it.',
      options: applicationOptions.value
    },
    {
      key: 'firewall',
      id: fieldIds.firewall,
      label: 'Firewall',
      hint: 'Inspects requests before they reach the application.',
      options: firewallOptions
    },
    {
      key: 'customPage',
      id: fieldIds.customPage,
      label: 'Custom Page',
      hint: 'Answers 4xx / 5xx instead of the platform default page.',
      options: customPageOptions
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
      <DrawerOverlay :class="nested ? 'z-[1002]' : undefined" />
      <DrawerContent :class="nested ? 'z-[1003]' : undefined">
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="New Deployment Settings"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>New Deployment Settings</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A strategy binds an application, and optionally a firewall and a custom page.
                Deployments started from any resource apply it.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- Compact modal body: fields --spacing-md apart. One flag locks the whole
                 scope while the request is in flight. -->
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">New Deployment Settings</legend>

              <!-- WHAT the strategy is. -->
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <Label
                  :for="nameFieldId"
                  required
                  >Name</Label
                >
                <FieldText
                  v-model="form.name"
                  :input-id="nameFieldId"
                  name="name"
                  size="large"
                  placeholder="production-hardened"
                  :disabled="submitting"
                  :required="!!errors.name"
                  :helper-text="
                    errors.name || 'How this strategy reads in the Deployment Settings field.'
                  "
                  @update:model-value="errors.name = ''"
                />
              </div>

              <FieldSwitchBlock
                v-model="form.active"
                label="Active"
                description="When disabled, the strategy stays in the list but no deployment can apply it."
                :disabled="submitting"
              />

              <!-- Full-bleed boundary: what the strategy IS, above; what it BINDS,
                   below. The wrapper carries the negative inset so the Divider itself
                   stays untouched. -->
              <div class="-mx-(--spacing-lg)">
                <Divider />
              </div>

              <!-- `strategy.attributes` — one triad per attribute. None is required:
                   an open application means "whatever is being deployed", and both
                   bindings are nullable. -->
              <div
                v-for="field in bindingFields"
                :key="field.key"
                class="flex w-full flex-col gap-(--spacing-xs)"
              >
                <Label :for="field.id">{{ field.label }}</Label>
                <Select
                  v-model="form[field.key]"
                  size="large"
                  class="w-full"
                  :disabled="submitting"
                  :display-value="labelFor(field.options)"
                >
                  <Select.Trigger
                    :id="field.id"
                    :aria-describedby="`${field.id}-message`"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in field.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <HelperText
                  :id="`${field.id}-message`"
                  :label="field.hint"
                />
              </div>
            </fieldset>
          </PanelContent>

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              class="w-full md:w-auto"
              label="Create Settings"
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
              Create Settings
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
