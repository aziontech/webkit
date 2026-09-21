<script setup>
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'

  import { deploymentPolicyLabel } from '../../lib/data/deployment-strategies'
  import {
    applicationRecord,
    DEPLOY_FAILS_ONCE,
    DEPLOY_FAILURE_MESSAGE,
    servingApplication,
    settingsById
  } from '../../lib/data/releases'
  import { BIND_TARGET_ORDER, bindTargetFor } from '../../lib/data/topology-bind-targets'
  import { RESOURCE_DEPLOY_DURATION_MS, startResourceDeployRun } from '../../lib/state/deploy-runs'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    /** The workload being deployed — `{ id, name, domain }`. */
    workload: { type: Object, required: true },
    /**
     * The environments this workload publishes into, each paired with the Deployment
     * setting that serves it — `{ name, settingsId, deploymentPolicy }[]`
     * (../../lib/state/workload-environments.js).
     */
    environments: { type: Array, default: () => [] },
    /** Which environment to land on, by name. Falls back to the first one. */
    preselectedEnvironment: { type: String, default: '' },
    /**
     * The topology picks waiting for a deploy, keyed by slot — `{ [slot]: { id, name } }`
     * for a bind or a change, `{ removed: true }` for a staged removal.
     */
    staged: { type: Object, default: () => ({}) },
    /** What each slot holds in traffic today, keyed the same way. Used to read a pick as a change. */
    live: { type: Object, default: () => ({}) }
  })

  const emit = defineEmits(['deployed', 'add-environment'])

  const RESOLVE_MS = 500

  const resolving = ref(false)
  const loadError = ref('')
  const deploying = ref(false)
  const retried = ref(false)
  const selected = ref('')

  const environmentItems = computed(() =>
    props.environments.map((environment) => ({
      value: environment.name,
      label: environment.name,
      ariaLabel: `${environment.name}, ${deploymentPolicyLabel(environment.deploymentPolicy)}`
    }))
  )

  const settingFor = (name) =>
    settingsById(props.environments.find((entry) => entry.name === name)?.settingsId) ?? null

  const selectedSetting = computed(() => settingFor(selected.value))

  const otherWorkloads = computed(() =>
    (selectedSetting.value?.workloads ?? [])
      .filter((entry) => String(entry.id) !== String(props.workload.id))
      .map((entry) => entry.name)
  )

  const changes = computed(() =>
    BIND_TARGET_ORDER.filter((slot) => props.staged[slot]).map((slot) => {
      const target = bindTargetFor(slot)
      const pick = props.staged[slot]
      const current = props.live[slot] ?? null

      if (pick.removed) {
        return {
          slot,
          kind: target.kind,
          icon: target.icon,
          verb: 'Removed',
          severity: 'danger',
          detail: current?.name ? `${current.name} stops serving this workload.` : ''
        }
      }

      return current
        ? {
            slot,
            kind: target.kind,
            icon: target.icon,
            verb: 'Changed',
            severity: 'warning',
            detail: `${current.name} to ${pick.name}.`
          }
        : {
            slot,
            kind: target.kind,
            icon: target.icon,
            verb: 'Added',
            severity: 'success',
            detail: `${pick.name} starts serving this workload.`
          }
    })
  )

  const changeCount = computed(() => changes.value.length)

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${selected.value}.`
  )

  const hasEnvironment = computed(() => props.environments.length > 0)

  const environmentSettled = computed(() => props.environments.length === 1)

  const policyOf = (name) =>
    deploymentPolicyLabel(props.environments.find((entry) => entry.name === name)?.deploymentPolicy)

  const resolve = async () => {
    resolving.value = true
    loadError.value = ''
    try {
      await new Promise((settle) => setTimeout(settle, RESOLVE_MS))
      const preselected = props.environments.some(
        (entry) => entry.name === props.preselectedEnvironment
      )
      selected.value = preselected
        ? props.preselectedEnvironment
        : (props.environments[0]?.name ?? '')
    } catch (error) {
      loadError.value = error?.message ?? "The deploy targets for this workload couldn't be loaded."
    } finally {
      resolving.value = false
    }
  }

  watch(open, (isOpen) => {
    if (!isOpen) {
      deploying.value = false
      return
    }
    resolve()
  })

  const deploy = async () => {
    if (deploying.value || !selected.value) return

    deploying.value = true
    try {
      const setting = selectedSetting.value
      if (DEPLOY_FAILS_ONCE.has(setting?.id) && !retried.value) {
        retried.value = true
        throw new Error(DEPLOY_FAILURE_MESSAGE)
      }

      const application = applicationRecord(servingApplication(props.workload.id))
      const environment = selected.value
      const count = changeCount.value

      startResourceDeployRun({
        workload: {
          id: props.workload.id,
          name: props.workload.name,
          domain: props.workload.domain ?? ''
        },
        application,
        strategy: setting ? { id: setting.id, name: setting.name } : null,
        deploymentName: `${application.name || props.workload.name}-release`,
        environment,
        preset: application.preset,
        durationMs: RESOURCE_DEPLOY_DURATION_MS,
        notify: false
      })

      toast.success(`Deploying ${props.workload.name} into ${environment}.`, {
        description: count
          ? `${count} ${count === 1 ? 'change is' : 'changes are'} going live. The deployment keeps building if you leave.`
          : 'The deployment keeps building if you leave.'
      })

      emit('deployed', { environment })
      open.value = false
    } catch (error) {
      toast.error(`Couldn't deploy ${props.workload.name}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => deploy() }
      })
    } finally {
      deploying.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    title="Deploy"
    :description="`Publish ${workload.name}. Review what this release carries and where it lands.`"
    save-label="Deploy"
    :submitting="deploying"
    :save-disabled="resolving || !!loadError || !hasEnvironment"
    @submit="deploy"
  >
    <template #start>
      <span
        v-if="!resolving && !loadError && hasEnvironment && changeCount"
        class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-xs text-(--text-muted)"
      >
        <i
          class="pi pi-info-circle shrink-0"
          aria-hidden="true"
        />
        <span class="truncate">{{ changeSummary }}</span>
      </span>
    </template>

    <template v-if="resolving">
      <Section
        stacked
        :divided="false"
        title="Changes to deploy"
        hint="What this release carries that is not live yet."
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
          <Skeleton
            v-for="row in 2"
            :key="row"
            kind="shape"
            width="100%"
            height="56px"
          />
        </div>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Environment"
        hint="Where the release lands, and the Deployment Settings that serve it."
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
          <Skeleton
            v-for="row in 2"
            :key="row"
            kind="shape"
            width="100%"
            height="72px"
          />
        </div>
      </Section>
    </template>

    <Section
      key="section-1"
      v-else-if="loadError"
      stacked
      :divided="false"
      title="Deploy"
    >
      <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
        <Message
          severity="danger"
          :label="loadError"
        />
        <Button
          label="Retry"
          kind="outlined"
          size="small"
          icon="pi pi-refresh"
          @click="resolve"
        />
      </div>
    </Section>

    <Section
      key="section-2"
      v-else-if="!hasEnvironment"
      stacked
      :divided="false"
      title="Environment"
    >
      <EmptyState
        bordered
        size="small"
        icon="pi pi-link"
        title="No environment on this workload"
        :description="`${workload.name} publishes into nothing yet, so there is no target for a release. Add a domain and the environment it answers in, then deploy.`"
      >
        <template #actions>
          <Button
            label="Add Environment"
            kind="outlined"
            size="small"
            @click="emit('add-environment')"
          />
        </template>
      </EmptyState>
    </Section>

    <template v-else>
      <Section
        stacked
        :divided="false"
        title="Changes to deploy"
        hint="What this release carries that is not live yet."
      >
        <div
          v-if="changeCount"
          class="flex min-w-0 flex-col gap-(--spacing-xs)"
        >
          <div
            v-for="change in changes"
            :key="change.slot"
            class="flex min-w-0 items-start gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-sm)"
          >
            <i
              :class="change.icon"
              class="mt-(--spacing-xxs) shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <span class="text-body-sm text-(--text-default)">{{ change.kind }}</span>
              <span class="text-body-xs text-(--text-muted)">{{ change.detail }}</span>
            </div>
            <Tag
              :label="change.verb"
              :severity="change.severity"
              size="small"
              class="shrink-0"
            />
          </div>
        </div>

        <p
          v-else
          class="text-body-sm text-(--text-muted)"
        >
          Nothing is staged on the topology, so this republishes what {{ workload.name }} already
          serves.
        </p>
      </Section>

      <Section
        stacked
        :divided="false"
        :title="environmentSettled ? 'Where it lands' : 'Environment'"
        hint="Where the release lands, and the Deployment Settings that serve it."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div
            v-if="environmentSettled"
            class="flex min-w-0 items-start justify-between gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-sm)"
          >
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <span class="text-body-sm text-(--text-default)">{{ selected }}</span>
              <span class="truncate text-body-xs text-(--text-muted)">
                Publishes with {{ selectedSetting?.name ?? 'Azion Default' }}.
              </span>
            </div>
            <Tag
              :label="policyOf(selected)"
              severity="info"
              size="small"
              class="shrink-0"
            />
          </div>

          <FieldStack
            v-else
            group
            label="Environment"
            required
            description="Each environment publishes with its own Deployment Settings. The release goes live on the one selected."
          >
            <template #default="{ labelId }">
              <BoxGridSelection
                v-model="selected"
                :items="environmentItems"
                :disabled="deploying"
                class="flex-col"
                :aria-labelledby="labelId"
              >
                <template #default="{ item }">
                  <div class="flex w-full min-w-0 items-start justify-between gap-(--spacing-sm)">
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-body-sm text-(--text-default)">{{ item.label }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)">
                        {{ settingFor(item.value)?.name ?? 'Azion Default' }}
                      </span>
                    </div>
                    <Tag
                      :label="policyOf(item.value)"
                      severity="info"
                      size="small"
                      class="shrink-0"
                    />
                  </div>
                </template>
              </BoxGridSelection>
            </template>
          </FieldStack>

          <Message
            v-if="selectedSetting?.shared && otherWorkloads.length"
            severity="warning"
            size="small"
            :label="`Deploying with ${selectedSetting.name} also publishes to ${otherWorkloads.join(', ')}.`"
          />
        </div>
      </Section>
    </template>
  </ResourceDrawer>
</template>
