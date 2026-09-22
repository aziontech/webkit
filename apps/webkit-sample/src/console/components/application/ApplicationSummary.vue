<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { statusMeta } from '../../lib/data/deployments'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { relativeTime } from '../../lib/format/relative-time'
  import DomainOverflowPopover from '../list/DomainOverflowPopover.vue'
  import ResourceLink from '../resource/ResourceLink.vue'
  import SummaryBand from '../resource/SummaryBand.vue'

  const props = defineProps({
    /** The record this page is about — `{ id, name, preset, source, repository, branch, domainName }`. */
    application: { type: Object, required: true },
    /**
     * The reader's own addresses bound to this application — `{ id, domain, certificate }[]`.
     * The first one is what traffic arrives on; the generated Azion hostname answers too.
     */
    customDomains: { type: Array, default: () => [] },
    /** The newest deployment that shipped it, or `null` while it has none. It carries the
     *  STATUS this card reports: an application has no status of its own. */
    deployment: { type: Object, default: null },
    /** Carried on the deployment link so the demo keeps the signed-in email. */
    email: { type: String, default: '' },
    /** Where the footer's documentation control points for an application with no repository. */
    documentationHref: {
      type: String,
      default: 'https://www.azion.com/en/documentation/products/azion-cli/overview/'
    }
  })

  const emit = defineEmits([
    /** The reader opened the live address. */
    'visit',
    /** The reader asked to connect a repository to an application that has none. */
    'connect-repository',
    /** The reader asked to bind one of their own domains to this application. */
    'add-domain'
  ])

  const customNames = computed(() => props.customDomains.map((entry) => entry.domain))
  const addresses = computed(() =>
    [...customNames.value, props.application.domainName].filter(Boolean)
  )
  const domain = computed(() => addresses.value[0] ?? '')
  const domainUrl = computed(() => (domain.value ? `https://${domain.value}` : ''))
  const extraCount = computed(() => Math.max(addresses.value.length - 1, 0))
  const repository = computed(() => props.application.repository || '')
  const branch = computed(() => props.application.branch || '')

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
      <SummaryBand kind="subject">
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
          <DomainOverflowPopover
            v-if="extraCount"
            :domains="addresses"
            :count="extraCount"
          />
          <span
            v-if="!domain"
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
          <Tooltip
            v-if="domain"
            text="Add a custom domain"
          >
            <button
              type="button"
              class="-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) p-1 text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              aria-label="Add a custom domain"
              @click="emit('add-domain')"
            >
              <i
                class="pi pi-plus-circle text-body-sm leading-none"
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            v-if="!repository"
            key="connect-git"
            label="Connect Git"
            kind="outlined"
            size="medium"
            icon="pi pi-github"
            @click="emit('connect-repository')"
          />
          <Button
            v-if="domain"
            key="visit-site"
            label="Visit"
            kind="secondary"
            size="medium"
            icon="pi pi-external-link"
            @click="emit('visit')"
          />
        </div>
      </SummaryBand>

      <SummaryBand
        kind="facts"
        class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
      >
        <!-- The state of the deployment that last shipped this application — the one
             status an application has, and the same value its row carries in the module
             list (../../pages/applications/Applications.vue). The band below names WHICH
             deployment it is, so the indicator is not repeated there. -->
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              v-if="deployment"
              :severity="deploymentStatus.severity"
              :loading="deploymentStatus.loading"
              :label="deployment.status"
            />
            <span
              v-else
              class="truncate text-body-sm text-(--text-disabled)"
            >
              Not deployed
            </span>
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
            <span
              v-else
              class="truncate text-body-sm text-(--text-disabled)"
            >
              None
            </span>
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
      </SummaryBand>

      <SummaryBand
        v-if="deployment"
        key="last-deployment"
        kind="state"
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
      </SummaryBand>

      <SummaryBand
        v-if="!repository"
        key="no-repository"
        kind="state"
      >
        <p
          class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
        >
          New code reaches this application from your terminal only. Connect Git, or run
          <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
            >azion deploy</code
          >
          via the CLI.
        </p>

        <Button
          class="ml-auto shrink-0"
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          :href="documentationHref"
          target="_blank"
        />
      </SummaryBand>
    </template>
  </CardBox>
</template>
