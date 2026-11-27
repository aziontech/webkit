<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import ToggleGroup from '@aziontech/ui/toggle-group'

  import type { ServiceWizardForm, ServiceWizardNames } from '../lib/service-wizard'
  import { domainTypes, platformDomainSuffix } from '../sample'

  export interface ServiceDomainCardProps {
    /** The messages of the fields Next flagged. */
    errors: Record<string, string>
    /** The names the service, deployment and domain get. */
    names: ServiceWizardNames
  }

  defineProps<ServiceDomainCardProps>()

  /** The domain and deployment answers. */
  const form = defineModel<ServiceWizardForm>('form', { required: true })

  const DOMAIN_SLOT_CLASS =
    'flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) ' +
    'data-[empty]:border-dashed'
</script>

<template>
  <Card
    :padded="false"
    title="Domain"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <ToggleGroup
          v-model="form.domainType"
          :options="domainTypes"
          size="large"
          fluid
          aria-label="Where the domain comes from"
        />

        <Field
          v-if="form.domainType !== 'own'"
          required
          :invalid="!!errors.domainPrefix"
        >
          <Field.Label>Domain prefix</Field.Label>
          <Input
            v-model="form.domainPrefix"
            size="large"
            placeholder="my-first-app"
          >
            <template #trailing>
              <span
                class="whitespace-nowrap text-label-sm text-(--text-muted)"
                aria-hidden="true"
              >
                {{ platformDomainSuffix }}
              </span>
            </template>
          </Input>
          <Field.Description>{{
            errors.domainPrefix ||
            'Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen. It also names the service and its deployment.'
          }}</Field.Description>
        </Field>

        <template v-else>
          <Field
            required
            :invalid="!!errors.domainHost"
          >
            <Field.Label>Domain</Field.Label>
            <Input
              v-model="form.domainHost"
              size="large"
              placeholder="www.example.com"
            />
            <Field.Description>{{
              errors.domainHost ||
              'A full hostname, like www.example.com. Add its DNS record once the service exists. The run does not wait on it.'
            }}</Field.Description>
          </Field>

          <Field
            required
            :invalid="!!errors.name"
          >
            <Field.Label>Name</Field.Label>
            <Input
              v-model="form.name"
              size="large"
              placeholder="my-first-app"
            />
            <Field.Description>{{
              errors.name ||
              'Lowercase letters, numbers and hyphens. It also names the deployment created for it.'
            }}</Field.Description>
          </Field>
        </template>
      </div>

      <div
        class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-md)"
      >
        <p class="text-label-sm text-(--text-default)">Traffic arrives on</p>
        <div
          :data-empty="!names.domain || null"
          :class="DOMAIN_SLOT_CLASS"
        >
          <i
            class="az az-globe shrink-0 text-(--text-muted)"
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
              form.domainType !== 'own'
                ? 'Type a prefix to see the domain.'
                : 'Type a hostname to see the address.'
            }}
          </span>
        </div>
        <p class="text-label-sm text-(--text-muted)">
          The service is created as
          <span class="text-(--text-default)">{{ names.service || 'unnamed' }}</span
          >. Add more domains to it once it exists.
        </p>
      </div>
    </template>
  </Card>
</template>
