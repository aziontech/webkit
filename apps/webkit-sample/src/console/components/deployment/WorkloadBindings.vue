<script setup>
  // ALL WORKLOADS — the whole pairing between environments and Deployment Settings, in
  // one disclosure.
  //
  // ── WHY IT IS ONE CARD AND NOT A COLUMN ON THE SETTINGS TABLE ──
  //
  // The question this answers is the inverse of the settings list's. That list says "what
  // does this setting reach"; this says "what does this workload publish with" — and that
  // is the question someone asks before they change anything, because a Deployment
  // Setting shared by two environments means a deploy into it publishes to both.
  //
  // Answering it one workload at a time (open workload, read footer, go back) is how a
  // person ends up sharing a setting without noticing. So the pairing is readable, and
  // editable, from one place.
  //
  // ── WHY A DISCLOSURE ──
  //
  // Most accounts have far more workloads than settings, and on most days the pairing is
  // not what the reader came for: every workload is created with a setting of its own and
  // stays that way. So the band opens CLOSED, with the counts that say whether anything
  // in here needs attention — if nothing is shared, the closed row is the whole answer.
  //
  // ── WHY EACH ROW COMMITS ON ITS OWN ──
  //
  // Changing which setting an environment publishes with is a discrete act on one
  // environment, not part of the page's settings record — so it commits when it is made
  // and says what it did, including the new reach. Queueing it behind the page's Save bar
  // would leave the pairing on screen disagreeing with the pairing in force, which is the
  // one thing this card cannot do.
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

  // Match on the workload's name OR on the setting any of its environments publishes
  // with, because "which workloads are on magalu-storefront" is exactly the question this
  // card is opened with.
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

  // WHAT THE CLOSED ROW SAYS. The totals are the reason to open it or not: an account
  // where nothing is shared has nothing in here to check.
  const totals = computed(() => {
    const all = workloadBindings.value
    const shared = all.filter((workload) =>
      workload.environments.some((environment) => boundWorkloads(environment.settingsId).length > 1)
    ).length
    return { workloads: all.length, shared }
  })

  const settingName = (settingsId) => strategyById(settingsId)?.name ?? ''

  // ONLY THE COMPATIBLE ONES, AND ONLY THE ONES THIS WORKLOAD MAY REACH. An environment
  // may be pointed at a setting whose `deployment_policy` equals its own, plus whatever is
  // bound today so the current value is never missing from its own Select — console-kit's
  // `filterDeploymentsByPolicy`. A `Versioned` environment cannot take a `Single` setting,
  // and no workload can take another workload's DEDICATED setting, so the picker must not
  // offer either: an option that would be rejected is worse than no option.
  const optionsFor = (workload, environment) =>
    settingsForPolicy(environment.deploymentPolicy, environment.settingsId, workload.id).map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
      disabled: strategy.status === 'Inactive'
    }))

  const isShared = (settingsId) => boundWorkloads(settingsId).length > 1

  const reachOf = (settingsId) => reachLabel(boundWorkloads(settingsId).length)

  // THE CHANGE. It reports the new reach rather than a bare "saved", because the reach is
  // the consequence the reader needs to see: pointing this environment at a setting
  // another one already uses is the moment a deploy stops being local.
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
      <!-- `--accordion-inset` puts the trigger on the card's own left margin, so the
           closed row lines up with the rows of every other card on the page. The panel is
           flush by contract, so all padding below lives on the blocks inside it. -->
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
              <!-- ONLY WHEN SOMETHING IS SHARED. A count of zero shared is the ordinary
                   state, and a badge on every account would teach the reader to stop
                   seeing it. -->
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

              <!-- ONE ROW PER WORKLOAD, and inside it one control per ENVIRONMENT —
                   because the environment is what publishes with a setting, not the
                   workload. A workload with two environments answers this twice, and
                   those two answers are allowed to differ. -->
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
                    <!-- The environment's OWN deployment policy. It is not decoration:
                         it is what decides which settings the Select beside it offers. -->
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
                    <!-- NOBODY CHOSE THIS ONE. An environment with no explicit pick is
                         linked automatically to the first setting matching its policy, so
                         the row says so rather than looking like a decision someone made
                         and forgot. -->
                    <Tag
                      v-if="environment.auto"
                      label="Linked automatically"
                      severity="secondary"
                      size="medium"
                    />
                    <!-- The consequence, beside the control that causes it: a setting
                         already on another environment makes this deploy reach further
                         than this row. -->
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
