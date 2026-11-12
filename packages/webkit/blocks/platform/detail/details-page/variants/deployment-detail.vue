<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import LogView, { type LogViewLine } from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  type StepStatus = 'done' | 'failed' | 'skipped' | 'running' | 'pending'
  type DeployStep = {
    key: string
    title: string
    description: string
    status: StepStatus
    duration: string
    lines: LogViewLine[]
  }

  const steps: DeployStep[] = [
    {
      key: 'build',
      title: 'Build',
      description: 'Bundle written to .build/worker.js',
      status: 'done',
      duration: '28s',
      lines: [
        {
          id: '0',
          time: '14:02:11',
          type: 'text',
          message: '[build] Running deploy command · platform deploy --auto --local'
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
      key: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'done',
      duration: '8.1s',
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
          message: '[upload] Prefix 20260722112530 (rotate-prefix)'
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
      key: 'manifest',
      title: 'Manifest',
      description: 'manifest.json read, every resource resolved',
      status: 'done',
      duration: '1.9s',
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
      key: 'function',
      title: 'Function',
      description: 'Function bound to the bundle',
      status: 'done',
      duration: '3.6s',
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
      key: 'resource',
      title: 'Resource',
      description: 'Resource and cache settings applied',
      status: 'done',
      duration: '2.8s',
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
      key: 'origin',
      title: 'Origin',
      description: 'Origin pointed at the storage',
      status: 'done',
      duration: '1.9s',
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
          message: '[manifest] Storage web-app-assets · prefix 20260722112530'
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
      key: 'rules',
      title: 'Rules',
      description: 'Request-phase rules applied',
      status: 'done',
      duration: '4.8s',
      lines: [
        {
          id: '0',
          time: '14:02:59',
          type: 'success',
          message:
            '[manifest] Rule"Set storage origin for all requests" with id 604943 successfully updated'
        },
        {
          id: '1',
          time: '14:03:00',
          type: 'success',
          message: '[manifest] Rule"Deliver static assets" with id 604944 successfully updated'
        },
        {
          id: '2',
          time: '14:03:01',
          type: 'success',
          message: '[manifest] Rule"Redirect to index.html" with id 604945 successfully updated'
        },
        {
          id: '3',
          time: '14:03:03',
          type: 'success',
          message: '[manifest] 3 rules applied in the request phase'
        }
      ]
    },
    {
      key: 'service',
      title: 'Service',
      description: 'Service deployment published to the domain',
      status: 'done',
      duration: '3.7s',
      lines: [
        {
          id: '0',
          time: '14:03:04',
          type: 'success',
          message: '[manifest] Service web-app with id 1784675753 successfully updated'
        },
        {
          id: '1',
          time: '14:03:05',
          type: 'success',
          message: '[manifest] Service deployment d_7Kq2mVbHZ with id 5591028 successfully created'
        },
        {
          id: '2',
          time: '14:03:06',
          type: 'text',
          message: '[manifest] Environment production'
        },
        {
          id: '3',
          time: '14:03:07',
          type: 'text',
          message: '[manifest] Updated domain web-app with ID 1784675753'
        }
      ]
    },
    {
      key: 'purge',
      title: 'Cache purge',
      description: 'Cache purged for the domain',
      status: 'done',
      duration: '3.4s',
      lines: [
        {
          id: '0',
          time: '14:03:08',
          type: 'text',
          message: '[purge] purge_on_publish · Initializing cache warming...'
        },
        {
          id: '1',
          time: '14:03:09',
          type: 'text',
          message: '[purge] Purge request accepted for web-app-mh2saq.example.com'
        },
        {
          id: '2',
          time: '14:03:10',
          type: 'text',
          message: '[purge] Cache warmed for 3 locations'
        },
        {
          id: '3',
          time: '14:03:11',
          type: 'success',
          message: '[purge] Purge finished executing'
        }
      ]
    },
    {
      key: 'finish',
      title: 'Live',
      description: 'Deployment serving traffic at the domain',
      status: 'done',
      duration: '0.9s',
      lines: [
        {
          id: '0',
          time: '14:03:12',
          type: 'text',
          message:
            '[deploy] To visualize your resource access the domain: https://web-app-mh2saq.example.com'
        },
        {
          id: '1',
          time: '14:03:12',
          type: 'success',
          message: '[deploy] Deployed finished executing'
        }
      ]
    }
  ]
  const lines = steps.flatMap((step, index) =>
    step.lines.map((line) => ({ ...line, id: `${index}-${line.id}` }))
  )
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const logView = ref('phased')
  const openStep = ref('finish')

  const stepStatusLabels: Record<StepStatus, string> = {
    done: 'Done',
    failed: 'Failed',
    skipped: 'Skipped',
    running: 'Running',
    pending: 'Not started'
  }
</script>

<template>
  <div class="layout-boundary flex min-h-0 w-full flex-1 flex-col">
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <div class="[--popup-origin:top] animate-popup-scale-in motion-reduce:animate-none">
        <Alert
          severity="success"
          size="small"
          label="Published to the production environment of web-app in 1m 1s. Live at https://web-app-mh2saq.example.com."
        />
      </div>

      <Card :padded="false">
        <template #header>
          <p class="text-heading-xs text-(--text-default)">Deployment details</p>

          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Tooltip text="https://web-app-mh2saq.example.com">
              <Button
                label="Visit"
                kind="secondary"
                size="medium"
                icon="pi pi-external-link"
                href="https://web-app-mh2saq.example.com"
                target="_blank"
              />
            </Tooltip>

            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <Tooltip text="Deployment actions">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="medium"
                    aria-label="Deployment actions"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="logs"
                  label="Logs"
                >
                  <template #left>
                    <i
                      class="pi pi-align-left"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
                <DropdownMenu.Option
                  value="requests"
                  label="Requests"
                >
                  <template #left>
                    <i
                      class="pi pi-arrow-right-arrow-left"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="redeploy"
                  label="Redeploy"
                >
                  <template #left>
                    <i
                      class="pi pi-refresh"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </template>

        <template #content>
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) p-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
          >
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Created</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <Tooltip text="Rafael Garbinatto · October 29, 2026, 11:30:58 AM">
                  <Avatar
                    alt="Rafael Garbinatto"
                    label="Rafael Garbinatto"
                    size="small"
                    kind="square"
                  />
                </Tooltip>
                <span class="truncate text-body-sm text-(--text-default)"> Rafael Garbinatto </span>
                <span class="shrink-0 text-body-sm text-(--text-muted)"> 1 week ago </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Status</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <StatusIndicator
                  severity="success"
                  label="Ready"
                />
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Duration</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-clock shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)"> 1m 1s </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Environment</span>
              <div class="flex min-w-0 items-center">
                <Tag
                  severity="secondary"
                  size="medium"
                  label="Production"
                />
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Service</span>
              <Tooltip text="Open web-app in Services">
                <a
                  href="/services/1784675753"
                  class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline">
                    web-app
                  </span>
                  <i
                    class="pi pi-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Resource</span>
              <Tooltip text="Open web-app in Resources">
                <a
                  href="/resources/1784552864"
                  class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline">
                    web-app
                  </span>
                  <i
                    class="pi pi-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Triggered by</span>
              <div class="flex min-w-0 items-center">
                <Tooltip text="platform deploy --auto --local">
                  <Tag
                    severity="secondary"
                    size="medium"
                    icon="pi pi-code"
                    label="CLI"
                  />
                </Tooltip>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Preset</span>
              <div class="flex min-w-0 items-center">
                <Tooltip text="build.preset in platform.config.js">
                  <Tag
                    severity="secondary"
                    size="medium"
                    icon="pi pi-wrench"
                    label="vue"
                  />
                </Tooltip>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3">
              <span class="text-label-sm text-(--text-muted)">Storage</span>
              <div
                class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
              >
                <i
                  class="pi pi-inbox shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate">web-app-assets</span>
                <span
                  class="text-body-xs text-(--text-muted)"
                  aria-hidden="true"
                  >·</span
                >
                <span class="text-label-code-sm text-(--text-muted)"> 20260722112530 </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3">
              <span class="text-label-sm text-(--text-muted)">Domains</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <Tooltip text="Open web-app-mh2saq.example.com in a new tab">
                  <a
                    href="https://web-app-mh2saq.example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                  >
                    <span class="truncate underline-offset-2 group-hover/link:underline">
                      web-app-mh2saq.example.com
                    </span>
                    <i
                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                      aria-hidden="true"
                    />
                  </a>
                </Tooltip>
                <CopyButton
                  kind="outlined"
                  value="web-app-mh2saq.example.com"
                  aria-label="Copy domain name"
                  class="shrink-0"
                />
              </div>
            </div>
          </div>

          <div
            class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas)"
          >
            <Accordion
              type="single"
              arrow-position="left"
              collapsible
            >
              <Accordion.Item value="deployment-settings">
                <div class="relative">
                  <Accordion.Trigger :level="3">
                    <span class="flex min-h-12 items-center">
                      <span class="text-label-md text-(--text-default)">Deployment Settings</span>
                    </span>
                  </Accordion.Trigger>

                  <div
                    class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) @lg/band:pb-0"
                  >
                    <div class="pointer-events-auto">
                      <Tooltip text="Open Default in Build and deployment settings">
                        <a
                          href="/account/build-deployment"
                          class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                        >
                          <span class="truncate underline-offset-2 group-hover/link:underline">
                            Default
                          </span>
                          <i
                            class="pi pi-external-link shrink-0 text-body-xs leading-none"
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
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-sm text-(--text-muted)">Binding policy</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                        <span class="truncate text-body-sm text-(--text-default)"> Strict </span>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-sm text-(--text-muted)">Deployment policy</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                        <span class="truncate text-body-sm text-(--text-default)"> Single </span>
                      </span>
                    </div>
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-sm text-(--text-muted)">Canary</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
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
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-sm text-(--text-muted)">Skew protection</span>
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
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
            <span class="text-label-sm text-(--text-muted)"> 1m 1s </span>
            <ToggleGroup
              v-model="logView"
              :options="logViews"
              size="medium"
              aria-label="Log view"
            />
          </div>
        </template>

        <template #content>
          <div class="flex w-full flex-col">
            <Accordion
              v-if="logView === 'phased'"
              v-model="openStep"
              type="single"
              collapsible
            >
              <Accordion.Item
                v-for="step in steps"
                :key="step.key"
                :value="step.key"
              >
                <Accordion.Trigger>
                  <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
                    <span class="flex size-5 shrink-0 items-center justify-center">
                      <i
                        v-if="step.status === 'done'"
                        class="pi pi-check-circle text-(--success-contrast)"
                        aria-hidden="true"
                      />
                      <i
                        v-else-if="step.status === 'failed'"
                        class="pi pi-times-circle text-(--danger-contrast)"
                        aria-hidden="true"
                      />
                      <i
                        v-else-if="step.status === 'skipped'"
                        class="pi pi-minus-circle text-(--text-muted) opacity-60"
                        aria-hidden="true"
                      />
                      <span
                        v-else
                        class="size-3.5 rounded-full border border-dashed border-(--border-default)"
                      />
                    </span>
                    <span class="sr-only">{{ stepStatusLabels[step.status] }}</span>
                    <span
                      :data-state="step.status"
                      class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-start data-[state=failed]:flex-wrap"
                    >
                      <span
                        :data-state="step.status"
                        class="shrink-0 text-label-md text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
                      >
                        {{ step.title }}
                      </span>
                      <span
                        :data-state="step.status"
                        class="min-w-0 truncate text-body-sm text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast) data-[state=running]:motion-safe:bg-[linear-gradient(90deg,var(--text-muted)_0%,var(--text-muted)_35%,var(--text-default)_50%,var(--text-muted)_65%,var(--text-muted)_100%)] data-[state=running]:motion-safe:bg-[length:200%_100%] data-[state=running]:motion-safe:bg-clip-text data-[state=running]:motion-safe:text-transparent data-[state=running]:motion-safe:animate-(--animate-shimmer) motion-reduce:animate-none"
                      >
                        {{ step.description }}
                      </span>
                    </span>
                    <span class="ms-auto flex shrink-0 items-center">
                      <span
                        v-if="step.duration"
                        class="text-label-code-md text-(--text-muted)"
                      >
                        {{ step.duration }}
                      </span>
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <LogView
                    :lines="step.lines"
                    :bordered="false"
                    copyable
                    :loading="step.status === 'pending'"
                    loading-label="Waiting to start…"
                  >
                    <LogViewContent>
                      <template #empty>No log lines yet.</template>
                    </LogViewContent>
                  </LogView>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <LogView
              v-else
              :lines="lines"
              :bordered="false"
              copyable
              loading-label="Waiting to start…"
            >
              <LogViewContent>
                <template #empty>No log lines yet.</template>
              </LogViewContent>
            </LogView>
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>
