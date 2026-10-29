<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  import GetStarted from '../../../components/application/GetStarted.vue'
  import ResourceLink from '../../../components/resource/ResourceLink.vue'
  import { relativeTime } from '../../../lib/format/relative-time'

  interface Props {
    resources?: unknown[]
    scope?: string
    domain?: string
    live?: boolean
    deployment?: Record<string, unknown> | null
    title?: string
    lead?: string
    nextSteps?: unknown[]
    source?: string
    applicationName?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    resources: () => [],
    scope: '',
    domain: '',
    live: true,
    deployment: null,
    title: 'Application deployed',
    lead: 'You deployed a new application.',
    nextSteps: () => [],
    source: 'git',
    applicationName: ''
  })

  const emit = defineEmits<{
    manage: []
    select: [step: unknown]
  }>()

  const resourcesTitle = computed(() =>
    props.resources.some((resource) => resource.state === 'bound')
      ? 'Resources'
      : 'Resources created'
  )

  const route = useRoute()

  const email = computed(() => String(route.query.email || 'myemail@azion.com'))

  const workload = computed(() => props.deployment?.workload ?? null)
  const application = computed(() => props.deployment?.application ?? null)

  const deployedUrl = computed(() => (props.domain ? `https://${props.domain}` : ''))

  const deploymentTitle = computed(
    () => workload.value?.name || application.value?.name || props.applicationName || props.domain
  )

  const createdLabel = computed(() => relativeTime(props.deployment?.createdAt))

  const repository = computed(() => application.value?.repository ?? '')
  const branch = computed(() => application.value?.branch ?? '')

  const domainsRoute = computed(() =>
    workload.value
      ? {
          path: `/workloads/${workload.value.id}`,
          query: { email: email.value, name: workload.value.name, tab: 'settings' }
        }
      : null
  )

  const DOCUMENTATION = 'https://www.azion.com/en/documentation/'

  const DEFAULT_NEXT_STEPS = [
    {
      icon: 'pi pi-globe',
      title: 'Customize domain',
      description: 'Associate a custom domain and subdomains to Azion to handle user access.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Point traffic',
      description:
        'Redirect the traffic of a domain to Azion and take advantage of the distributed network.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'View analytics',
      description: 'Gain powerful insights into your performance, availability, and security.'
    }
  ]

  const steps = computed(() => (props.nextSteps.length ? props.nextSteps : DEFAULT_NEXT_STEPS))

  const stepIsExternal = (step) => !step.to && !step.action

  const stepTag = (step) => {
    if (step.to) return RouterLink
    return step.action ? 'button' : 'a'
  }

  const stepBindings = (step) => {
    if (step.to) return { to: step.to }
    if (step.action) return { type: 'button' }
    return { href: step.href ?? DOCUMENTATION, target: '_blank', rel: 'noopener noreferrer' }
  }

  const onStepClick = (event, step) => {
    if (step.action && !step.to) emit('select', step)
  }
</script>

<template>
  <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
    <header
      class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)"
    >
      <h1 class="text-balance text-heading-lg text-(--text-default)">{{ title }}</h1>
      <p class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
        {{ lead }}
        <template v-if="scope">
          into
          <Tag
            :label="scope"
            severity="secondary"
            icon="ai ai-github"
          />
        </template>
      </p>
    </header>

    <div
      class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
    >
      <CardBox v-if="domain">
        <template #content>
          <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
            <component
              :is="live ? 'a' : 'div'"
              :href="live ? deployedUrl : undefined"
              :target="live ? '_blank' : undefined"
              :rel="live ? 'noopener noreferrer' : undefined"
              :aria-label="live ? `Visit ${domain} in a new tab` : undefined"
              :aria-hidden="live ? undefined : 'true'"
              class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-canvas) sm:w-56 before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:before:transition-none"
            >
              <span
                class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
              >
                <i
                  class="pi pi-globe text-body-md leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </component>

            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
              <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                    <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                      {{ deploymentTitle }}
                    </h2>
                    <Tag
                      v-if="live"
                      label="Live"
                      severity="success"
                      size="small"
                    />
                  </div>
                  <span
                    v-if="createdLabel"
                    class="text-body-sm text-(--text-muted)"
                    >Created {{ createdLabel }}</span
                  >
                </div>

                <Button
                  v-if="live"
                  label="Visit site"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-external-link"
                  icon-position="trailing"
                  :href="deployedUrl"
                  target="_blank"
                />
              </div>

              <ul class="flex flex-col gap-(--spacing-xs)">
                <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-domains shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <ResourceLink
                      :label="domain"
                      :href="live ? deployedUrl : ''"
                    />
                  </span>
                  <RouterLink
                    v-if="domainsRoute"
                    :to="domainsRoute"
                    class="group/link inline-flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                  >
                    <i
                      class="pi pi-plus-circle shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate underline-offset-2 group-hover/link:underline"
                      >Add custom domain</span
                    >
                  </RouterLink>
                </li>
                <li
                  v-if="repository"
                  class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-github shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <ResourceLink
                      :label="repository"
                      :href="`https://github.com/${repository}`"
                    />
                  </span>
                  <span
                    v-if="branch"
                    class="flex min-w-0 items-center gap-(--spacing-xxs)"
                  >
                    <i
                      class="ai ai-branch shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-body-sm text-(--text-default)">{{ branch }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </CardBox>

      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-label-md text-(--text-default)">{{ resourcesTitle }}</h2>
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item
                v-for="resource in resources"
                :key="resource.key"
                size="small"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
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
        </CardBox>
      </section>

      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-label-md text-(--text-default)">Next steps</h2>
        <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
          <CardBox
            v-for="step in steps"
            :key="step.title"
            :padded="false"
          >
            <template #content>
              <component
                :is="stepTag(step)"
                v-bind="stepBindings(step)"
                class="group/step relative flex h-full w-full cursor-pointer flex-col gap-(--spacing-sm) rounded-(--shape-card) border-0 bg-transparent p-(--spacing-md) text-left text-inherit no-underline before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:before:transition-none"
                @click="onStepClick($event, step)"
              >
                <span class="relative flex items-center justify-between gap-(--spacing-xs)">
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-body-sm leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                  <i
                    :class="stepIsExternal(step) ? 'pi pi-external-link' : 'pi pi-chevron-right'"
                    class="text-body-xs leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
                <span class="relative flex flex-col gap-(--spacing-xxs)">
                  <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <span class="text-label-md text-(--text-default)">{{ step.title }}</span>
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </span>
                  <span class="text-pretty text-body-sm text-(--text-muted)">{{
                    step.description
                  }}</span>
                </span>
              </component>
            </template>
          </CardBox>
        </div>
      </section>

      <GetStarted
        v-if="source === 'cli'"
        :name="applicationName"
      />

      <Button
        class="w-full"
        label="Manage"
        kind="secondary"
        size="large"
        @click="$emit('manage')"
      />
    </div>
  </div>
</template>
