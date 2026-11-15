<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import LogView, { type LogViewStep, type LogViewStepsView } from '@aziontech/webkit/log-view'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  type DeployStep = LogViewStep & { tag?: { label: string; severity: TagSeverity } }

  const steps: DeployStep[] = [
    {
      id: 'build',
      title: 'Build',
      description: 'Bundle written to .build/worker.js',
      status: 'success',
      duration: '26s',
      lines: [
        {
          id: '0',
          time: '14:02:11',
          type: 'text',
          message: '[build] Running deploy command · Console (UI)'
        },
        {
          id: '1',
          time: '14:02:11',
          type: 'text',
          message: '[build] Getting presets available'
        },
        {
          id: '2',
          time: '14:02:12',
          type: 'text',
          message: '[build] Building with preset"vue" (platform bundler)'
        },
        {
          id: '3',
          time: '14:02:38',
          type: 'text',
          message: '[build] vite build · 1.69 MB in dist/'
        },
        {
          id: '4',
          time: '14:02:39',
          type: 'text',
          message: '[build] Wrote .build/worker.js and .build/manifest.json'
        },
        {
          id: '5',
          time: '14:02:39',
          type: 'success',
          message: '[build] Build finished successfully'
        }
      ]
    },
    {
      id: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'success',
      duration: '7.8s',
      lines: [
        {
          id: '0',
          time: '14:02:39',
          type: 'text',
          message: '[upload] Uploading .build/assets to storage web-app-assets'
        },
        {
          id: '1',
          time: '14:02:40',
          type: 'text',
          message: '[upload] Prefix 20260730140211 (rotate-prefix)'
        },
        {
          id: '2',
          time: '14:02:46',
          type: 'success',
          message: '[upload] 24 files updated successfully'
        },
        {
          id: '3',
          time: '14:02:47',
          type: 'success',
          message: '[upload] Storage web-app-assets successfully updated'
        }
      ]
    },
    {
      id: 'manifest',
      title: 'Manifest',
      description: 'manifest.json read, every resource resolved',
      status: 'success',
      duration: '1.7s',
      lines: [
        {
          id: '0',
          time: '14:02:47',
          type: 'text',
          message: '[manifest] Reading manifest.json file'
        },
        {
          id: '1',
          time: '14:02:48',
          type: 'text',
          message: '[manifest] Resolved 4 resources to apply: function, resource, origin, service'
        },
        {
          id: '2',
          time: '14:02:48',
          type: 'text',
          message: '[manifest] 3 rules declared in the request phase'
        },
        {
          id: '3',
          time: '14:02:49',
          type: 'success',
          message: '[manifest] manifest.json read successfully'
        }
      ]
    },
    {
      id: 'function',
      title: 'Function',
      description: 'Function bound to the bundle',
      status: 'success',
      duration: '3.4s',
      lines: [
        {
          id: '0',
          time: '14:02:49',
          type: 'text',
          message: '[manifest] Updated function __DEFAULT__ with ID 53089'
        },
        {
          id: '1',
          time: '14:02:51',
          type: 'text',
          message: '[manifest] Bound .build/worker.js to function 53089'
        },
        {
          id: '2',
          time: '14:02:53',
          type: 'success',
          message: '[manifest] Function binding __DEFAULT__ with id 47458 successfully updated'
        }
      ]
    },
    {
      id: 'resource',
      title: 'Resource',
      description: 'Resource and cache settings applied',
      status: 'success',
      duration: '2.6s',
      lines: [
        {
          id: '0',
          time: '14:02:53',
          type: 'text',
          message: '[manifest] Updated resource web-app with ID 1784552864'
        },
        {
          id: '1',
          time: '14:02:55',
          type: 'success',
          message: '[manifest] Cache setting __DEFAULT__ successfully updated'
        },
        {
          id: '2',
          time: '14:02:56',
          type: 'success',
          message: '[manifest] Resource web-app successfully updated'
        }
      ]
    },
    {
      id: 'origin',
      title: 'Origin',
      description: 'Origin pointed at the storage',
      status: 'success',
      duration: '1.8s',
      lines: [
        {
          id: '0',
          time: '14:02:56',
          type: 'text',
          message: '[manifest] Creating origin storage-default (storage)'
        },
        {
          id: '1',
          time: '14:02:57',
          type: 'text',
          message: '[manifest] Storage web-app-assets · prefix 20260730140211'
        },
        {
          id: '2',
          time: '14:02:58',
          type: 'success',
          message: '[manifest] Origin storage-default with id 263718 successfully updated'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Rules',
      description: 'The rules rejected this deployment (409 Conflict).',
      status: 'error',
      duration: '4.1s',
      tag: { label: 'Failed', severity: 'danger' },
      lines: [
        {
          id: '0',
          time: '14:02:59',
          type: 'text',
          message:
            '[manifest] Rule"Set storage origin for all requests" with id 604943 successfully updated'
        },
        {
          id: '1',
          time: '14:03:01',
          type: 'text',
          level: 'warn',
          message: '[ERROR] [manifest] Error while creating rule"Deliver static assets"'
        },
        {
          id: '2',
          time: '14:03:02',
          type: 'text',
          message: '409 Conflict: a rule with this behavior is already bound to service web-app'
        },
        {
          id: '3',
          time: '14:03:03',
          type: 'text',
          level: 'warn',
          message: '[ERROR] [manifest] Deploy aborted. Nothing was published.'
        }
      ]
    },
    {
      id: 'service',
      title: 'Service',
      description: 'Never ran. The deployment stopped at Rules',
      status: 'skipped',
      duration: '',
      tag: { label: 'Skipped', severity: 'neutral' },
      lines: []
    },
    {
      id: 'purge',
      title: 'Cache purge',
      description: 'Never ran. The deployment stopped at Rules',
      status: 'skipped',
      duration: '',
      tag: { label: 'Skipped', severity: 'neutral' },
      lines: []
    },
    {
      id: 'finish',
      title: 'Live',
      description: 'Never ran. The deployment stopped at Rules',
      status: 'skipped',
      duration: '',
      tag: { label: 'Skipped', severity: 'neutral' },
      lines: []
    }
  ]
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const stepTag = (key: string) => steps.find((step) => step.id === key)?.tag

  const logView = ref<LogViewStepsView>('phased')
  const openStep = ref('rules')
</script>

<template>
  <div class="layout-boundary flex min-h-0 w-full flex-1 flex-col">
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <div class="[--popup-origin:top] animate-popup-scale-in motion-reduce:animate-none">
        <Alert
          severity="danger"
          size="small"
          label="A rule with the same behavior is already bound to this service, so the manifest was refused. Nothing was published, and the service keeps serving its previous deployment."
        >
          <template #actions>
            <Button
              label="Redeploy"
              variant="secondary"
              size="medium"
              icon="ai ai-refresh"
            />
          </template>
        </Alert>
      </div>

      <Card :padded="false">
        <template #header>
          <p class="text-heading-xs text-(--text-default)">Deployment details</p>

          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Tooltip content="Available once the deployment is live">
              <Button
                label="Visit"
                variant="secondary"
                size="medium"
                icon="ai ai-external-link"
                disabled
                target="_blank"
              />
            </Tooltip>

            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <Tooltip content="Deployment actions">
                  <IconButton
                    icon="ai ai-ellipsis"
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
                      class="ai ai-align-left"
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
                      class="ai ai-arrow-right-left"
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
                      class="ai ai-refresh"
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
                <Tooltip content="John Smith · November 06, 2026, 10:30:58 AM">
                  <Avatar
                    alt="John Smith"
                    label="John Smith"
                    size="small"
                    variant="square"
                  />
                </Tooltip>
                <span class="truncate text-body-sm text-(--text-default)"> John Smith </span>
                <span class="shrink-0 text-body-sm text-(--text-muted)"> 1 hour ago </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Status</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <StatusIndicator
                  severity="danger"
                  label="Error"
                />
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Duration</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-clock shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)"> 48s </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Environment</span>
              <div class="flex min-w-0 items-center">
                <Tag
                  severity="neutral"
                  size="medium"
                  label="Preview"
                />
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Service</span>
              <Tooltip content="Open web-app in Services">
                <a
                  href="/services/1784675753"
                  class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline">
                    web-app
                  </span>
                  <i
                    class="ai ai-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Resource</span>
              <Tooltip content="Open web-app in Resources">
                <a
                  href="/resources/1784552864"
                  class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline">
                    web-app
                  </span>
                  <i
                    class="ai ai-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Triggered by</span>
              <div class="flex min-w-0 items-center">
                <Tooltip content="Console (UI)">
                  <Tag
                    severity="neutral"
                    size="medium"
                    icon="ai ai-desktop"
                    label="Console"
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
                    icon="ai ai-wrench"
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
                  class="ai ai-inbox shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate">web-app-assets</span>
                <span
                  class="text-body-xs text-(--text-muted)"
                  aria-hidden="true"
                  >·</span
                >
                <span class="text-label-code-sm text-(--text-muted)"> 20260730140211 </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs) sm:col-span-2 lg:col-span-3">
              <span class="text-label-sm text-(--text-muted)">Domains</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-globe shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <Tooltip content="Open web-app-mh2saq.example.com in a new tab">
                  <a
                    href="https://web-app-mh2saq.example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                  >
                    <span class="truncate underline-offset-2 group-hover/link:underline">
                      web-app-mh2saq.example.com
                    </span>
                    <i
                      class="ai ai-external-link shrink-0 text-body-xs leading-none"
                      aria-hidden="true"
                    />
                  </a>
                </Tooltip>
                <CopyButton
                  variant="outline"
                  value="web-app-mh2saq.example.com"
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

                  <div
                    class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) @lg/band:pb-0"
                  >
                    <div class="pointer-events-auto">
                      <Tooltip content="Open Default in Build and deployment settings">
                        <a
                          href="/account/build-deployment"
                          class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                        >
                          <span class="truncate underline-offset-2 group-hover/link:underline">
                            Default
                          </span>
                          <i
                            class="ai ai-external-link shrink-0 text-body-xs leading-none"
                            aria-hidden="true"
                          />
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <Accordion.Content>
                  <div
                    class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-label-sm text-(--text-muted)">Binding policy</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                        <span class="truncate text-body-sm text-(--text-default)"> Strict </span>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-label-sm text-(--text-muted)">Deployment policy</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                        <span class="truncate text-body-sm text-(--text-default)"> Single </span>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-label-sm text-(--text-muted)">Canary</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
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
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-label-sm text-(--text-muted)">Skew protection</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
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
                      </span>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </template>
      </Card>

      <Card
        :padded="false"
        class="w-full"
      >
        <template #header>
          <p class="min-w-0 truncate text-heading-xs text-(--text-default)">Deployment logs</p>

          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <StatusIndicator
              severity="danger"
              label="Error"
            />
            <ToggleGroup
              v-model="logView"
              :options="logViews"
              size="medium"
              aria-label="Log view"
            />
          </div>
        </template>

        <template #default>
          <LogView.Steps
            v-model:view="logView"
            v-model:open-step="openStep"
            :steps="steps"
            :view-switch="false"
          >
            <template #step-meta="{ step }">
              <Tag
                v-if="stepTag(step.id)"
                v-bind="stepTag(step.id)"
                size="small"
              />
            </template>
            <template #step-empty="{ step }">
              {{
                step.status === 'skipped'
                  ? 'Never ran. The deployment stopped at Rules.'
                  : 'No log lines yet.'
              }}
            </template>
          </LogView.Steps>
        </template>
      </Card>
    </section>
  </div>
</template>
