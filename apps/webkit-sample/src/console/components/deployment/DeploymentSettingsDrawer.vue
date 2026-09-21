<script setup>
  // Create Deployment Settings — authoring a deployment STRATEGY.
  //
  // The counterpart of the release page, and the reason the Deployments module has
  // two create actions instead of one:
  //
  //   Create release              → a real deploy, applying one or more strategies
  //   Create Deployment Settings  → the STRATEGY itself, applied by many deployments
  //
  // WHAT THE READER FILLS IN, in the two bands the console's own create form uses:
  //
  //   General            name, an internal description, and whether it can be applied
  //   Routing and policy how versions bind resources, and how many take traffic
  //
  // AND NOTHING ELSE. This drawer used to ask for an application, a firewall and a
  // custom page — `strategy.attributes` — which made a setting only usable by the one
  // workload serving those resources. Those bindings belong to the RELEASE, which is
  // where the operator chooses what a deploy carries; a setting says how it routes, and
  // an ENVIRONMENT says which setting it publishes with
  // (../../lib/state/workload-settings.js).
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
  //
  // The two policy groups are real `<fieldset>`/`<legend>` sets, because a radio
  // family's accessible name is its legend and a `<Label for>` can only point at one
  // of its members. Both start answered (`STRICT` / `single_version`, the platform's own
  // defaults), so neither can fail a submit — Name is the only required answer.
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive, ref, useId, watch } from 'vue'

  import {
    addStrategy,
    BINDING_POLICIES,
    DEFAULT_BINDING_POLICY,
    DEFAULT_DEPLOYMENT_POLICY,
    DEPLOYMENT_POLICIES
  } from '../../lib/data/deployment-strategies'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const emit = defineEmits(['create'])

  // One id namespace per instance, so two radios of the same family never share a
  // DOM id with another instance of this drawer.
  const scope = useId()

  const blankForm = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: DEFAULT_BINDING_POLICY,
    deploymentPolicy: DEFAULT_DEPLOYMENT_POLICY,
    // Authored on its own rather than born with a workload, so it is shareable from the
    // start — that is the only thing a standalone setting could be for. The switch is here
    // so the reader can say otherwise, and so the drawer states the reach the record has.
    shared: true
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
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    title="Create Deployment Settings"
    description="A Deployment Setting says how a deploy routes: whether versions lock the resource IDs they shipped with, and how many of them take traffic. An environment publishes with exactly one."
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
              v-for="policy in DEPLOYMENT_POLICIES"
              :key="policy.value"
              v-model="form.deploymentPolicy"
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

        <FieldSwitchBlock
          v-model="form.shared"
          label="Share across workloads"
          description="Let more than one workload publish with this configuration, so a single deploy reaches every environment bound to it. Turn it off to keep the setting to one workload."
          :disabled="submitting"
        />
      </div>
    </Section>
  </ResourceDrawer>
</template>
