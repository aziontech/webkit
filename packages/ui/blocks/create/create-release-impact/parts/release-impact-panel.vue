<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  import { plural } from '../lib/release-impact'
  import type { ReleaseImpactProject, ReleaseImpactSettings } from '../types'

  export interface ReleaseImpactPanelProps {
    /** Whether the impact is ready, loading, truncated or unavailable. */
    state: 'ready' | 'loading' | 'partial' | 'unavailable'
    /** The Deployment Settings the release reaches, with their environments and projects. */
    tree: ReleaseImpactSettings[]
    /** One sentence on what the release reaches. */
    summary: string
    /** Every project the release reaches. */
    projects: ReleaseImpactProject[]
    /** Every environment the release reaches. */
    environments: string[]
    /** Why the impact is incomplete or unavailable. */
    unavailableMessage: string
  }

  defineProps<ReleaseImpactPanelProps>()

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  /** Tree or Flow. */
  const view = defineModel<string>('view', { required: true })

  const impactViews = [
    { label: 'Tree', value: 'tree' },
    { label: 'Flow', value: 'flow' }
  ]

  const ENVIRONMENT_BRANCH_CLASS =
    'relative flex min-w-0 flex-col before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-control) before:border-b ' +
    "before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s " +
    "after:border-(--border-default) after:content-[''] last:after:hidden"

  const PROJECT_BRANCH_CLASS =
    'relative flex min-w-0 before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-control) before:border-b before:border-s ' +
    "before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) " +
    "after:content-[''] last:after:hidden"

  const SETTINGS_NODE_CLASS =
    'flex min-w-0 shrink-0 flex-col gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs) ' +
    'sm:w-(--size-40)'
</script>

<template>
  <Card>
    <template #header>
      <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
        <h2 class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            class="az az-bullseye shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-(--text-default)">Impact</span>
        </h2>
        <ToggleGroup
          v-if="state === 'ready' || state === 'partial'"
          v-model="view"
          :options="impactViews"
          aria-label="Impact view"
          size="small"
          class="shrink-0"
        />
      </div>
    </template>
    <template #default>
      <div
        :aria-busy="state === 'loading' || undefined"
        class="flex min-w-0 flex-col gap-(--spacing-sm)"
      >
        <div
          v-if="state === 'loading'"
          class="flex min-w-0 flex-col gap-(--spacing-sm)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <span class="flex size-4 shrink-0 text-(--text-muted)">
              <Spinner class="w-full" />
            </span>
            <span class="text-body-sm text-(--text-muted)">Computing impact…</span>
          </span>
          <Skeleton height="var(--size-4)" />
          <Skeleton
            height="var(--size-4)"
            width="80%"
          />
          <Skeleton
            height="var(--size-4)"
            width="60%"
          />
        </div>

        <div
          v-else-if="state === 'unavailable'"
          class="flex min-w-0 flex-col items-start gap-(--spacing-sm)"
        >
          <Alert
            severity="warning"
            size="small"
            :label="unavailableMessage"
          />
          <span class="text-body-xs text-(--text-muted)">
            {{ plural(tree.length, 'Deployment Setting', 'Deployment Settings') }}
            selected
          </span>
          <Button
            label="Retry"
            variant="outline"
            size="small"
            icon="az az-refresh"
            @click="emit('retry', $event)"
          />
        </div>

        <template v-else>
          <Alert
            v-if="state === 'partial'"
            severity="warning"
            size="small"
            :label="unavailableMessage"
          />

          <ul
            v-if="view === 'tree'"
            aria-label="Deployment Settings this release reaches"
            class="m-0 flex min-w-0 list-none flex-col p-0 [--tree-indent:calc(var(--spacing-sm)*2)] [--tree-rail:var(--spacing-sm)]"
          >
            <li
              v-for="settings in tree"
              :key="settings.id"
              class="flex min-w-0 flex-col"
            >
              <span class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-sliders-horizontal shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ settings.name }}
                  </span>
                </span>
                <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                  {{ plural(settings.domainsCount, 'domain', 'domains') }}
                </span>
              </span>
              <p
                v-if="!settings.environments.length"
                class="ps-(--tree-indent) text-body-xs text-(--text-muted)"
              >
                No projects deploy with these settings yet.
              </p>
              <ul
                v-else
                class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)"
              >
                <li
                  v-for="environment in settings.environments"
                  :key="environment.id"
                  :class="ENVIRONMENT_BRANCH_CLASS"
                >
                  <span
                    class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                  >
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="az az-sitemap shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ environment.name }}
                      </span>
                    </span>
                    <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                      {{ plural(environment.projects.length, 'project', 'projects') }}
                    </span>
                  </span>
                  <ul class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)">
                    <li
                      v-for="project in environment.projects"
                      :key="project.id"
                      :class="PROJECT_BRANCH_CLASS"
                    >
                      <span
                        class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)"
                      >
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <i
                            class="az az-folder shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <span class="truncate text-body-sm text-(--text-default)">
                            {{ project.name }}
                          </span>
                        </span>
                        <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                          {{ plural(project.domainsCount, 'domain', 'domains') }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

          <ul
            v-else
            aria-label="Deployment Settings this release reaches"
            class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-md) p-0"
          >
            <li
              v-for="settings in tree"
              :key="settings.id"
              class="flex min-w-0 flex-col items-stretch gap-(--spacing-xs) sm:flex-row sm:items-center"
            >
              <span :class="SETTINGS_NODE_CLASS">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-sliders-horizontal shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ settings.name }}
                  </span>
                </span>
                <span class="text-body-xs tabular-nums text-(--text-muted)">
                  {{ plural(settings.domainsCount, 'domain', 'domains') }}
                </span>
              </span>
              <i
                class="az az-arrow-right hidden shrink-0 text-body-xs text-(--text-muted) sm:block"
                aria-hidden="true"
              />
              <span
                v-if="!settings.environments.length"
                class="flex rounded-(--shape-card) border border-dashed border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                No projects yet
              </span>
              <ul
                v-else
                :aria-label="`Environments of ${settings.name}`"
                class="m-0 flex min-w-0 flex-1 list-none flex-col gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="environment in settings.environments"
                  :key="environment.id"
                  class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-sitemap shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      {{ environment.name }}
                    </span>
                    <Tag
                      :label="plural(environment.projects.length, 'project', 'projects')"
                      severity="neutral"
                      size="small"
                    />
                  </span>
                  <span
                    v-for="project in environment.projects"
                    :key="project.id"
                    class="flex min-w-0 items-center gap-(--spacing-xs)"
                  >
                    <i
                      class="az az-folder shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-body-sm text-(--text-muted)">
                      {{ project.name }}
                    </span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </template>
        <span
          class="sr-only"
          role="status"
        >
          {{ state === 'loading' ? 'Computing impact' : '' }}
        </span>
      </div>
    </template>
    <template
      v-if="state === 'ready' || state === 'partial'"
      #footer
    >
      <p class="text-body-sm text-(--text-muted)">{{ summary }}</p>
    </template>
  </Card>
</template>
