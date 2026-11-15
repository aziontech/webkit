<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tooltip from '@aziontech/webkit/tooltip'

  type ServiceState = {
    id: string
    domain: string
    deployStep: string
    live: boolean
    createdBy: string
    createdAt: string
  }

  const services: ServiceState[] = [
    {
      id: '1020731',
      domain: 'store-front-k3p9qa.example.com',
      deployStep: 'Build',
      live: false,
      createdBy: 'Jane Doe',
      createdAt: 'Nov 12'
    },
    {
      id: '1020655',
      domain: 'docs-site-w2x7mb.example.com',
      deployStep: '',
      live: false,
      createdBy: 'Sam Lee',
      createdAt: 'Sep 22'
    }
  ]
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
    <Card :padded="false">
      <template #default>
        <div
          class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
        >
          <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
            <i
              class="ai ai-globe shrink-0 text-body-lg text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate text-body-sm text-(--text-muted)">Not deployed yet</span>
          </div>

          <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <Tooltip content="Resource actions">
                  <IconButton
                    icon="ai ai-ellipsis"
                    kind="outlined"
                    size="medium"
                    aria-label="Resource actions"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>

              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="settings"
                  label="Settings"
                >
                  <template #leading>
                    <i
                      class="ai ai-settings"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </div>

        <div
          class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Deployment</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-muted)">None</span>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Domains</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-muted)">None</span>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Status</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-muted)">Not deployed</span>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Created</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-muted)">Not yet</span>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Source</span>
            <div class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-sm)">
              <a
                href="#connect-repository"
                class="inline-flex min-w-0 items-center rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-150 ease-out hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              >
                <span class="truncate">Connect Git repository</span>
              </a>
              <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="ai ai-cloud-upload shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">Project upload</span>
              </div>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Framework</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="ai-color ai-nuxt shrink-0 text-body-lg"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">Nuxt</span>
            </div>
          </div>
        </div>

        <div
          class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
        >
          <p
            class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
          >
            To deploy to Production, drop your project anywhere on this page, connect Git, or run
            <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
              >platform deploy</code
            >
            via the CLI.
          </p>

          <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
            <Button
              class="w-full"
              label="Documentation"
              kind="outlined"
              size="medium"
              icon="ai ai-book"
              href="https://example.com/docs/cli"
              target="_blank"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card
      v-for="service in services"
      :key="service.id"
      :padded="false"
    >
      <template #default>
        <div
          class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
        >
          <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
            <i
              class="ai ai-globe shrink-0 text-body-lg text-(--text-muted)"
              aria-hidden="true"
            />
            <div class="flex min-w-0">
              <Tooltip
                :content="`Open ${service.domain} in a new tab`"
                class="w-full"
              >
                <a
                  :href="`https://${service.domain}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline">{{
                    service.domain
                  }}</span>
                  <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                  <i
                    class="ai ai-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
          </div>

          <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Visit"
              kind="secondary"
              size="medium"
              icon="ai ai-external-link"
              :href="`https://${service.domain}`"
              target="_blank"
            />

            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <Tooltip content="Service actions">
                  <IconButton
                    icon="ai ai-ellipsis"
                    kind="outlined"
                    size="medium"
                    aria-label="Service actions"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>

              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="copy-url"
                  label="Copy URL"
                >
                  <template #leading>
                    <i
                      class="ai ai-copy"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>

              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="settings"
                  label="Settings"
                >
                  <template #leading>
                    <i
                      class="ai ai-settings"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
          </div>
        </div>

        <div
          class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span class="text-label-sm text-(--text-muted)">Custom domains</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-muted)">None</span>
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span class="text-label-sm text-(--text-muted)">Status</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <StatusIndicator
                :severity="service.deployStep ? 'info' : service.live ? 'success' : 'neutral'"
                :loading="Boolean(service.deployStep)"
                :label="
                  service.deployStep
                    ? `Deploying · ${service.deployStep}`
                    : service.live
                      ? 'Live'
                      : 'Inactive'
                "
              />
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span class="text-label-sm text-(--text-muted)">Service ID</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm tabular-nums text-(--text-default)">{{
                service.id
              }}</span>
              <CopyButton
                kind="outlined"
                :value="service.id"
                aria-label="Copy service ID"
                class="shrink-0"
                size="small"
              />
            </div>
          </div>

          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span class="text-label-sm text-(--text-muted)">Created</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm text-(--text-default)">
                {{ service.createdAt }} by {{ service.createdBy }}
              </span>
              <Avatar
                :alt="service.createdBy"
                :label="service.createdBy"
                size="small"
                kind="square"
                class="shrink-0"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
