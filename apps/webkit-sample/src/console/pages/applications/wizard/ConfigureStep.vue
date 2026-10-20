<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, watch } from 'vue'

  import FirewallBinding from '../../../components/firewall/FirewallBinding.vue'
  import FieldStack from '../../../components/form/FieldStack.vue'
  import Section from '../../../components/page/Section.vue'
  import {
    APPLICATION_BEHAVIOR_FIELDS,
    CONTACT_SALES,
    DEFAULT_MODULES,
    SUBSCRIPTION_MODULES
  } from '../../../lib/data/application-modules'
  import {
    certificateForDomain,
    domainCertificateLabel,
    domainCertificateOptions
  } from '../../../lib/data/certificates'
  import { deploymentPolicyLabel, environmentNameOptions } from '../../../lib/data/environments'
  import { existingFirewallOptions } from '../../../lib/data/firewalls'
  import { AZION_COMMANDS } from '../../../lib/data/frameworks'
  import { AZION_DOMAIN_SUFFIX } from '../../../lib/data/provisioning'
  import { useCreateForm } from './form-context'

  interface Props {
    source?: Record<string, unknown>
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    source: null,
    disabled: false
  })

  const { form, errors } = useCreateForm()

  const environmentOptions = environmentNameOptions
  const environmentLabel = (value) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''

  const certificateOptions = computed(() => domainCertificateOptions())

  const host = computed(() => form.domainHost.trim().toLowerCase())

  let certificateTouched = false
  watch(host, (next) => {
    if (certificateTouched) return
    form.domainCertificate = certificateForDomain(next)
  })

  const onCertificate = (value) => {
    certificateTouched = true
    form.domainCertificate = value
  }

  const certificateHint = computed(() => {
    if (!form.domainCertificate) {
      return 'Served by the free Azion certificate, issued and renewed by the platform.'
    }
    const name = domainCertificateLabel(form.domainCertificate)
    return certificateTouched
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosenEnvironment = computed(() =>
    environmentOptions.value.find((option) => option.value === form.domainEnvironment)
  )

  const environmentHint = computed(() =>
    chosenEnvironment.value
      ? `${chosenEnvironment.value.label} publishes with the Deployment Settings set to ${deploymentPolicyLabel(chosenEnvironment.value.deploymentPolicy)}.`
      : 'Where this domain answers. An environment decides which Deployment Settings can serve it.'
  )

  const COMMANDS = [
    {
      field: 'buildCommand',
      label: 'Build command',
      fallback: AZION_COMMANDS.buildCommand,
      empty: 'No build step',
      description: 'Produces the bundle. Leave it empty for a site that needs no build.'
    },
    {
      field: 'deployCommand',
      label: 'Deploy command',
      fallback: AZION_COMMANDS.deployCommand,
      empty: 'Not set',
      description: 'Runs after the build to deploy the bundle to Azion.'
    }
  ]

  const isEdited = (command) => form[command.field].trim() !== command.fallback

  const resetCommand = (command) => {
    form[command.field] = command.fallback
  }

  const editedCommands = COMMANDS.filter(isEdited).map((command) => command.field)

  const templateSettings = () => props.source?.settings ?? []

  const EXISTING_FIREWALLS = existingFirewallOptions()
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <CardBox
      :padded="false"
      title="Configure your application"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <FieldStack
            label="Name"
            required
            hint="Names the application, and every resource created alongside it."
            description="Lowercase letters, numbers, and hyphens. It becomes part of the deployed URL."
            :message="errors.name"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.name"
                size="large"
                class="w-full"
                placeholder="my-application"
                :disabled="disabled"
                :required="!!errors.name"
                :aria-describedby="describedBy"
              />
            </template>
          </FieldStack>
        </div>

        <div
          v-if="templateSettings().length"
          class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
        >
          <p class="text-label-sm text-(--text-default)">Template settings</p>
          <FieldStack
            v-for="setting in templateSettings()"
            :key="setting.name"
            :label="setting.label"
            :required="!!setting.required"
            :description="setting.description"
            :message="errors[setting.name]"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.settings[setting.name]"
                size="large"
                class="w-full"
                :placeholder="setting.placeholder"
                :disabled="disabled"
                :required="!!errors[setting.name]"
                :aria-describedby="describedBy"
              />
            </template>
          </FieldStack>
        </div>
      </template>
    </CardBox>

    <CardBox
      class="mt-(--layout-section-gap)"
      :padded="false"
      title="Domain"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <Message
            severity="info"
            :label="`A free ${AZION_DOMAIN_SUFFIX.replace(/^\./, '')} domain is created with this application and always answers on it. Add one of your own to have visitors reach it at a name you own.`"
          />

          <FieldStack
            label="Custom domain"
            hint="The hostname that points at this application."
            description="A full hostname, like www.example.com. Leave it empty to bind one later. Its DNS record can be added once the application exists, and the deploy does not wait on it."
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.domainHost"
                size="large"
                class="w-full"
                placeholder="www.example.com"
                autocomplete="off"
                :disabled="disabled"
                :aria-describedby="describedBy"
              />
            </template>
          </FieldStack>

          <template v-if="host">
            <FieldStack
              label="Environment"
              required
              :description="environmentHint"
              :message="errors.domainEnvironment"
              message-kind="required"
            >
              <template #default="{ controlId, describedBy }">
                <Select
                  v-model="form.domainEnvironment"
                  size="large"
                  class="w-full"
                  placeholder="Select an environment"
                  :disabled="disabled"
                  :invalid="!!errors.domainEnvironment"
                  :display-value="environmentLabel"
                >
                  <Select.Trigger
                    :id="controlId"
                    :aria-describedby="describedBy"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in environmentOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>

            <FieldStack
              label="Certificate"
              :description="certificateHint"
            >
              <template #default="{ controlId, describedBy }">
                <Select
                  :model-value="form.domainCertificate"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="domainCertificateLabel"
                  @update:model-value="onCertificate"
                >
                  <Select.Trigger
                    :id="controlId"
                    :aria-describedby="describedBy"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in certificateOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>
          </template>
        </div>
      </template>
    </CardBox>

    <CardBox
      v-if="source?.requiresBuild"
      class="mt-(--layout-section-gap)"
      :padded="false"
      title="Build and deploy commands"
    >
      <template #content>
        <Accordion
          type="multiple"
          :default-value="editedCommands"
        >
          <Accordion.Item
            v-for="command in COMMANDS"
            :key="command.field"
            :value="command.field"
            class="last:border-b-0"
          >
            <Accordion.Trigger>
              <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                <span class="shrink-0 text-label-md text-(--text-default)">
                  {{ command.label }}
                </span>
                <span
                  class="min-w-0 flex-1 truncate font-(family-name:--font-code) text-body-sm text-(--text-muted)"
                >
                  {{ form[command.field].trim() || command.empty }}
                </span>
                <Tag
                  v-if="isEdited(command)"
                  label="Edited"
                  severity="info"
                  size="small"
                  class="shrink-0"
                />
              </span>
            </Accordion.Trigger>

            <Accordion.Content>
              <div
                class="flex min-w-0 flex-col gap-(--spacing-sm) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md)"
              >
                <InputText
                  v-model="form[command.field]"
                  size="large"
                  class="w-full font-(family-name:--font-code)"
                  :aria-label="command.label"
                  :placeholder="command.fallback"
                  :disabled="disabled"
                />
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                  <p class="min-w-0 text-body-sm text-(--text-muted)">
                    {{ command.description }}
                  </p>
                  <Button
                    v-if="isEdited(command)"
                    kind="text"
                    size="small"
                    label="Use the default"
                    :disabled="disabled"
                    @click="resetCommand(command)"
                  />
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </template>
    </CardBox>

    <FirewallBinding
      v-model="form.protection"
      class="mt-(--layout-section-gap)"
      :options="EXISTING_FIREWALLS"
      :default-name="form.name"
      description="Filters requests before they reach your code. Off by default. Turn it on to bind an existing firewall, or create one with the application."
      :message="errors.firewall"
      :disabled="disabled"
    />

    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="The modules the application runs with and two application-level flags, each at its default and changeable later in Main Settings."
    >
      <CardBox :padded="false">
        <template #content>
          <h3
            class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Modules
          </h3>
          <Item.List>
            <Item
              v-for="mod in DEFAULT_MODULES"
              :key="mod.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ mod.title }}</Item.Title>
                <Item.Description>{{ mod.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.modules[mod.key]"
                  :aria-label="mod.title"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
          </Item.List>

          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Subscription modules
          </h3>
          <Item.List>
            <Item
              v-for="mod in SUBSCRIPTION_MODULES"
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
                <Tooltip text="Contact sales to enable this module.">
                  <Switch
                    v-model="form.modules[mod.key]"
                    disabled
                    :aria-label="mod.title"
                  />
                </Tooltip>
              </Item.Actions>
            </Item>
          </Item.List>

          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Behavior
          </h3>
          <Item.List>
            <Item
              v-for="field in APPLICATION_BEHAVIOR_FIELDS"
              :key="field.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ field.title }}</Item.Title>
                <Item.Description>{{ field.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form[field.key]"
                  :aria-label="field.title"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </div>
</template>
