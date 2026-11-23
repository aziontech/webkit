<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface DeploymentDetailsCardProps {
    /** The deployment serves traffic, so Visit opens its address. */
    live: boolean
    /** Who started the deployment. */
    author: string
    /** The full date and time the deployment was created at. */
    createdAt: string
    /** How long ago the deployment was created. */
    createdAgo: string
    /** The status of the deployment. */
    status: { severity: StatusIndicatorSeverity; label: string }
    /** How long the run took; left empty, it reads Not started. */
    duration: string
    /** The environment the deployment targets. */
    environment: string
    /** What started the deployment: its name, its icon and the command behind it. */
    trigger: { label: string; icon: string; command: string }
    /** The storage prefix the assets were uploaded under. */
    storagePrefix: string
  }

  defineProps<DeploymentDetailsCardProps>()

  const DOMAIN = 'web-app-mh2saq.example.com'
  const URL = `https://${DOMAIN}`

  const SETTINGS = [
    { label: 'Binding policy', value: 'Strict' },
    { label: 'Deployment policy', value: 'Single' },
    { label: 'Canary', value: '' },
    { label: 'Skew protection', value: '' }
  ]

  const DEPLOYMENT_SETTINGS_SUMMARY_CLASS =
    'flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs) px-(--spacing-md) pb-(--spacing-md) ' +
    '@lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) ' +
    '@lg/band:pb-0'
</script>

<template>
  <Card :padded="false">
    <template #header>
      <p class="text-heading-xs text-(--text-default)">Deployment details</p>

      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <Tooltip :content="live ? URL : 'Available once the deployment is live'">
          <Button
            label="Visit"
            variant="secondary"
            size="medium"
            icon="az az-external-link"
            v-bind="
              live
                ? { href: URL, target: '_blank', 'aria-label': 'Visit (opens in a new tab)' }
                : { disabled: true }
            "
          />
        </Tooltip>

        <DropdownMenu
          side="bottom"
          align="end"
        >
          <DropdownMenu.Trigger>
            <Tooltip content="Deployment actions">
              <IconButton
                icon="az az-ellipsis"
                variant="outline"
                size="medium"
                aria-label="Deployment actions"
              />
            </Tooltip>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="logs"
              label="Logs"
            >
              <template #leading>
                <i
                  class="az az-align-left"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              value="requests"
              label="Requests"
            >
              <template #leading>
                <i
                  class="az az-arrow-right-left"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="redeploy"
              label="Redeploy"
            >
              <template #leading>
                <i
                  class="az az-refresh"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </div>
    </template>

    <template #default>
      <div
        class="grid grid-cols-1 gap-(--spacing-lg) p-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
      >
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Tooltip :content="`${author} · ${createdAt}`">
              <Avatar
                :alt="author"
                :label="author"
                size="small"
                variant="square"
              />
            </Tooltip>
            <span class="truncate text-body-sm text-(--text-default)">{{ author }}</span>
            <span class="shrink-0 text-body-sm text-(--text-muted)">{{ createdAgo }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <StatusIndicator v-bind="status" />
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Duration</span>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <i
              class="az az-clock shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span
              v-if="duration"
              class="truncate text-body-sm text-(--text-default)"
              >{{ duration }}</span
            >
            <span
              v-else
              class="truncate text-body-sm text-(--text-muted)"
            >
              Not started
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Environment</span>
          <div class="flex min-w-0 items-center">
            <Tag
              severity="neutral"
              size="medium"
              :label="environment"
            />
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Service</span>
          <TableCellLink
            label="web-app"
            href="/services/1784675753"
            destination="Services"
          />
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Resource</span>
          <TableCellLink
            label="web-app"
            href="/resources/1784552864"
            destination="Resources"
          />
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Triggered by</span>
          <div class="flex min-w-0 items-center">
            <Tooltip :content="trigger.command">
              <Tag
                severity="neutral"
                size="medium"
                :icon="trigger.icon"
                :label="trigger.label"
              />
            </Tooltip>
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs)">
          <span class="text-label-sm text-(--text-muted)">Preset</span>
          <div class="flex min-w-0 items-center">
            <Tooltip content="build.preset in platform.config.js">
              <Tag
                severity="neutral"
                size="medium"
                icon="az az-wrench"
                label="vue"
              />
            </Tooltip>
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs) sm:col-span-2 lg:col-span-3">
          <span class="text-label-sm text-(--text-muted)">Storage</span>
          <div
            class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <i
              class="az az-inbox shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate">web-app-assets</span>
            <span
              class="text-body-xs text-(--text-muted)"
              aria-hidden="true"
              >·</span
            >
            <span class="text-label-code-sm text-(--text-muted)">{{ storagePrefix }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-(--spacing-2xs) sm:col-span-2 lg:col-span-3">
          <span class="text-label-sm text-(--text-muted)">Domains</span>
          <div class="flex w-fit min-w-0 max-w-full items-center gap-(--spacing-xs)">
            <i
              class="az az-globe shrink-0 text-body-lg text-(--text-muted)"
              aria-hidden="true"
            />
            <TableCellLink
              :label="DOMAIN"
              :href="URL"
            />
            <CopyButton
              variant="outline"
              :value="DOMAIN"
              aria-label="Copy domain name"
              class="shrink-0"
              size="small"
            />
          </div>
        </div>
      </div>

      <div
        class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas)"
      >
        <Accordion
          type="single"
          icon-position="leading"
          collapsible
        >
          <Accordion.Item value="deployment-settings">
            <div class="relative">
              <Accordion.Trigger :heading-level="3">
                <span class="flex min-h-12 items-center">
                  <span class="text-label-md text-(--text-default)">Deployment Settings</span>
                </span>
              </Accordion.Trigger>

              <div :class="DEPLOYMENT_SETTINGS_SUMMARY_CLASS">
                <div class="pointer-events-auto">
                  <TableCellLink
                    label="Default"
                    href="/account/build-deployment"
                    destination="Build and deployment settings"
                  />
                </div>
              </div>
            </div>

            <Accordion.Content>
              <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2 lg:grid-cols-4">
                <div
                  v-for="setting in SETTINGS"
                  :key="setting.label"
                  class="flex min-w-0 flex-col gap-(--spacing-2xs)"
                >
                  <span class="text-label-sm text-(--text-muted)">{{ setting.label }}</span>
                  <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                    <template v-if="setting.value">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        setting.value
                      }}</span>
                    </template>
                    <template v-else>
                      <svg
                        class="h-(--size-4) w-(--size-4) shrink-0 text-(--text-muted)"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        fill-rule="evenodd"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 0a8 8 0 100 16A8 8 0 008 0z M4.25 8a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H5A.75.75 0 014.25 8z"
                        />
                      </svg>
                      <span class="truncate text-body-sm text-(--text-muted)"> Disabled </span>
                    </template>
                  </span>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </template>
  </Card>
</template>
