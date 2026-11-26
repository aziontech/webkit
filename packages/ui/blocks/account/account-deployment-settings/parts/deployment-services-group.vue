<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Pagination from '@aziontech/webkit/pagination-root'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed } from 'vue'

  import type {
    DeploymentSettingsEnvironment,
    DeploymentSettingsService,
    DeploymentSettingsSetting
  } from '../account-deployment-settings.vue'
  import {
    deploymentLabel,
    reachLabel,
    servicesBoundTo,
    settingNameIn
  } from '../deployment-policies'

  export interface DeploymentServicesGroupProps {
    /** Every service and its environments. */
    serviceList: DeploymentSettingsService[]
    /** Every Deployment Setting of the account. */
    settingList: DeploymentSettingsSetting[]
    /** The first load is in flight. */
    firstLoad: boolean
  }

  const props = defineProps<DeploymentServicesGroupProps>()

  const emit = defineEmits<{
    rebind: [
      service: DeploymentSettingsService,
      environment: DeploymentSettingsEnvironment,
      value: unknown
    ]
  }>()

  const SERVICES_PAGE_SIZE = 10

  const settingName = (id: unknown): string => settingNameIn(props.settingList, id)
  const boundTo = (id: string) => servicesBoundTo(props.serviceList, id)

  const serviceRows = computed(() =>
    props.serviceList.map((service) => ({
      ...service,
      settings: service.environments
        .map((environment) => settingName(environment.settingId))
        .join(' ')
    }))
  )
  const {
    items: pagedServices,
    totalCount: matchingServiceCount,
    filterProps: serviceFilterProps,
    paginationProps: servicePaginationProps,
    clearFilters: clearServiceSearch
  } = useCollection({
    items: serviceRows,
    columns: [{ accessorKey: 'name' }, { accessorKey: 'settings' }],
    filtering: { fields: ['name', 'settings'] },
    pagination: { pageSize: SERVICES_PAGE_SIZE, pageSizeOptions: [SERVICES_PAGE_SIZE] }
  })
  const sharedCount = computed(
    () =>
      props.serviceList.filter((service) =>
        service.environments.some((environment) => boundTo(environment.settingId).length > 1)
      ).length
  )
  const optionsFor = (environment: DeploymentSettingsEnvironment) =>
    props.settingList.filter(
      (setting) =>
        setting.deploymentPolicy === environment.deploymentPolicy ||
        setting.id === environment.settingId
    )

  const rebind = (
    service: DeploymentSettingsService,
    environment: DeploymentSettingsEnvironment,
    value: unknown
  ) => emit('rebind', service, environment, value)
</script>

<template>
  <SettingsGroup
    label="All services"
    anchor="all-services"
    hint="Every service, every environment, and the Deployment Setting each one publishes with."
  >
    <Card :padded="false">
      <template #default>
        <div
          v-if="firstLoad"
          class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
        >
          <Skeleton
            width="40%"
            height="1.25rem"
          />
          <Skeleton height="2.5rem" />
        </div>
        <EmptyState
          v-else-if="!serviceList.length"
          size="small"
          icon="az az-server"
          title="No services yet"
          description="Each environment of a new service is linked to a matching Deployment Setting automatically."
        />
        <Accordion
          v-else
          type="single"
          icon-position="leading"
          collapsible
        >
          <Accordion.Item value="all-services">
            <Accordion.Trigger :heading-level="3">
              <span class="flex flex-1 flex-wrap items-center gap-(--spacing-sm)">
                <span class="text-label-md text-(--text-default)">All services</span>
                <span
                  class="text-body-sm text-(--text-muted)"
                  dir="auto"
                  >{{ reachLabel(serviceList.length) }}</span
                >
                <Tag
                  v-if="sharedCount"
                  :label="`${sharedCount} on a shared setting`"
                  severity="warning"
                  size="small"
                />
              </span>
            </Accordion.Trigger>
            <Accordion.Content>
              <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                <Input
                  v-bind="serviceFilterProps"
                  size="medium"
                  placeholder="Search services or settings"
                  aria-label="Search services or Deployment Settings"
                  class="w-full"
                >
                  <template #leading>
                    <i
                      class="az az-search"
                      aria-hidden="true"
                    />
                  </template>
                </Input>
                <div
                  v-if="!matchingServiceCount"
                  role="status"
                >
                  <EmptyState
                    size="small"
                    icon="az az-search"
                    title="No matching services"
                    :description="`No service or setting matches “${serviceFilterProps.modelValue}”.`"
                  >
                    <template #actions>
                      <Button
                        label="Clear search"
                        variant="outline"
                        size="small"
                        @click="clearServiceSearch"
                      />
                    </template>
                  </EmptyState>
                </div>
                <ul
                  v-else
                  class="m-0 flex list-none flex-col p-0"
                  aria-label="Services"
                >
                  <li
                    v-for="service in pagedServices"
                    :key="service.id"
                    class="flex min-w-0 flex-col gap-(--spacing-xs) border-b border-(--border-muted) py-(--spacing-sm) last:border-b-0"
                  >
                    <TableCellLink
                      :label="service.name"
                      :href="`/services/${service.id}`"
                      destination="Services"
                    />
                    <div
                      v-for="environment in service.environments"
                      :key="environment.name"
                      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
                    >
                      <Tag
                        :label="environment.name"
                        severity="neutral"
                        size="small"
                      />
                      <Tag
                        :label="deploymentLabel(environment.deploymentPolicy)"
                        severity="info"
                        size="small"
                      />
                      <Select
                        :model-value="environment.settingId"
                        size="medium"
                        class="min-w-0 grow basis-(--container-2xs)"
                        :display-value="settingName"
                        @update:model-value="(value) => rebind(service, environment, value)"
                      >
                        <Select.Trigger
                          :aria-label="`Deployment Setting for ${service.name} ${environment.name}`"
                        />
                        <Select.Content>
                          <Select.Item
                            v-for="option in optionsFor(environment)"
                            :key="option.id"
                            :value="option.id"
                            :disabled="option.status === 'Inactive'"
                          >
                            {{ option.name }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                      <Tag
                        v-if="environment.auto"
                        key="auto"
                        label="Linked automatically"
                        severity="neutral"
                        size="small"
                      />
                      <Tag
                        key="shared"
                        v-if="boundTo(environment.settingId).length > 1"
                        :label="`Shared · ${reachLabel(boundTo(environment.settingId).length)}`"
                        severity="warning"
                        size="small"
                      />
                    </div>
                  </li>
                </ul>
                <Pagination
                  v-if="matchingServiceCount > SERVICES_PAGE_SIZE"
                  v-bind="servicePaginationProps"
                  aria-label="Services pages"
                />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </template>
    </Card>
  </SettingsGroup>
</template>
