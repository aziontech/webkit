<script setup lang="ts">
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import Section from '../../../components/page/Section.vue'
  import ResourcePicker from '../../../components/resource/ResourcePicker.vue'
  import { CERTIFICATE_OPTIONS, TLS_VERSION_OPTIONS } from '../../../lib/data/create-resources'
  import { existingCustomPageOptions } from '../../../lib/data/custom-pages'
  import {
    WORKLOAD_DEPLOYMENTS,
    WORKLOAD_ENVIRONMENTS,
    workloadNamesFromForm
  } from '../../../lib/data/workload-flows'
  import { AZION_DOMAIN_SUFFIX } from '../../../lib/data/workload-provisioning'
  import { useWorkloadForm } from './form-context'

  interface Props {
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const { form, errors } = useWorkloadForm()

  const customPageOptions = existingCustomPageOptions()

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const DOMAIN_TYPES = [
    { label: 'Free Azion domain', value: 'azion' },
    { label: 'Your own domain', value: 'own' }
  ]

  const DEPLOYMENT_MODES = [
    { label: 'Create one', value: 'auto' },
    { label: 'Use existing', value: 'existing' }
  ]

  const isAzionDomain = computed(() => form.domainType !== 'own')
  const isExistingDeployment = computed(() => form.deploymentMode === 'existing')

  const names = computed(() => workloadNamesFromForm(form))
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <CardBox
      :padded="false"
      title="Domain"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <SegmentedButton
            v-model="form.domainType"
            :options="DOMAIN_TYPES"
            size="large"
            fluid
            aria-label="Where the domain comes from"
          />

          <FieldStack
            v-if="isAzionDomain"
            label="Domain prefix"
            required
            hint="Azion provides the domain and its certificate."
            description="Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen. It also names the workload and its deployment."
            :message="errors.domainPrefix"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.domainPrefix"
                size="large"
                class="w-full"
                placeholder="my-first-app"
                autocomplete="off"
                :disabled="disabled"
                :required="!!errors.domainPrefix"
                :aria-describedby="describedBy"
              >
                <template #iconRight>
                  <span
                    class="whitespace-nowrap text-label-sm text-(--text-muted)"
                    aria-hidden="true"
                  >
                    {{ AZION_DOMAIN_SUFFIX }}
                  </span>
                </template>
              </InputText>
            </template>
          </FieldStack>

          <template v-else>
            <FieldStack
              label="Domain"
              required
              hint="The hostname that points at this workload."
              description="A full hostname, like www.example.com. Add its DNS record once the workload exists. The run does not wait on it."
              :message="errors.domainHost"
              message-kind="required"
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
                  :required="!!errors.domainHost"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>

            <FieldStack
              label="Name"
              required
              hint="Identifies the workload in every list."
              description="Lowercase letters, numbers and hyphens. It also names the deployment created for it."
              :message="errors.name"
              message-kind="required"
            >
              <template #default="{ controlId, describedBy }">
                <InputText
                  :id="controlId"
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  placeholder="my-first-app"
                  autocomplete="off"
                  :disabled="disabled"
                  :required="!!errors.name"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>
          </template>
        </div>

        <div
          class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-md)"
        >
          <p class="text-label-sm text-(--text-default)">Traffic arrives on</p>
          <div
            :data-empty="!names.domain || null"
            class="flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) data-[empty]:border-dashed"
          >
            <i
              class="pi pi-globe shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span
              v-if="names.domain"
              class="min-w-0 truncate text-label-sm text-(--text-default)"
            >
              https://{{ names.domain }}
            </span>
            <span
              v-else
              class="text-label-sm text-(--text-muted)"
            >
              {{
                isAzionDomain
                  ? 'Type a prefix to see the domain.'
                  : 'Type a hostname to see the address.'
              }}
            </span>
          </div>
          <p class="text-label-sm text-(--text-muted)">
            The workload is created as
            <span class="text-(--text-default)">{{ names.workload || 'unnamed' }}</span
            >. Add more domains to it once it exists.
          </p>
        </div>
      </template>
    </CardBox>

    <CardBox
      title="Environment and certificate"
      class="mt-(--layout-section-gap)"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg)">
          <FieldStack
            group
            label="Environment"
            hint="Which environment this binding lands on."
            description="The domain answers on the environment it is bound to."
          >
            <template #default="{ labelId, describedBy }">
              <BoxGridSelection
                v-model="form.environment"
                :items="WORKLOAD_ENVIRONMENTS"
                :disabled="disabled"
                :aria-labelledby="labelId"
                :aria-describedby="describedBy"
                class="[&>*]:grow [&>*]:basis-(--container-3xs)"
              />
            </template>
          </FieldStack>

          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
            <FieldStack
              label="Certificate"
              hint="One certificate per workload, not per domain on it."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.certificate"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="labelFor(CERTIFICATE_OPTIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Certificate"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in CERTIFICATE_OPTIONS"
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
        </div>
      </template>
    </CardBox>

    <CardBox
      :padded="false"
      title="Deployment"
      class="mt-(--layout-section-gap)"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            The deployment settings the first release is cut against — what it binds, and how
            versions are promoted into it.
          </p>

          <SegmentedButton
            v-model="form.deploymentMode"
            :options="DEPLOYMENT_MODES"
            size="large"
            fluid
            aria-label="Where the deployment comes from"
          />
        </div>

        <div
          v-if="!isExistingDeployment"
          class="mt-(--spacing-md) border-t border-(--border-default) p-(--spacing-md)"
        >
          <Item.List>
            <Item size="small">
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-deploy-pillar text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ names.deployment || 'Named from the domain' }}</Item.Title>
                <Item.Description>
                  Created with the workload, on Azion's default settings. Change them from
                  Deployments once it exists.
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.List>
        </div>

        <ResourcePicker
          v-else
          v-model="form.deployment"
          class="pt-(--spacing-md)"
          :options="WORKLOAD_DEPLOYMENTS"
          icon="ai ai-deploy-pillar"
          noun="deployment"
          :message="errors.deployment"
          :disabled="disabled"
        />
      </template>
    </CardBox>

    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="Every field here already carries the endpoint's own default, and all of them can be changed once the workload exists."
    >
      <CardBox :padded="false">
        <template #content>
          <div class="p-(--spacing-md)">
            <FieldStack
              label="Minimum TLS version"
              hint="Connections negotiating below this version are refused."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.minimumTlsVersion"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="labelFor(TLS_VERSION_OPTIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Minimum TLS version"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in TLS_VERSION_OPTIONS"
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

          <div class="border-t border-(--border-default) p-(--spacing-md)">
            <FieldStack
              label="Custom page"
              hint="What the workload serves for an error or a maintenance window."
              description="Optional. Without one, the workload falls back to Azion's own pages."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.customPage"
                  size="large"
                  class="w-full"
                  placeholder="Not bound"
                  :disabled="disabled"
                  :display-value="labelFor(customPageOptions)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Custom page"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in customPageOptions"
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

          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Behavior
          </h3>
          <Item.List>
            <Item size="small">
              <Item.Content>
                <Item.Title>Allow the Azion domain</Item.Title>
                <Item.Description>
                  Serve traffic on the provisioned
                  {{ names.workload ? `${names.workload}${AZION_DOMAIN_SUFFIX}` : 'Azion domain' }}
                  alongside your own. Turn it off once your own domain answers instead.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.allowAzionDomain"
                  aria-label="Allow the Azion domain"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
            <Item size="small">
              <Item.Content>
                <Item.Title>Active</Item.Title>
                <Item.Description>
                  When disabled, the workload is created but does not serve traffic.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.active"
                  aria-label="Active"
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
