<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatShortDate } from '@shared/lib/dates'
  import { computed } from 'vue'

  import DomainOverflowPopover from '../list/DomainOverflowPopover.vue'
  import ResourceLink from '../resource/ResourceLink.vue'
  import SummaryBand from '../resource/SummaryBand.vue'

  interface Props {
    workload: Record<string, unknown>
    customDomains?: unknown[]
    environments?: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
    customDomains: () => [],
    environments: () => []
  })

  defineSlots<{
    footer(): unknown
  }>()

  const environment = defineModel('environment', { type: String, default: '' })

  const emit = defineEmits<{
    visit: []
    'add-domain': []
    'add-environment': []
    'manage-domains': []
    settings: []
  }>()

  const domain = computed(() => props.workload.domain ?? '')
  const domainUrl = computed(() => (domain.value ? `https://${domain.value}` : ''))

  const copyUrl = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(domainUrl.value)
      toast.success('URL copied.')
    } catch {
      toast.error('Could not copy the URL.')
    }
  }

  const onAction = (value) => {
    if (value === 'copy-url') return copyUrl()
    if (value === 'manage-domains') return emit('manage-domains')
    if (value === 'settings') return emit('settings')
  }

  const domains = computed(() => props.workload.domains ?? [domain.value])
  const aliasCount = computed(() => props.workload.domainCount ?? 0)

  const environmentLabel = computed(
    () => environment.value || props.environments[0]?.name || 'Production'
  )

  const ADD = '__add-environment__'

  const onSelect = (value) => {
    if (value === ADD) return emit('add-environment')
    environment.value = value
  }

  const live = computed(() => props.workload.status !== 'Inactive')

  const customNames = computed(() => props.customDomains.map((entry) => entry.domain))
  const primaryCustom = computed(() => customNames.value[0] ?? '')
  const extraCustomCount = computed(() => Math.max(customNames.value.length - 1, 0))
  const createdOn = computed(() => formatShortDate(props.workload.createdAt))

  const ownerName = computed(() => {
    const raw = String(props.workload.owner ?? '').trim()
    if (!raw) return ''
    const local = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <SummaryBand kind="subject">
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <ResourceLink
            :label="domain"
            :href="`https://${domain}`"
          />
          <DomainOverflowPopover
            v-if="aliasCount"
            :domains="domains"
            :count="aliasCount"
          />
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Visit"
            kind="secondary"
            size="medium"
            icon="pi pi-external-link"
            @click="emit('visit')"
          />

          <Tooltip
            text="Select an environment to see its deployment and settings, or add another one"
          >
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onSelect(value)"
            >
              <Dropdown.Trigger>
                <span
                  class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
                >
                  <i
                    class="ai ai-layers shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ environmentLabel }}</span>
                  <i
                    class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
              </Dropdown.Trigger>

              <Dropdown.Group label="Environments">
                <Dropdown.Option
                  v-for="option in environments"
                  :key="option.name"
                  :value="option.name"
                  :label="option.name"
                  :selected="option.name === environmentLabel"
                />
              </Dropdown.Group>

              <Dropdown.Group>
                <Dropdown.Option
                  :value="ADD"
                  label="Add Environment"
                >
                  <template #left>
                    <i
                      class="pi pi-plus"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </Tooltip>

          <Dropdown
            placement="bottom-end"
            @select="(event, value) => onAction(value)"
          >
            <Dropdown.Trigger>
              <Tooltip text="Workload actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Workload actions"
                />
              </Tooltip>
            </Dropdown.Trigger>

            <Dropdown.Group>
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
        class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <span class="text-label-sm text-(--text-muted)">Custom domains</span>
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
          </span>

          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <ResourceLink
              v-if="primaryCustom"
              :label="primaryCustom"
              :href="`https://${primaryCustom}`"
            />
            <DomainOverflowPopover
              v-if="extraCustomCount"
              :domains="customNames"
              :count="extraCustomCount"
            />
            <span
              v-if="!primaryCustom"
              class="truncate text-body-sm text-(--text-disabled)"
            >
              None
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              :severity="live ? 'success' : 'neutral'"
              :label="live ? 'Live' : 'Inactive'"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Workload ID</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
              {{ workload.id }}
            </span>
            <CopyButton
              kind="outlined"
              :value="String(workload.id)"
              aria-label="Copy workload ID"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              {{ createdOn }}<template v-if="ownerName"> by {{ ownerName }}</template>
            </span>
            <Avatar
              v-if="ownerName"
              :src="workload.ownerAvatar || undefined"
              :alt="ownerName"
              :label="ownerName"
              size="small"
              kind="square"
              class="shrink-0"
            />
          </div>
        </div>
      </SummaryBand>

      <SummaryBand
        v-if="$slots.footer"
        kind="state"
        :padded="false"
      >
        <slot name="footer" />
      </SummaryBand>
    </template>
  </CardBox>
</template>
