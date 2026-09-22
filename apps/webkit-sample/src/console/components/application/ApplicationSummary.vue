<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
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
     * The reader's own addresses bound to this application —
     * `{ id, domain, environment, certificate }[]`. The first one is what traffic arrives
     * on; the generated Azion hostname answers too.
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
    'add-domain',
    /** The reader asked for the addresses this application answers on. */
    'manage-domains',
    /** The reader asked for the application's own record. */
    'settings'
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

  // Copying is silent by nature, so it toasts — the same confirmation every other copy in
  // this console gives. What travels is the URL, not the bare hostname: the reader's next
  // move with it is a browser or a curl, and both want the scheme.
  const copyUrl = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(domainUrl.value)
      toast.success('URL copied.')
    } catch {
      toast.error('Could not copy the URL.')
    }
  }

  // The strip's overflow. Copying is the card's own act; the other two are the PAGE's
  // destinations, exactly as Visit is — a summary does not know what tab its settings
  // live on.
  const onAction = (value) => {
    if (value === 'copy-url') return copyUrl()
    if (value === 'manage-domains') return emit('manage-domains')
    if (value === 'settings') return emit('settings')
  }

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
          <span
            v-if="!domain"
            class="truncate text-body-sm text-(--text-disabled)"
          >
            Not deployed yet
          </span>
        </div>

        <!-- THE STRIP'S RIGHT END IS ACTIONS. Visit opens the address beside it; the
             overflow holds what a reader does NEXT from an address — copy it, manage the
             domains that answer on it, open the application's own record. Copying was a
             boxed CopyButton wedged between the hostname and its "+N": a permanent control
             for a once-in-a-while act, in the one place the address needed room. -->
        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            v-if="domain"
            key="visit-site"
            label="Visit"
            kind="secondary"
            size="medium"
            icon="pi pi-external-link"
            @click="emit('visit')"
          />

          <Dropdown
            placement="bottom-end"
            @select="(event, value) => onAction(value)"
          >
            <Dropdown.Trigger>
              <Tooltip text="Application actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Application actions"
                />
              </Tooltip>
            </Dropdown.Trigger>

            <!-- Copy URL is absent while the application has no address: a menu row that
                 copies an empty string is worse than one that is not offered. -->
            <Dropdown.Group v-if="domain">
              <Dropdown.Option
                value="copy-url"
                label="Copy URL"
              >
                <template #left>
                  <i
                    class="pi pi-copy"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>

            <Dropdown.Group>
              <Dropdown.Option
                value="manage-domains"
                label="Manage Domains"
              >
                <template #left>
                  <i
                    class="ai ai-domains"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
              <Dropdown.Option
                value="settings"
                label="Settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>
      </SummaryBand>

      <SummaryBand
        kind="facts"
        class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Deployment</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <template v-if="deployment">
              <ResourceLink
                :label="deployment.versionId"
                :to="deploymentRoute"
                module="Deployments"
              />
              <Tag
                :label="deployment.environment"
                severity="secondary"
                size="small"
                class="shrink-0"
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

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <span class="text-label-sm text-(--text-muted)">Domains</span>
            <Tooltip text="Add a custom domain">
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
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
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
              None
            </span>
          </div>
        </div>

        <!-- The state of the deployment that last shipped this application — the one
             status an application has, and the same value its row carries in the module
             list (../../pages/applications/Applications.vue). -->
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
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

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <template v-if="deployment">
              <span class="truncate text-body-sm text-(--text-default)">
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
            </template>
            <span
              v-else
              class="truncate text-body-sm text-(--text-disabled)"
            >
              —
            </span>
          </div>
        </div>

        <!-- A git application names its repository and the branch Azion watches. One
             without a repository has no source to name, so the cell carries the act that
             gives it one — the same control, wording and treatment the module list's
             Repository cell uses (../../pages/applications/Applications.vue). -->
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Source</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
            <template v-if="repository">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-github shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <ResourceLink
                  :label="repository"
                  :href="`https://github.com/${repository}`"
                />
              </div>
              <div
                v-if="branch"
                class="flex min-w-0 items-center gap-(--spacing-xs)"
              >
                <i
                  class="pi pi-code shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">{{ branch }}</span>
              </div>
            </template>
            <button
              v-else
              type="button"
              class="inline-flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              @click="emit('connect-repository')"
            >
              <span class="truncate">Connect Git Repository</span>
            </button>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
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
