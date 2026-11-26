<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import IntegrationCard, { type IntegrationCardBadge } from '@aziontech/ui/integration-card'
  import Item from '@aziontech/ui/item'
  import Tag from '@aziontech/ui/tag'
  import { computed } from 'vue'

  import ConnectPaths from './parts/connect-paths.vue'
  import DeploymentCard from './parts/deployment-card.vue'
  import { sampleDeployment, sampleNextSteps, sampleResources } from './sample'
  import type {
    DeploySuccessDeployment,
    DeploySuccessNextStep,
    DeploySuccessResource
  } from './types'

  export type {
    DeploySuccessDeployment,
    DeploySuccessNextStep,
    DeploySuccessResource,
    DeploySuccessResourceState,
    DeploySuccessSource
  } from './types'

  export interface DeploySuccessProps {
    /** The outcome heading. */
    title?: string
    /** The lead sentence; the scope tag follows it when the deployment has a Git source. */
    description?: string
    /** The live service; null leaves the card out when nothing serves the resource. Left out, the sample renders. */
    deployment?: DeploySuccessDeployment | null
    /** What the flow created or bound. Left out, the sample renders. */
    resources?: DeploySuccessResource[]
    /** The next-step tiles. Left out, the sample renders. */
    nextSteps?: DeploySuccessNextStep[]
    /** Resource name the Get started commands link; empty leaves the Get started section out. */
    getStarted?: string
  }

  const props = withDefaults(defineProps<DeploySuccessProps>(), {
    title: 'Resource deployed',
    description: 'You deployed a new resource.',
    deployment: undefined,
    resources: undefined,
    nextSteps: undefined,
    getStarted: ''
  })

  const emit = defineEmits<{
    /** A next-step tile without href was activated. */
    'next-step': [event: MouseEvent, step: DeploySuccessNextStep]
    /** Manage service, or Manage resource when nothing serves it yet, was pressed. */
    manage: [event: MouseEvent]
  }>()

  const recommendedBadge: IntegrationCardBadge[] = [{ label: 'Recommended', variant: 'primary' }]

  const currentDeployment = computed(() =>
    props.deployment === undefined ? sampleDeployment : props.deployment
  )
  const source = computed(() => currentDeployment.value?.source)
  const lead = computed(() => (source.value ? `${props.description} Source:` : props.description))
  const currentResources = computed(() => props.resources ?? sampleResources)
  const currentNextSteps = computed(() => props.nextSteps ?? sampleNextSteps)
  const manageLabel = computed(() =>
    currentDeployment.value ? 'Manage service' : 'Manage resource'
  )
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)"
      >
        <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
          <header
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-2xs)"
          >
            <h1 class="text-balance text-title-md text-(--text-default)">{{ title }}</h1>
            <p
              class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              {{ lead }}
              <Tag
                v-if="source"
                :label="source.scope"
                severity="neutral"
                :icon="source.icon"
              />
            </p>
          </header>

          <div
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <DeploymentCard
              v-if="currentDeployment"
              :deployment="currentDeployment"
            />

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Resources</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <Item
                      v-for="resource in currentResources"
                      :key="resource.key"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
                        >
                          <i
                            :class="resource.icon"
                            class="text-body-sm leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ resource.name }}</Item.Title>
                        <Item.Description>
                          {{ resource.kind }} · {{ resource.reference }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <Tag
                          :label="resource.state === 'bound' ? 'Bound' : 'Created'"
                          :severity="resource.state === 'bound' ? 'info' : 'success'"
                          size="small"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Next steps</h2>
              <div
                class="grid grid-cols-1 gap-(--spacing-sm)"
                data-testid="create-deploy-success__next-steps"
              >
                <IntegrationCard
                  v-for="step in currentNextSteps"
                  :key="step.title"
                  :title="step.title"
                  :logo="step.icon"
                  :description="step.description"
                  :href="step.href ?? ''"
                  :badges="step.recommended ? recommendedBadge : []"
                  @select="(event: MouseEvent) => emit('next-step', event, step)"
                />
              </div>
            </section>

            <ConnectPaths
              v-if="getStarted"
              :get-started="getStarted"
            />

            <div class="flex self-end max-sm:self-stretch">
              <Button
                class="flex-1"
                :label="manageLabel"
                variant="secondary"
                size="large"
                @click="(event: MouseEvent) => emit('manage', event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
