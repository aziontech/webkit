<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

  import { cloneResource, plural, resolvedVersion } from './lib/release-impact'
  import OutcomeActions from './parts/outcome-actions.vue'
  import ReleaseImpactPanel from './parts/release-impact-panel.vue'
  import ReleaseResourceCard from './parts/release-resource-card.vue'
  import { sampleImpact, sampleResources } from './sample'
  import type { ReleaseImpactResource, ReleaseImpactSettings } from './types'

  export type {
    ReleaseImpactDependency,
    ReleaseImpactDependencyGroup,
    ReleaseImpactEnvironment,
    ReleaseImpactProject,
    ReleaseImpactResource,
    ReleaseImpactResourceType,
    ReleaseImpactSettings,
    ReleaseImpactVersion
  } from './types'

  export interface ReleaseImpactProps {
    /** The resources the release deploys; switches and version picks edit a local copy. Left out, the sample renders. */
    resources?: ReleaseImpactResource[]
    /** The Deployment Settings the release reaches, with their environments and projects. Left out, the sample renders. */
    impact?: ReleaseImpactSettings[]
    /** The impact is being computed. */
    loading?: boolean
    /** Why the impact could not be read, shown in the warning alert with Retry. */
    error?: string
    /** The projects list came back truncated, so the impact may be incomplete. */
    truncated?: boolean
    /** The release is deploying. */
    deploying?: boolean
    /** The last run deployed the release. */
    deployed?: boolean
    /** Why the last run failed, shown in the danger alert and the error toast. */
    deployError?: string
  }

  type ImpactState = 'ready' | 'loading' | 'partial' | 'unavailable'
  type Outcome = '' | 'failed' | 'succeeded'

  const props = withDefaults(defineProps<ReleaseImpactProps>(), {
    resources: undefined,
    impact: undefined,
    loading: false,
    error: '',
    truncated: false,
    deploying: false,
    deployed: false,
    deployError: ''
  })

  const emit = defineEmits<{
    /** Deploy release was confirmed, or Redeploy pressed; carries the included resources at their versions. */
    deploy: [event: MouseEvent, resources: ReleaseImpactResource[]]
    /** Retry in the unavailable impact alert. */
    retry: [event: MouseEvent]
    /** Edit in the outcome alert; focus moves to the resources. */
    edit: [event: MouseEvent]
  }>()

  const RUN_TOAST = 'release-impact-run'
  const runToast = (description: string) => ({ id: RUN_TOAST, description })

  const cards = ref<ReleaseImpactResource[]>([])
  watch(
    () => props.resources ?? sampleResources,
    (next) => {
      cards.value = next.map(cloneResource)
    },
    { immediate: true }
  )

  const impactTree = computed<ReleaseImpactSettings[]>(
    () => props.impact ?? (props.loading || props.error ? [] : sampleImpact)
  )

  const impactState = computed<ImpactState>(() => {
    if (props.loading) return 'loading'
    if (props.error) return 'unavailable'
    return props.truncated ? 'partial' : 'ready'
  })
  const impactView = ref('tree')
  const confirmOpen = ref(false)
  const dismissed = ref(false)
  const resourcesHeadingEl = ref<HTMLElement | null>(null)

  const deploying = computed(() => props.deploying)
  const outcome = computed<Outcome>(() => {
    if (dismissed.value || props.deploying) return ''
    if (props.deployError) return 'failed'
    return props.deployed ? 'succeeded' : ''
  })

  const included = computed(() => cards.value.filter((card) => card.enabled))

  const missing = computed(() =>
    included.value.filter((card) => !card.readonly && !card.versions.length)
  )

  const projects = computed(() =>
    impactTree.value.flatMap((settings) =>
      settings.environments.flatMap((environment) => environment.projects)
    )
  )

  const environments = computed(() =>
    impactTree.value.flatMap((settings) =>
      settings.environments.map((environment) => environment.name)
    )
  )

  const impactSummary = computed(
    () =>
      `This release reaches ${plural(projects.value.length, 'project', 'projects')} ` +
      `in ${plural(environments.value.length, 'environment', 'environments')} ` +
      `through ${plural(impactTree.value.length, 'Deployment Setting', 'Deployment Settings')}.`
  )

  const blocker = computed(() => {
    if (missing.value.length)
      return `${missing.value[0].name} has no Ready version, so the release cannot be deployed.`
    if (impactState.value === 'loading') return 'Computing impact…'
    return ''
  })

  const canDeploy = computed(() => !deploying.value && !missing.value.length)

  const releaseLine = computed(() =>
    included.value
      .filter((card) => !card.readonly)
      .map((card) => `${card.name} ${resolvedVersion(card)}`)
      .join(', ')
  )

  const confirmBody = computed(
    () =>
      `${releaseLine.value} go into traffic on ${plural(projects.value.length, 'project', 'projects')} in ${environments.value.join(' and ')}. Resources left out keep the version they serve now.`
  )

  const unavailableMessage = computed(() =>
    impactState.value === 'partial'
      ? 'The projects list was truncated, so these numbers may be incomplete. You can still deploy.'
      : props.error
  )

  const edit = async (event: MouseEvent) => {
    toast.dismiss(RUN_TOAST)
    dismissed.value = true
    emit('edit', event)
    await nextTick()
    resourcesHeadingEl.value?.focus()
  }

  const deploy = (event: MouseEvent) => {
    emit('deploy', event, included.value.map(cloneResource))
  }

  const confirmDeploy = (event: MouseEvent) => {
    confirmOpen.value = false
    deploy(event)
  }

  useShortcuts({
    keys: 'meta+enter',
    label: 'Deploy release',
    group: 'Page',
    when: () => canDeploy.value && !confirmOpen.value,
    handler: () => {
      confirmOpen.value = true
    }
  })

  watch(
    () => [props.deploying, props.deployed, props.deployError],
    () => {
      dismissed.value = false
    }
  )

  watch(
    () => props.deploying,
    (running) => {
      if (!running) return
      toast.loading(
        'Deploying release…',
        runToast(`${releaseLine.value}. It keeps running if you leave.`)
      )
    },
    { immediate: true }
  )

  watch(
    outcome,
    (next) => {
      if (next === 'failed')
        toast.error("The release wasn't deployed.", runToast(props.deployError))
      else if (next === 'succeeded')
        toast.success(
          'Release deployed.',
          runToast(
            `${releaseLine.value} serve ${plural(projects.value.length, 'project', 'projects')} now.`
          )
        )
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex min-h-0 flex-1 flex-col">
      <div
        class="layout-column-focused layout-boundary flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <PageHeader
          title="Review and deploy"
          description="Check the resources this release deploys and everything it reaches, then deploy it."
          size="large"
        />

        <Alert
          key="alert-1"
          v-if="outcome === 'failed'"
          severity="danger"
          :label="`The release wasn't deployed. ${deployError} Nothing changed in traffic.`"
        >
          <template #actions>
            <OutcomeActions
              @edit="edit"
              @redeploy="deploy"
            />
          </template>
        </Alert>
        <Alert
          key="alert-2"
          v-else-if="outcome === 'succeeded'"
          severity="success"
          :label="`Release deployed. ${releaseLine} serve ${plural(projects.length, 'project', 'projects')} now.`"
        >
          <template #actions>
            <OutcomeActions
              @edit="edit"
              @redeploy="deploy"
            />
          </template>
        </Alert>

        <div
          class="grid min-w-0 items-start gap-(--layout-section-gap) xl:grid-cols-[minmax(0,1fr)_minmax(var(--container-xs),var(--container-sm))]"
        >
          <section
            aria-labelledby="release-impact-resources"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <h2
              id="release-impact-resources"
              ref="resourcesHeadingEl"
              tabindex="-1"
              class="text-heading-xs text-(--text-default) focus-visible:outline-none"
            >
              Resources
            </h2>

            <ReleaseResourceCard
              v-for="(card, index) in cards"
              :key="card.type"
              v-model:card="cards[index]"
              :deploying="deploying"
            />
          </section>

          <div class="min-w-0 xl:sticky xl:top-(--layout-boundary-start)">
            <ReleaseImpactPanel
              v-model:view="impactView"
              :state="impactState"
              :tree="impactTree"
              :summary="impactSummary"
              :projects="projects"
              :environments="environments"
              :unavailable-message="unavailableMessage"
              @retry="(event: MouseEvent) => emit('retry', event)"
            />
          </div>
        </div>
      </div>

      <SaveBar variant="docked">
        <template #leading>
          <p class="text-body-sm text-(--text-muted)">
            Deploying puts every included resource into traffic at the version shown.
          </p>
        </template>
        <template #actions>
          <p
            v-if="blocker"
            class="flex items-center gap-(--spacing-xs) text-body-sm text-(--warning-foreground)"
          >
            <i
              class="az az-triangle-alert shrink-0"
              aria-hidden="true"
            />
            {{ blocker }}
          </p>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Cancel"
              variant="outline"
              size="medium"
              href="/services/web-app"
              :disabled="deploying"
            />
          </div>
          <ConfirmDialog
            v-model:open="confirmOpen"
            title="Deploy this release?"
            :description="confirmBody"
            confirm-label="Deploy release"
            variant="primary"
            size="small"
            :disabled="!canDeploy"
            @confirm="confirmDeploy"
          >
            <template #trigger>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  variant="primary"
                  size="medium"
                  icon="az az-cloud-upload"
                  :disabled="!canDeploy"
                  :loading="deploying"
                  :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
                >
                  {{ deploying ? 'Deploying…' : 'Deploy release' }}
                  <span
                    v-if="!deploying"
                    class="max-lg:hidden"
                    aria-hidden="true"
                  >
                    <Kbd
                      meta
                      key-name="enter"
                      size="small"
                    />
                  </span>
                </Button>
              </div>
            </template>
          </ConfirmDialog>
        </template>
      </SaveBar>
    </main>
  </div>
</template>
