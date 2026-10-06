<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import { deploymentPolicyLabel, strategyById } from '../../lib/data/deployment-strategies'
  import {
    bindWorkloadSettings,
    boundWorkloads,
    reachLabel,
    settingsForPolicy,
    workloadBindings
  } from '../../lib/state/workload-settings'

  const PANEL = 'all-workloads'

  const search = ref('')

  const rows = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return workloadBindings.value
    return workloadBindings.value.filter(
      (workload) =>
        workload.name.toLowerCase().includes(query) ||
        workload.environments.some((environment) =>
          (strategyById(environment.settingsId)?.name ?? '').toLowerCase().includes(query)
        )
    )
  })

  const totals = computed(() => {
    const all = workloadBindings.value
    const shared = all.filter((workload) =>
      workload.environments.some((environment) => boundWorkloads(environment.settingsId).length > 1)
    ).length
    return { workloads: all.length, shared }
  })

  const settingName = (settingsId) => strategyById(settingsId)?.name ?? ''

  const optionsFor = (workload, environment) =>
    settingsForPolicy(environment.deploymentPolicy, environment.settingsId, workload.id).map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
      disabled: strategy.status === 'Inactive'
    }))

  const isShared = (settingsId) => boundWorkloads(settingsId).length > 1

  const reachOf = (settingsId) => reachLabel(boundWorkloads(settingsId).length)

  const rebind = (workload, environment, settingsId) => {
    if (!settingsId || settingsId === environment.settingsId) return
    bindWorkloadSettings(workload.id, environment.name, settingsId)
    const reach = boundWorkloads(settingsId).length
    const name = settingName(settingsId)
    if (reach > 1) {
      toast.warning(`${workload.name} · ${environment.name} now publishes with ${name}.`, {
        description: `A deploy into ${name} reaches ${reachLabel(reach)}.`
      })
      return
    }
    toast.success(`${workload.name} · ${environment.name} now publishes with ${name}.`, {
      description: 'It reaches this workload only.'
    })
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Accordion
        class="[--accordion-inset:var(--spacing-md)]"
        type="single"
        arrow-position="left"
        collapsible
      >
        <Accordion.Item
          :value="PANEL"
          class="border-b-0"
        >
          <Accordion.Trigger :level="3">
            <span class="flex min-h-12 flex-1 flex-wrap items-center gap-(--spacing-sm)">
              <span class="text-label-md text-(--text-default)">All workloads</span>
              <span class="text-body-sm text-(--text-muted)">
                {{ reachLabel(totals.workloads) }}
              </span>
              <Tag
                v-if="totals.shared"
                :label="`${totals.shared} on a shared setting`"
                severity="warning"
                size="medium"
              />
            </span>
          </Accordion.Trigger>

          <Accordion.Content>
            <div
              class="flex min-w-0 flex-col gap-(--spacing-md) px-(--spacing-md) pb-(--spacing-md)"
            >
              <InputText
                v-model="search"
                size="medium"
                placeholder="Search workloads or settings"
                aria-label="Search workloads or Deployment Settings"
                class="w-full"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>

              <p
                v-if="!rows.length"
                class="py-(--spacing-md) text-body-sm text-(--text-muted)"
              >
                No workload matches that.
              </p>

              <ul
                v-else
                class="m-0 flex list-none flex-col gap-0 p-0"
              >
                <li
                  v-for="workload in rows"
                  :key="workload.id"
                  class="flex min-w-0 flex-col gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) py-(--spacing-sm) last:border-b-0"
                >
                  <div
                    class="flex min-w-0 flex-wrap items-center justify-between gap-(--spacing-sm)"
                  >
                    <router-link
                      :to="{ path: `/workloads/${workload.id}` }"
                      class="truncate text-label-md text-(--text-default) no-underline hover:underline"
                    >
                      {{ workload.name }}
                    </router-link>
                  </div>

                  <div
                    v-for="environment in workload.environments"
                    :key="environment.name"
                    class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
                  >
                    <Tag
                      :label="environment.name"
                      severity="secondary"
                      size="medium"
                    />
                    <Tag
                      :label="deploymentPolicyLabel(environment.deploymentPolicy)"
                      severity="info"
                      size="medium"
                    />
                    <Select
                      :model-value="environment.settingsId"
                      size="medium"
                      class="min-w-0 grow basis-(--container-2xs)"
                      :display-value="settingName"
                      @update:model-value="(value) => rebind(workload, environment, String(value))"
                    >
                      <Select.Trigger
                        :aria-label="`Deployment Setting for ${workload.name} ${environment.name}`"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in optionsFor(workload, environment)"
                          :key="option.value"
                          :value="option.value"
                          :disabled="option.disabled"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                    <Tag
                      v-if="environment.auto"
                      label="Linked automatically"
                      severity="secondary"
                      size="medium"
                    />
                    <Tag
                      key="tag-2"
                      v-if="isShared(environment.settingsId)"
                      :label="`Shared · ${reachOf(environment.settingsId)}`"
                      severity="warning"
                      size="medium"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </template>
  </CardBox>
</template>
