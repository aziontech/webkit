<script setup>
  // Create Deployment Settings — authoring a deployment STRATEGY.
  //
  // The counterpart of the release page, and the reason the Deployments module has
  // two create actions instead of one:
  //
  //   Create release              → a real deploy, applying one or more strategies
  //   Create Deployment Settings  → the STRATEGY itself, applied by many deployments
  //
  // WHAT THE READER FILLS IN, in the three bands the console's own create form uses:
  //
  //   General            name, an internal description, and whether it can be applied
  //   Routing and policy how versions bind resources, and how many take traffic
  //   Bindings           the `strategy.attributes` half of the request body
  //
  // A strategy is the reusable half of the request body Azion accepts for a
  // deployment (../../pages/deployments/ReleaseComposer.vue composes the whole of it):
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
  // FORM — ../form/ResourceDrawer.vue (the one shell every in-resource create uses:
  // one `<form novalidate>`, one `submitting` flag locking the body fieldset, Save
  // alone on the right because the X, the overlay and Escape are already the
  // dismissal). Inside it, `Section` bands and ../form/FieldStack.vue triads — a real
  // `<Label for>`, the control at full measure, and ONE auxiliary line under it that
  // carries the guidance until a failed submit replaces it with the message. A
  // composed `Select` labels its TRIGGER, never the wrapper.
  //
  // The two policy groups are real `<fieldset>`/`<legend>` sets, because a radio
  // family's accessible name is its legend and a `<Label for>` can only point at one
  // of its members. Both start answered (`strict` / `single`, the platform's own
  // defaults), so neither can fail a submit — Name is the only required answer.
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Textarea from '@aziontech/webkit/textarea'
  import { APPLICATIONS } from '@shared/lib/applications'
  import { provisionedApplications } from '@shared/lib/provisioning'
  import { computed, reactive, ref, useId, watch } from 'vue'

  import {
    addStrategy,
    BINDING_POLICIES,
    CUSTOM_PAGE_OPTIONS,
    DEFAULT_BINDING_POLICY,
    DEFAULT_VERSION_POLICY,
    FIREWALL_OPTIONS,
    VERSION_POLICIES
  } from '../../lib/data/deployment-strategies'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const emit = defineEmits(['create'])

  // One id namespace per instance, so two radios of the same family never share a
  // DOM id with another instance of this drawer.
  const scope = useId()

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

  const blankForm = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: DEFAULT_BINDING_POLICY,
    versionPolicy: DEFAULT_VERSION_POLICY,
    application: '',
    firewall: '',
    customPage: ''
  })

  const form = reactive(blankForm())
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    submitting.value = false
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.name
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const strategy = addStrategy({ ...form })
      open.value = false
      emit('create', strategy)
    } finally {
      submitting.value = false
    }
  }

  // The three attributes of `strategy.attributes`, one triad each. They share a shape,
  // so the template renders them from a small model instead of repeating the markup.
  //
  // Each carries the PLACEHOLDER of its own unbound state. `Select` reads `''` as "no
  // selection" and falls back to the placeholder, so without one all three triggers
  // render as empty boxes and the reader cannot tell an unbound field from an
  // unanswered one. The placeholder is the same sentence the first option carries, so
  // picking it explicitly changes nothing on screen.
  const bindingFields = computed(() => [
    {
      key: 'application',
      label: 'Application',
      hint: 'Leave it open and the strategy works for every application; pin one to scope it.',
      placeholder: ANY_APPLICATION.label,
      options: applicationOptions.value
    },
    {
      key: 'firewall',
      label: 'Firewall',
      hint: 'Inspects requests before they reach the application.',
      placeholder: NOT_BOUND.label,
      options: firewallOptions
    },
    {
      key: 'customPage',
      label: 'Custom page',
      hint: 'Answers 4xx and 5xx instead of the platform default page.',
      placeholder: NOT_BOUND.label,
      options: customPageOptions
    }
  ])
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    title="Create Deployment Settings"
    description="A strategy binds an application, and optionally a firewall and a custom page. Deployments started from any resource apply it."
    save-label="Create Deployment Settings"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- ── General: what the strategy IS ── -->
    <Section
      stacked
      :divided="false"
      title="General"
      hint="How this strategy is identified in the Deployment Settings list and in the field that applies it."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Name"
          required
          description="How this strategy reads in the Deployment Settings field."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="production-hardened"
              autocomplete="off"
              :disabled="submitting"
              :required="!!errors.name"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>

        <!-- The description never reaches traffic: it is how a team recognizes one
             strategy among ten that bind the same firewall. -->
        <FieldStack
          label="Description"
          description="Optional. Used for internal identification."
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.description"
              class="w-full"
              placeholder="Storefront traffic for production"
              :disabled="submitting"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>

        <FieldSwitchBlock
          v-model="form.active"
          label="Active"
          description="When disabled, the strategy stays in the list but no deployment can apply it."
          :disabled="submitting"
        />
      </div>
    </Section>

    <!-- ── Routing and policy: how the versions it publishes behave ── -->
    <Section
      stacked
      :divided="false"
      title="Routing and policy"
      hint="How versions bind to the resources they ship with, and how traffic reaches them."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- A radio family's accessible name is its legend; the visible caption
             reuses `Label`, so it sits at the same step above its control as every
             other field in the drawer. -->
        <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <legend class="mb-(--spacing-xs) p-0">
            <Label
              required
              hint="Defines whether each version locks its resource IDs or allows them to change."
            >
              Binding policy
            </Label>
          </legend>
          <div class="flex flex-col gap-(--spacing-sm)">
            <FieldRadio
              v-for="policy in BINDING_POLICIES"
              :key="policy.value"
              v-model="form.bindingPolicy"
              :value="policy.value"
              name="binding-policy"
              :input-id="`${scope}-binding-${policy.value}`"
              :label="policy.label"
              :description="policy.description"
              :disabled="submitting"
            />
          </div>
        </fieldset>

        <!-- The one answer here that cannot be revised later, so the consequence is
             printed under the group rather than hidden behind the hint glyph. -->
        <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <legend class="mb-(--spacing-xs) p-0">
            <Label
              required
              hint="Defines how many versions can receive traffic."
            >
              Deployment version policy
            </Label>
          </legend>
          <div class="flex flex-col gap-(--spacing-sm)">
            <FieldRadio
              v-for="policy in VERSION_POLICIES"
              :key="policy.value"
              v-model="form.versionPolicy"
              :value="policy.value"
              name="version-policy"
              :input-id="`${scope}-version-${policy.value}`"
              :label="policy.label"
              :description="policy.description"
              :disabled="submitting"
            />
          </div>
          <HelperText label="Cannot be changed after the deployment is created." />
        </fieldset>
      </div>
    </Section>

    <!-- ── Bindings: `strategy.attributes` ── -->
    <Section
      stacked
      :divided="false"
      title="Bindings"
      hint="The resources this strategy attaches to a deployment. None is required: an open application means whichever one is being deployed, and both other bindings are nullable."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          v-for="field in bindingFields"
          :key="field.key"
          :label="field.label"
          :description="field.hint"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              v-model="form[field.key]"
              size="large"
              class="w-full"
              :disabled="submitting"
              :placeholder="field.placeholder"
              :display-value="labelFor(field.options)"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
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
          </template>
        </FieldStack>
      </div>
    </Section>
  </ResourceDrawer>
</template>
