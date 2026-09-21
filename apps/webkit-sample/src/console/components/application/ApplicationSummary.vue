<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { statusMeta } from '../../lib/data/deployments'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { relativeTime } from '../../lib/format/relative-time'
  import ResourceLink from '../resource/ResourceLink.vue'

  const props = defineProps({
    /** The record this page is about — `{ id, name, preset, source, repository, branch, domainName, status }`. */
    application: { type: Object, required: true },
    /** The newest deployment that shipped it, or `null` while it has none. */
    deployment: { type: Object, default: null },
    /** Carried on the deployment link so the demo keeps the signed-in email. */
    email: { type: String, default: '' }
  })

  const emit = defineEmits([
    /** The reader opened the live address. */
    'visit',
    /** The reader asked to connect a repository to an application that has none. */
    'connect-repository'
  ])

  const domain = computed(() => props.application.domainName || '')
  const domainUrl = computed(() => (domain.value ? `https://${domain.value}` : ''))
  const repository = computed(() => props.application.repository || '')
  const branch = computed(() => props.application.branch || '')
  const live = computed(() => props.application.status !== 'Inactive')

  const deploymentRoute = computed(() =>
    props.deployment
      ? {
          path: `/deployments/${props.deployment.versionId}`,
          query: {
            email: props.email,
            application: props.application.id,
            applicationName: props.application.name
          }
        }
      : null
  )

  const deployedAgo = computed(() => relativeTime(props.deployment?.deployedAt))
  const deploymentStatus = computed(() => statusMeta(props.deployment?.status))
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <div
        class="flex flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) p-(--spacing-md)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="ai ai-domains shrink-0 text-[1.15em] text-(--text-muted)"
            aria-hidden="true"
          />
          <ResourceLink
            v-if="domain"
            :label="domain"
            :href="domainUrl"
          />
          <span
            v-else
            class="truncate text-body-sm text-(--text-disabled)"
          >
            Not deployed yet
          </span>
          <CopyButton
            v-if="domain"
            kind="outlined"
            :value="domainUrl"
            aria-label="Copy application domain"
            class="shrink-0"
          />
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            v-if="domain"
            label="Visit site"
            kind="outlined"
            size="medium"
            icon="pi pi-external-link"
            @click="emit('visit')"
          />
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              :severity="live ? 'success' : 'neutral'"
              :label="application.status || 'Active'"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Framework</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <i
              :class="presetIcon(application.preset)"
              class="shrink-0 text-[1.15em]"
              aria-hidden="true"
            />
            <span class="truncate text-body-sm text-(--text-default)">
              {{ presetLabel(application.preset) }}
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Repository</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <template v-if="repository">
              <i
                class="pi pi-github shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <ResourceLink
                :label="repository"
                :href="`https://github.com/${repository}`"
              />
            </template>
            <Button
              v-else
              label="Connect"
              kind="text"
              size="small"
              icon="pi pi-link"
              class="-ml-(--spacing-xs)"
              @click="emit('connect-repository')"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Branch</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <i
              v-if="branch"
              class="pi pi-code shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span
              class="truncate text-body-sm"
              :class="branch ? 'text-(--text-default)' : 'text-(--text-disabled)'"
            >
              {{ branch || 'None' }}
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Application ID</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
              {{ application.id }}
            </span>
            <CopyButton
              kind="outlined"
              :value="String(application.id)"
              aria-label="Copy application ID"
              class="shrink-0"
            />
          </div>
        </div>
      </div>

      <div
        v-if="deployment"
        class="flex flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) p-(--spacing-md)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-sm)">
          <span class="shrink-0 text-label-sm text-(--text-muted)">Last deployment</span>
          <ResourceLink
            :label="deployment.versionId"
            :to="deploymentRoute"
            module="Deployments"
          />
          <Tag
            :label="deployment.environment"
            severity="secondary"
            size="medium"
            class="shrink-0"
          />
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
          <StatusIndicator
            :severity="deploymentStatus.severity"
            :loading="deploymentStatus.loading"
            :label="deployment.status"
          />
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-muted)">
              {{ deployedAgo }} by {{ deployment.author }}
            </span>
            <Avatar
              :src="deployment.authorAvatar || undefined"
              :alt="deployment.author"
              :label="deployment.author"
              size="small"
              kind="square"
              class="shrink-0"
            />
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</template>
