<script setup>
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
            class="pi pi-box shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <div class="flex min-w-0">
            <Tooltip
              text="Open web-app in Resources"
              class="w-full"
            >
              <a
                href="/resources/3344556677"
                data-link
                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
              >
                <span class="truncate underline-offset-2 group-hover/link:underline">web-app</span>
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
            label="Rules"
            kind="secondary"
            size="medium"
            icon="pi pi-list"
          />

          <DropdownMenu placement="bottom-end">
            <DropdownMenu.Trigger>
              <Tooltip text="Policy actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Policy actions"
                />
              </Tooltip>
            </DropdownMenu.Trigger>

            <DropdownMenu.Group>
              <DropdownMenu.Option
                value="copy-id"
                label="Copy ID"
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
        class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) lg:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              severity="success"
              label="Active"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Environment</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <Tag
              label="Production"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Rules</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <button
              type="button"
              class="truncate rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              14 rules
            </button>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Last modified</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">
              6 days ago by Robson Junior
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

        <div class="col-span-2 flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-4">
          <span class="text-label-sm text-(--text-muted)">Modules</span>
          <div class="flex min-h-7 min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              label="Rate limiting"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
            <Tag
              label="Request inspection"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
            <Tag
              label="IP filtering"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
            <Tag
              label="Bot detection"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
          </div>
        </div>
      </div>

      <div
        class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
      >
        <p
          class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
        >
          Every request passes through these modules before it reaches web-app. The rules run in
          order, and the first one that refuses a request ends it.
        </p>

        <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
          <Button
            class="w-full"
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://example.com/docs/policies"
            target="_blank"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
