<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  import GetStarted from '../../../components/application/GetStarted.vue'

  interface Props {
    resources?: unknown[]
    scope?: string
    domain?: string
    live?: boolean
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
    title: 'Application deployed',
    lead: 'You deployed a new application.',
    nextSteps: () => [],
    source: 'git',
    applicationName: ''
  })

  defineEmits<{
    manage: []
    select: [step: unknown]
  }>()

  const resourcesTitle = computed(() =>
    props.resources.some((resource) => resource.state === 'bound')
      ? 'Resources'
      : 'Resources created'
  )

  const deployedUrl = computed(() => (props.domain ? `https://${props.domain}` : ''))

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
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xl)">
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
            icon="pi pi-github"
          />
        </template>
      </p>
    </header>

    <div
      class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
    >
      <CardBox v-if="domain">
        <template #content>
          <div class="flex flex-wrap items-center gap-(--spacing-sm)">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
            >
              <i
                class="pi pi-globe text-body-sm leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>

            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Domain</span>
              <a
                v-if="live"
                :href="deployedUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-fit max-w-full break-all text-label-md text-(--text-default) no-underline hover:underline"
                >{{ domain }}</a
              >
              <span
                v-else
                class="break-all text-label-md text-(--text-default)"
                >{{ domain }}</span
              >
            </div>

            <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
              <CopyButton
                kind="outlined"
                size="medium"
                :value="domain"
                aria-label="Copy domain"
              />
              <Button
                v-if="live"
                label="Visit"
                kind="outlined"
                size="medium"
                :href="deployedUrl"
                target="_blank"
              />
            </div>
          </div>
        </template>
      </CardBox>

      <CardBox
        :title="resourcesTitle"
        :padded="false"
      >
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

      <CardBox
        title="Next steps"
        :padded="false"
      >
        <template #content>
          <Item.List>
            <Item
              v-for="step in steps"
              :key="step.title"
              as-child
              size="small"
            >
              <button
                v-if="!step.to && !step.href && step.action"
                type="button"
                class="w-full text-left"
                @click="$emit('select', step)"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-body-sm leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </button>

              <RouterLink
                v-else-if="step.to"
                :to="step.to"
                class="text-left no-underline"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-body-sm leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </RouterLink>

              <a
                v-else
                :href="step.href ?? DOCUMENTATION"
                target="_blank"
                rel="noopener"
                class="text-left no-underline"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-body-sm leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </a>
            </Item>
          </Item.List>
        </template>
      </CardBox>

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
