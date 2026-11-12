<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
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
              text="Open web-app-y6u7i8.example.com in a new tab"
              class="w-full"
            >
              <a
                href="https://web-app-y6u7i8.example.com"
                target="_blank"
                rel="noopener noreferrer"
                data-link
                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
              >
                <span class="truncate underline-offset-2 group-hover/link:underline"
                  >web-app-y6u7i8.example.com</span
                >
                <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                <i
                  class="pi pi-external-link shrink-0 text-body-xs leading-none"
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
            icon="pi pi-external-link"
          />

          <DropdownMenu placement="bottom-end">
            <DropdownMenu.Trigger>
              <Tooltip text="Resource actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Resource actions"
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
        class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Deployment</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <div class="flex min-w-0">
              <Tooltip
                text="Open 1213284258 in Deployments"
                class="w-full"
              >
                <a
                  href="/deployments/1213284258"
                  data-link
                  class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline"
                    >1213284258</span
                  >
                  <i
                    class="pi pi-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
            <Tag
              label="Production"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Domains</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <div class="flex min-w-0">
              <Tooltip
                text="Open web-app-y6u7i8.example.com in a new tab"
                class="w-full"
              >
                <a
                  href="https://web-app-y6u7i8.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-link
                  class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                >
                  <span class="truncate underline-offset-2 group-hover/link:underline"
                    >web-app-y6u7i8.example.com</span
                  >
                  <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                  <i
                    class="pi pi-external-link shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </a>
              </Tooltip>
            </div>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              severity="success"
              label="Ready"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Created</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              4 weeks ago by Gab Lisboa
            </span>
            <Avatar
              alt="Gab Lisboa"
              label="Gab Lisboa"
              size="small"
              kind="square"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Source</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="ai ai-github shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <div class="flex min-w-0">
                <Tooltip
                  text="Open acme/web-app in a new tab"
                  class="w-full"
                >
                  <a
                    href="https://github.com/acme/web-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-link
                    class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                  >
                    <span class="truncate underline-offset-2 group-hover/link:underline"
                      >acme/web-app</span
                    >
                    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                    <i
                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                      aria-hidden="true"
                    />
                  </a>
                </Tooltip>
              </div>
            </div>
            <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
              <i
                class="ai ai-branch shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">develop</span>
            </div>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
          <span class="text-label-sm text-(--text-muted)">Framework</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <i
              class="ai-cor ai-nuxt shrink-0 text-body-lg"
              aria-hidden="true"
            />
            <span class="truncate text-body-sm text-(--text-default)"> Nuxt </span>
          </div>
        </div>
      </div>

      <div
        class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
      >
        <p
          class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
        >
          Every push to
          <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
            >develop</code
          >
          deploys this resource to Production. To ship from your machine, drop your project anywhere
          on this page or run
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
            icon="pi pi-book"
            href="https://example.com/docs/cli"
            target="_blank"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
