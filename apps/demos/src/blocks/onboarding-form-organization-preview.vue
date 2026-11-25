<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'

  import { accountInitials } from './onboarding-form.onboarding-form-data'

  defineProps<{ previewName: string; ownerName: string; email: string; accentColors: string[] }>()

  const PREVIEW_FIGURE_CLASS =
    'pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) ' +
    'border-(--border-muted) bg-(--bg-surface) select-none'
</script>

<template>
  <div class="min-w-0 max-w-full lg:sticky lg:top-(--spacing-xl) lg:my-auto">
    <div
      class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden ltr:mask-r-from-72% rtl:mask-l-from-72% mask-b-from-80% lg:block"
    >
      <figure
        :class="PREVIEW_FIGURE_CLASS"
        aria-hidden="true"
      >
        <div
          class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
        >
          <span class="size-(--size-5) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)" />

          <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              :alt="previewName"
              :colors="accentColors"
              pattern="marble"
              size="small"
              variant="square"
              class="shrink-0"
            />
            <span class="min-w-0 truncate text-label-md text-(--text-default)">
              {{ previewName }}
            </span>
          </span>

          <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Avatar
              label="MW"
              size="small"
              variant="square"
              class="shrink-0"
            />
            <span class="min-w-0 truncate text-label-md text-(--text-default)"> My Workspace </span>
          </span>

          <span class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
            <span
              class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
            />
            <span
              class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
            />
            <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
          </span>
        </div>

        <div class="flex min-h-0 flex-1">
          <div
            class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
          >
            <span
              class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
            />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span
                v-for="width in ['58%', '76%', '48%', '66%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <span class="h-px w-full shrink-0 bg-(--border-muted)" />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span class="h-1.5 w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)" />
              <span
                v-for="width in ['70%', '44%', '80%', '54%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <span class="h-1.5 w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)" />
              <span
                v-for="width in ['62%', '78%', '50%']"
                :key="width"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-control) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-2) rounded-(--shape-control) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>

            <div
              class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
            >
              <Avatar
                :label="accountInitials(ownerName || email)"
                size="medium"
                variant="square"
              />
              <span class="flex min-w-0 flex-col">
                <span class="truncate text-label-sm text-(--text-default)">{{
                  ownerName || email.split('@')[0]
                }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ email }}</span>
              </span>
            </div>
          </div>

          <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
            <div class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)">
              <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <p class="truncate text-heading-sm text-(--text-default)">
                  {{ ownerName ? 'Hello, ' + ownerName : 'Hello' }}
                </p>
                <p class="truncate text-body-sm text-(--text-muted)">
                  My Workspace · no projects yet
                </p>
              </div>

              <div class="grid grid-cols-4 gap-(--spacing-md)">
                <span
                  v-for="tile in 4"
                  :key="tile"
                  class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-2) w-2/3 rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-3) w-1/2 rounded-(--shape-control) bg-(--bg-placeholder)"
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
                    class="h-(--size-2) w-[28%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                </span>
                <span
                  v-for="row in 7"
                  :key="row"
                  class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
                >
                  <span
                    class="h-(--size-2) flex-1 rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-2) w-[18%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-2) w-[10%] rounded-(--shape-control) bg-(--bg-placeholder)"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  </div>
</template>
