<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'

  import { accountInitials } from '../../lib/state/accounts.js'
  import OrgAvatar from '../shell/OrgAvatar.vue'

  interface Props {
    orgName?: string
    accent?: string
    workspaceName?: string
    ownerName?: string
    ownerEmail?: string
  }

  withDefaults(defineProps<Props>(), {
    orgName: '',
    accent: 'blue',
    workspaceName: '',
    ownerName: '',
    ownerEmail: ''
  })

  const navGroups = [
    { id: 'top', labelled: false, items: ['58%', '76%', '48%', '66%'] },
    { id: 'build', labelled: true, items: ['70%', '44%', '80%', '54%'] },
    { id: 'secure', labelled: true, items: ['62%', '78%', '50%'] }
  ]
</script>

<template>
  <div
    class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
  >
    <figure
      class="pointer-events-none absolute inset-y-0 left-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
      aria-hidden="true"
    >
      <div
        class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
      >
        <AzionLogoMin class="size-(--size-5) shrink-0" />

        <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <OrgAvatar
            :name="orgName"
            :accent="accent"
            size="small"
          />
          <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
            {{ orgName }}
          </span>
        </span>

        <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <Avatar
            :label="accountInitials(workspaceName)"
            size="small"
            kind="square"
            class="size-(--size-5) shrink-0"
          />
          <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
            {{ workspaceName }}
          </span>
        </span>

        <span class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
          <span
            class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
          />
          <span
            class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
          />
          <span
            class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)"
          />
        </span>
      </div>

      <div class="flex min-h-0 flex-1">
        <div
          class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
        >
          <span
            class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
          />

          <template
            v-for="(group, groupIndex) in navGroups"
            :key="group.id"
          >
            <span
              v-if="groupIndex === 1"
              class="h-px w-full shrink-0 bg-(--border-muted)"
            />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span
                v-if="group.labelled"
                class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
              />
              <span
                v-for="(width, itemIndex) in group.items"
                :key="`${group.id}-${itemIndex}`"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>
          </template>

          <div
            class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
          >
            <Avatar
              :label="accountInitials(ownerName)"
              size="medium"
              kind="square"
            />
            <span class="flex min-w-0 flex-col">
              <span class="truncate text-label-sm text-(--text-default)">{{ ownerName }}</span>
              <span class="truncate text-body-xs text-(--text-muted)">{{ ownerEmail }}</span>
            </span>
          </div>
        </div>

        <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
          <div class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <p class="truncate text-heading-sm text-(--text-default)">
                Hello, {{ ownerName }}
              </p>
              <p class="truncate text-body-sm text-(--text-muted)">
                {{ workspaceName }} · no workloads yet
              </p>
            </div>

            <div class="grid grid-cols-4 gap-(--spacing-md)">
              <span
                v-for="tile in 4"
                :key="`tile-${tile}`"
                class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
              >
                <span
                  class="h-(--size-2) w-2/3 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-3) w-1/2 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
              </span>
            </div>

            <div
              class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
            >
              <span
                class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
              >
                <span
                  class="h-(--size-2) w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                />
              </span>
              <span
                v-for="row in 7"
                :key="`row-${row}`"
                class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
              >
                <span
                  class="h-(--size-2) flex-1 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) w-[18%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) w-[10%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  </div>
</template>
