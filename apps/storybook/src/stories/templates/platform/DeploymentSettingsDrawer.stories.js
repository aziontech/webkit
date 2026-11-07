import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import FieldRadio from '@aziontech/webkit/field-radio'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import Label from '@aziontech/webkit/label'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import { reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_summary-markup'

const TITLE = 'Create Deployment Settings'

const DESCRIPTION =
  'A Deployment Setting says how a deploy routes: whether versions lock the resource IDs they shipped with, and how many of them take traffic. An environment publishes with exactly one.'

const BINDING_POLICIES = [
  {
    value: 'STRICT',
    label: 'Strict',
    description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
  },
  {
    value: 'FLEXIBLE',
    label: 'Flexible',
    description: 'Allow resource IDs to change across versions.'
  }
]

const DEPLOYMENT_POLICIES = [
  {
    value: 'single_version',
    label: 'Single',
    description: 'One version serves the environment. Deploying replaces what is live.'
  },
  {
    value: 'versioned_urls',
    label: 'Versioned',
    description: 'Each version keeps its own URL, so several are reachable at once.'
  }
]

const SECTION_CLASS =
  'grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]'

const section = ({ title, hint, body }) => `<section data-stacked="true" class="${SECTION_CLASS}">
  <div
    data-stacked="true"
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>
      <Hint text="${hint}" class="shrink-0" />
    </div>
  </div>

  <div
    data-open="true"
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 data-collapsible:overflow-hidden">
      <div
        data-open="true"
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`

const policyGroup = ({
  list,
  model,
  name,
  idPrefix,
  label,
  hint,
  after = ''
}) => `<fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
  <legend class="mb-(--spacing-xs) p-0">
    <Label
      required
      hint="${hint}"
    >
      ${label}
    </Label>
  </legend>
  <div class="flex flex-col gap-(--spacing-sm)">
    <FieldRadio
      v-for="policy in ${list}"
      :key="policy.value"
      v-model="${model}"
      :value="policy.value"
      name="${name}"
      :input-id="\`${idPrefix}-\${policy.value}\`"
      :label="policy.label"
      :description="policy.description"
      :disabled="submitting"
    />
  </div>${after}
</fieldset>`

const GENERAL = `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
  <FieldText
    input-id="deployment-settings-name"
    v-model="form.name"
    label="Name"
    size="large"
    placeholder="production-hardened"
    :disabled="submitting"
    :required="Boolean(errors.name)"
    :helper-text="errors.name || 'How this strategy reads in the Deployment Settings field.'"
    @update:model-value="errors.name = ''"
  />

  <FieldTextarea
    input-id="deployment-settings-description"
    v-model="form.description"
    label="Description"
    placeholder="Storefront traffic for production"
    :disabled="submitting"
    helper-text="Optional. Used for internal identification."
  />

  <FieldSwitchBlock
    v-model="form.active"
    label="Active"
    description="When disabled, the strategy stays in the list but no deployment can apply it."
    :disabled="submitting"
  />
</div>`

const ROUTING = `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(
  policyGroup({
    list: 'bindingPolicies',
    model: 'form.bindingPolicy',
    name: 'binding-policy',
    idPrefix: 'deployment-settings-binding',
    label: 'Binding policy',
    hint: 'Defines whether each version locks its resource IDs or allows them to change.'
  })
)}

${indent(
  policyGroup({
    list: 'deploymentPolicies',
    model: 'form.deploymentPolicy',
    name: 'version-policy',
    idPrefix: 'deployment-settings-version',
    label: 'Deployment version policy',
    hint: 'Defines how many versions can receive traffic.',
    after: '\n  <HelperText label="Cannot be changed after the deployment is created." />'
  })
)}

  <FieldSwitchBlock
    v-model="form.shared"
    label="Share across workloads"
    description="Let more than one workload publish with this configuration, so a single deploy reaches every environment bound to it. Turn it off to keep the setting to one workload."
    :disabled="submitting"
  />
</div>`

const TEMPLATE = `<Drawer v-model:open="open" size="medium" side="right">
  <DrawerTrigger>
    <Button
      label="${TITLE}"
      icon="pi pi-plus"
      kind="outlined"
      size="medium"
      class="w-full md:w-auto"
    />
  </DrawerTrigger>

  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="${TITLE}"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>${TITLE}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              ${DESCRIPTION}
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0" :disabled="submitting">
            <legend class="sr-only">${TITLE}</legend>

${indent(
  section({
    title: 'General',
    hint: 'How this strategy is identified in the Deployment Settings list and in the field that applies it.',
    body: GENERAL
  }),
  6
)}

${indent(
  section({
    title: 'Routing and policy',
    hint: 'How versions bind to the resources they ship with, and how traffic reaches them.',
    body: ROUTING
  }),
  6
)}
          </fieldset>
        </PanelContent>

        <PanelFooter class="flex-wrap justify-between">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
          <Button
            label="${TITLE}"
            kind="primary"
            size="medium"
            :loading="submitting"
            type="submit"
          />
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const BLANK_FORM = {
  name: '',
  description: '',
  active: true,
  bindingPolicy: 'STRICT',
  deploymentPolicy: 'single_version',
  shared: true
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  "import FieldRadio from '@aziontech/webkit/field-radio'",
  "import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Label from '@aziontech/webkit/label'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import { reactive, ref, watch } from 'vue'",
  '',
  declare('bindingPolicies', BINDING_POLICIES),
  '',
  declare('deploymentPolicies', DEPLOYMENT_POLICIES),
  '',
  declare('blankForm', BLANK_FORM).replace('const blankForm = ', 'const blankForm = () => (') + ')',
  '',
  'const open = ref(false)',
  'const form = reactive(blankForm())',
  "const errors = reactive({ name: '' })",
  'const submitting = ref(false)',
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  '  Object.assign(form, blankForm())',
  "  errors.name = ''",
  '  submitting.value = false',
  '})',
  '',
  'const submit = async () => {',
  '  if (submitting.value) return',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  '  if (errors.name) return',
  '  submitting.value = true',
  '  await new Promise((resolve) => setTimeout(resolve, 500))',
  '  submitting.value = false',
  '  open.value = false',
  '}'
]

const components = {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  FieldRadio,
  FieldSwitchBlock,
  FieldText,
  FieldTextarea,
  HelperText,
  Hint,
  Label,
  PanelContent,
  PanelFooter,
  PanelHeader
}

const setup = () => {
  const open = ref(false)
  const form = reactive({ ...BLANK_FORM })
  const errors = reactive({ name: '' })
  const submitting = ref(false)
  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, BLANK_FORM)
    errors.name = ''
    submitting.value = false
  })
  const submit = async () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    if (errors.name) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    submitting.value = false
    open.value = false
  }
  return {
    bindingPolicies: BINDING_POLICIES,
    deploymentPolicies: DEPLOYMENT_POLICIES,
    open,
    form,
    errors,
    submitting,
    submit
  }
}

const meta = {
  title: 'Templates/Platform/Overlays/DeploymentSettingsDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The drawer that creates a Deployment Setting, opened from the Create Deployment Settings heading action of the Build & Deployment panel in Account Settings (`/account/build-deployment`, plotted by the AccountSettings BuildDeployment template). A form drawer with the title and its description, a General section with the required Name, an optional Description and the Active switch, and a Routing and policy section with the Strict or Flexible binding policy, the Single or Versioned deployment version policy and the Share across workloads switch, then a submit footer. The form resets every time the drawer opens, never on close, and Name only reads as required once the form is submitted empty. Built from `Drawer`, the `Panel` parts, `FieldText`, `FieldTextarea`, `Label`, `HelperText`, `FieldRadio`, `FieldSwitchBlock`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The trigger opens the blank form on Strict, Single, Active and shared. Submit it with no name to see the required message under Name; typing clears it.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
