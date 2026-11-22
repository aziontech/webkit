<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import {
    type ServiceWizardForm,
    type ServiceWizardNames,
    type ServiceWizardPicker,
    wireSubWidths,
    wireWidths
  } from '../lib/service-wizard'
  import { deploymentModes } from '../sample'

  export interface DeploymentPickerProps {
    /** The names the service, deployment and domain get. */
    names: ServiceWizardNames
  }

  defineProps<DeploymentPickerProps>()

  /** The domain and deployment answers. */
  const form = defineModel<ServiceWizardForm>('form', { required: true })

  /** The deployment picker. */
  const deploymentPicker = defineModel<ServiceWizardPicker>('picker', { required: true })
</script>

<template>
  <div class="mt-(--layout-section-gap)">
    <Card
      :padded="false"
      title="Deployment"
    >
      <template #default>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            The deployment settings the first release is cut against: what it binds, and how
            versions are promoted into it.
          </p>

          <ToggleGroup
            v-model="form.deploymentMode"
            :options="deploymentModes"
            size="large"
            fluid
            aria-label="Where the deployment comes from"
          />
        </div>

        <div
          v-if="form.deploymentMode !== 'existing'"
          class="mt-(--spacing-md) border-t border-(--border-default) p-(--spacing-md)"
        >
          <Item.List>
            <Item size="small">
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="az az-cloud-upload text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ names.deployment || 'Named from the domain' }}</Item.Title>
                <Item.Description>
                  Created with the service, on the default settings. Change them from Deployments
                  once it exists.
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.List>
        </div>

        <div
          v-else
          class="min-w-0 pt-(--spacing-md)"
        >
          <div
            v-if="deploymentPicker.paged || deploymentPicker.message"
            :data-field-invalid="deploymentPicker.message || null"
            class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
          >
            <Input
              v-if="deploymentPicker.paged"
              v-model="deploymentPicker.query"
              size="large"
              class="w-full"
              placeholder="Search deployments"
              aria-label="Search deployments"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <FieldError v-if="deploymentPicker.message">{{ deploymentPicker.message }}</FieldError>
          </div>

          <div class="border-t border-(--border-default)">
            <Item.List>
              <Item
                v-for="option in deploymentPicker.visible"
                :key="option.value"
                size="small"
                clickable
                :aria-pressed="option.value === deploymentPicker.chosen"
                @click="deploymentPicker.chosen = option.value"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-cloud-upload text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ option.label }}</Item.Title>
                  <Item.Description>{{ option.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    v-if="option.value === deploymentPicker.chosen"
                    class="az az-check shrink-0 text-(--text-default)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>

              <template v-if="deploymentPicker.loading">
                <Item
                  v-for="index in deploymentPicker.nextBatch"
                  :key="'wire-' + index"
                  size="small"
                  aria-hidden="true"
                >
                  <Item.Media>
                    <Skeleton
                      variant="rectangle"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        :width="wireWidths[(index - 1) % wireWidths.length]"
                        height="0.875rem"
                      />
                      <Skeleton
                        :width="wireSubWidths[(index - 1) % wireSubWidths.length]"
                        height="0.75rem"
                      />
                    </div>
                  </Item.Content>
                </Item>
              </template>
            </Item.List>

            <div
              v-if="deploymentPicker.remaining"
              class="border-t border-(--border-default) p-(--spacing-2xs)"
            >
              <Button
                type="button"
                :label="'Load ' + deploymentPicker.nextBatch + ' more'"
                variant="ghost"
                size="small"
                class="w-full"
                :loading="deploymentPicker.loading"
                @click="deploymentPicker.loadMore"
              />
            </div>

            <p
              v-if="!deploymentPicker.matches.length"
              class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
            >
              No deployment matches “{{ deploymentPicker.query }}”. Create one instead, or clear the
              search.
            </p>

            <span
              class="sr-only"
              role="status"
              >{{ deploymentPicker.summary }}</span
            >
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
