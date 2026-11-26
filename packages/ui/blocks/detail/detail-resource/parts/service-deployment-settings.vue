<script setup lang="ts">
  import Accordion from '@aziontech/ui/accordion'
  import Alert from '@aziontech/ui/alert'
  import TableCellLink from '@aziontech/ui/table-cell-link'
  import Tag from '@aziontech/ui/tag'

  const ENABLED = ['Canary', 'Skew protection']

  const DEPLOYMENT_SETTINGS_SUMMARY_CLASS =
    'flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs) px-(--spacing-md) pb-(--spacing-md) ' +
    '@lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) ' +
    '@lg/band:pb-0'
</script>

<template>
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

          <div :class="DEPLOYMENT_SETTINGS_SUMMARY_CLASS">
            <Tag
              label="Shared · 3 services"
              severity="warning"
              size="medium"
              class="shrink-0"
            />
            <div class="pointer-events-auto">
              <TableCellLink
                label="acme-production"
                href="/account/build-deployment"
                destination="Build and deployment settings"
              />
            </div>
          </div>
        </div>

        <Accordion.Content>
          <div>
            <Alert
              severity="warning"
              size="small"
              label="Deploying with this setting also publishes to service-05, service-09."
            />
          </div>

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
            <div
              v-for="label in ENABLED"
              :key="label"
              class="flex min-w-0 flex-col gap-(--spacing-2xs)"
            >
              <span class="text-label-sm text-(--text-muted)">{{ label }}</span>
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <svg
                  class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-foreground)"
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
