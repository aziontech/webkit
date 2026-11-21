<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import LogViewer, {
    type LogViewerStep,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

  const steps: LogViewerStep[] = [
    {
      id: 'build',
      title: 'Build',
      description: 'Bundle written to .build/worker.js',
      status: 'success',
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
      id: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'success',
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
      id: 'manifest',
      title: 'Manifest',
      description: 'manifest.json read, every resource resolved',
      status: 'success',
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
      id: 'function',
      title: 'Function',
      description: 'Function bound to the bundle',
      status: 'success',
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
      id: 'resource',
      title: 'Resource',
      description: 'Resource and cache settings applied',
      status: 'success',
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
      id: 'origin',
      title: 'Origin',
      description: 'Origin pointed at the storage',
      status: 'success',
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
      id: 'rules',
      title: 'Rules',
      description: 'Request-phase rules applied',
      status: 'success',
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
      id: 'service',
      title: 'Service',
      description: 'Service deployment published to the domain',
      status: 'success',
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
      id: 'purge',
      title: 'Cache purge',
      description: 'Cache purged for the domain',
      status: 'success',
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
      id: 'finish',
      title: 'Live',
      description: 'Deployment serving traffic at the domain',
      status: 'success',
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
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const logViewer = ref<LogViewerStepsView>('phased')
  const openStep = ref('finish')

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
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
            <Tooltip content="https://web-app-mh2saq.example.com">
              <Button
                label="Visit"
                variant="secondary"
                size="medium"
                icon="az az-external-link"
                href="https://web-app-mh2saq.example.com"
                target="_blank"
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
                <Tooltip content="Taylor Reed · October 29, 2026, 11:30:58 AM">
                  <Avatar
                    alt="Taylor Reed"
                    label="Taylor Reed"
                    size="small"
                    variant="square"
                  />
                </Tooltip>
                <span class="truncate text-body-sm text-(--text-default)"> Taylor Reed </span>
                <span class="shrink-0 text-body-sm text-(--text-muted)">
                  {{ ago('2026-11-03T12:00:00Z') }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Status</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <StatusIndicator
                  severity="success"
                  label="Ready"
                />
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Duration</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-clock shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)"> 1m 1s </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Environment</span>
              <div class="flex min-w-0 items-center">
                <Tag
                  severity="neutral"
                  size="medium"
                  label="Production"
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
                    class="az az-external-link shrink-0 text-body-xs leading-none"
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
                    class="az az-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Triggered by</span>
              <div class="flex min-w-0 items-center">
                <Tooltip content="platform deploy --auto --local">
                  <Tag
                    severity="neutral"
                    size="medium"
                    icon="az az-code"
                    label="CLI"
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
                <span class="text-label-code-sm text-(--text-muted)"> 20260722112530 </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-2xs) sm:col-span-2 lg:col-span-3">
              <span class="text-label-sm text-(--text-muted)">Domains</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-globe shrink-0 text-body-lg text-(--text-muted)"
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
                      class="az az-external-link shrink-0 text-body-xs leading-none"
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
                            class="az az-external-link shrink-0 text-body-xs leading-none"
                            aria-hidden="true"
                          />
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <Accordion.Content>
                  <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2 lg:grid-cols-4">
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
            <span class="text-label-sm text-(--text-muted)"> 1m 1s </span>
            <ToggleGroup
              v-model="logViewer"
              :options="logViews"
              size="medium"
              aria-label="Log view"
            />
          </div>
        </template>

        <template #default>
          <LogViewer.Steps
            v-model:view="logViewer"
            v-model:open-step="openStep"
            :steps="steps"
            :view-switch="false"
          >
          </LogViewer.Steps>
        </template>
      </Card>
    </section>
  </div>
</template>
