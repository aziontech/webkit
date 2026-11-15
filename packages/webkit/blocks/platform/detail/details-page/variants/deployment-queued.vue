<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
</script>

<template>
  <div class="layout-boundary flex min-h-0 w-full flex-1 flex-col">
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <div class="[--popup-origin:top] animate-popup-scale-in motion-reduce:animate-none">
        <Alert
          severity="info"
          size="small"
          label="Queued for the production environment of web-app. The deployment starts as soon as a runner is free."
        />
      </div>

      <Card :padded="false">
        <template #header>
          <p class="text-heading-xs text-(--text-default)">Deployment details</p>

          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Tooltip text="Available once the deployment is live">
              <Button
                label="Visit"
                kind="secondary"
                size="medium"
                icon="pi pi-external-link"
                disabled
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
                <DropdownMenu.Item
                  value="logs"
                  label="Logs"
                >
                  <template #leading>
                    <i
                      class="pi pi-align-left"
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
                      class="pi pi-arrow-right-arrow-left"
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
                      class="pi pi-refresh"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
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
                <Tooltip text="Taylor Reed · November 5, 2026, 9:12:40 AM">
                  <Avatar
                    alt="Taylor Reed"
                    label="Taylor Reed"
                    size="small"
                    kind="square"
                  />
                </Tooltip>
                <span class="truncate text-body-sm text-(--text-default)"> Taylor Reed </span>
                <span class="shrink-0 text-body-sm text-(--text-muted)"> 2 minutes ago </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Status</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <StatusIndicator
                  severity="warning"
                  label="Queued"
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
                <span class="truncate text-body-sm text-(--text-muted)"> Not started </span>
              </div>
            </div>
            <div class="flex flex-col gap-(--spacing-xxs)">
              <span class="text-label-sm text-(--text-muted)">Environment</span>
              <div class="flex min-w-0 items-center">
                <Tag
                  severity="neutral"
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
                    severity="neutral"
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
                    severity="neutral"
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
                <span class="text-label-code-sm text-(--text-muted)"> 20261105091240 </span>
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

          <StatusIndicator
            severity="warning"
            label="Queued"
          />
        </template>

        <template #content>
          <div class="py-(--spacing-xl)">
            <EmptyState
              icon="pi pi-clock"
              title="Queued, not started"
              description="The steps appear here as soon as the deployment starts running."
            />
          </div>
        </template>
      </Card>
    </section>
  </div>
</template>
