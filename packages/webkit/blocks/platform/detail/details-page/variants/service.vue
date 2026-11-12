<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Alert from '@aziontech/webkit/alert'
  import Popover from '@aziontech/webkit/popover'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const domains = [
    'service-01.example.com',
    'service-01-alias-1.example.com',
    'service-01-alias-2.example.com',
    'service-01-alias-3.example.com',
    'service-01-alias-4.example.com',
    'service-01-alias-5.example.com',
    'service-01-alias-6.example.com',
    'service-01-alias-7.example.com'
  ]
  const environments = [{ name: 'Production' }, { name: 'Preview' }]
  const environment = ref('Production')
</script>

<template>
  <Card :padded="false">
    <template #content>
      <div
        class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <div class="flex min-w-0">
            <Tooltip
              text="Open service-01.example.com in a new tab"
              class="w-full"
            >
              <a
                href="https://service-01.example.com"
                target="_blank"
                rel="noopener noreferrer"
                data-link
                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
              >
                <span class="truncate underline-offset-2 group-hover/link:underline"
                  >service-01.example.com</span
                >
                <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                <i
                  class="pi pi-external-link shrink-0 text-body-xs leading-none"
                  aria-hidden="true"
                />
              </a>
            </Tooltip>
          </div>
          <Popover
            placement="bottom-start"
            width="small"
          >
            <Popover.Trigger>
              <div class="shrink-0 cursor-pointer">
                <Tag
                  label="+7"
                  severity="secondary"
                  size="small"
                />
              </div>
            </Popover.Trigger>

            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
              >
                <p class="text-label-sm text-(--text-muted)">8 domains</p>
              </div>

              <div
                class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
              >
                <a
                  v-for="domain in domains"
                  :key="domain"
                  :href="`https://${domain}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate">{{ domain }}</span>
                  <i
                    class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </div>

              <span
                class="sr-only"
                role="status"
                >8 domains</span
              >
            </Popover.Content>
          </Popover>
        </div>

        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Visit"
            kind="secondary"
            size="medium"
            icon="pi pi-external-link"
          />

          <div class="contents md:hidden">
            <Tooltip
              text="Select an environment to see its deployment and settings, or add another one"
            >
              <DropdownMenu
                placement="bottom-end"
                @select="
                  (event, value) => {
                    if (value !== '__add-environment__') environment = value
                  }
                "
              >
                <DropdownMenu.Trigger>
                  <span
                    class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
                  >
                    <i
                      class="ai ai-layers shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ environment }}</span>
                    <i
                      class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                </DropdownMenu.Trigger>

                <DropdownMenu.Group label="Environments">
                  <DropdownMenu.Option
                    v-for="option in environments"
                    :key="option.name"
                    :value="option.name"
                    :label="option.name"
                    :selected="option.name === environment"
                  />
                </DropdownMenu.Group>

                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="__add-environment__"
                    label="Add Environment"
                  >
                    <template #left>
                      <i
                        class="pi pi-plus"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                </DropdownMenu.Group>
              </DropdownMenu>
            </Tooltip>
          </div>

          <DropdownMenu placement="bottom-end">
            <DropdownMenu.Trigger>
              <Tooltip text="Service actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Service actions"
                />
              </Tooltip>
            </DropdownMenu.Trigger>

            <DropdownMenu.Group>
              <DropdownMenu.Option
                value="copy-url"
                label="Copy URL"
              >
                <template #left>
                  <i
                    class="pi pi-copy"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Option>
            </DropdownMenu.Group>

            <DropdownMenu.Group>
              <DropdownMenu.Option
                value="manage-domains"
                label="Manage domains"
              >
                <template #left>
                  <i
                    class="pi pi-globe"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Option>
              <DropdownMenu.Option
                value="settings"
                label="Settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Option>
            </DropdownMenu.Group>
          </DropdownMenu>
        </div>
      </div>

      <div
        class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
            <span class="text-label-sm text-(--text-muted)">Custom domains</span>
            <Tooltip text="Add a custom domain">
              <button
                type="button"
                class="-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) p-1 text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                aria-label="Add a custom domain"
              >
                <i
                  class="pi pi-plus-circle text-body-sm leading-none"
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-muted)"> None </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              severity="success"
              label="Live"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Service ID</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)"> 1020655 </span>
            <CopyButton
              kind="outlined"
              value="1020655"
              aria-label="Copy service ID"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              Sep 22 by Robson Junior
            </span>
            <Avatar
              alt="Robson Junior"
              label="Robson Junior"
              size="small"
              kind="square"
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
                <Tag
                  label="Shared · 3 services"
                  severity="warning"
                  size="medium"
                  class="shrink-0"
                />
                <div class="pointer-events-auto">
                  <Tooltip text="Open acme-production in Build and deployment settings">
                    <a
                      href="/account/build-deployment"
                      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                    >
                      <span class="truncate underline-offset-2 group-hover/link:underline">
                        acme-production
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
              <div class="px-(--spacing-md) pt-(--spacing-xs)">
                <Alert
                  severity="warning"
                  size="small"
                  label="Deploying with this setting also publishes to service-05, service-09."
                />
              </div>

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
                      class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-contrast)"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      fill-rule="evenodd"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 0a8 8 0 100 16A8 8 0 008 0z M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z"
                      />
                    </svg>
                    <span class="truncate text-body-sm text-(--text-default)"> Enabled </span>
                  </span>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Skew protection</span>
                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                    <svg
                      class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-contrast)"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      fill-rule="evenodd"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 0a8 8 0 100 16A8 8 0 008 0z M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z"
                      />
                    </svg>
                    <span class="truncate text-body-sm text-(--text-default)"> Enabled </span>
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
