<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Tag from '@aziontech/webkit/tag'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup, { type ShellMockupFade, type ShellMockupKind } from '../ShellMockup.vue'

  defineOptions({ name: 'WorkloadRolloutRowsWidget' })

  interface Props {
    /** How the mockup is plated. */
    kind?: ShellMockupKind
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'bare',
    chrome: false,
    width: 600,
    fade: 'none',
    active: true
  })

  interface RolloutRow {
    version: string
    application: string
    framework: string
    frameworkIcon: string
    environment: string
    action: string
    actionIcon?: string
  }

  const ROWS: RolloutRow[] = [
    {
      version: 'v43',
      application: 'storefront',
      framework: 'Next.js',
      frameworkIcon: 'ai-cor ai-next',
      environment: 'Preview',
      action: ''
    },
    {
      version: 'v42',
      application: 'storefront',
      framework: 'Next.js',
      frameworkIcon: 'ai-cor ai-next',
      environment: 'Preview',
      action: 'Promote'
    },
    {
      version: 'v41',
      application: 'storefront',
      framework: 'Next.js',
      frameworkIcon: 'ai-cor ai-next',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v18',
      application: 'marketing-site',
      framework: 'Astro',
      frameworkIcon: 'ai-cor ai-astro',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v12',
      application: 'docs',
      framework: 'Nuxt',
      frameworkIcon: 'ai-cor ai-nuxt',
      environment: 'Preview',
      action: 'Promote'
    },
    {
      version: 'v31',
      application: 'dashboard',
      framework: 'React',
      frameworkIcon: 'ai-cor ai-react',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v30',
      application: 'dashboard',
      framework: 'React',
      frameworkIcon: 'ai-cor ai-react',
      environment: 'Production',
      action: 'Rollback',
      actionIcon: 'pi pi-undo'
    }
  ]

  const ROW_GRID = 'grid grid-cols-[2.5rem_1fr_6.5rem_5.5rem] items-center gap-(--spacing-sm)'
</script>

<template>
  <ShellMockup
    :kind="kind"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
  >
    <div class="flex h-full flex-col justify-center p-(--spacing-xs)">
      <MockupPart :order="0">
        <CardBox
          :padded="false"
          class="w-full overflow-hidden"
        >
          <template #header>
            <h3 class="m-0 truncate text-heading-xs text-(--text-default)">Versions</h3>
            <span class="ml-auto inline-flex shrink-0">
              <Button
                label="New Version"
                kind="outlined"
                size="medium"
                icon="pi pi-plus"
              />
            </span>
          </template>

          <template #content>
            <MockupPart
              v-for="(row, index) in ROWS"
              :key="row.version + row.application"
              :order="1 + index"
            >
              <div
                :class="ROW_GRID"
                :data-last="index === ROWS.length - 1 || null"
                class="border-b border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) data-last:border-b-0"
              >
                <span class="text-label-sm text-(--text-default)">{{ row.version }}</span>
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="ai ai-edge-application shrink-0 text-body-md leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-body-sm text-(--text-default)">{{
                    row.application
                  }}</span>
                  <i
                    :class="row.frameworkIcon"
                    class="shrink-0 text-body-md leading-none"
                    aria-hidden="true"
                  />
                  <span class="truncate text-body-sm text-(--text-muted)">{{ row.framework }}</span>
                </span>
                <span class="inline-flex">
                  <Tag
                    :label="row.environment"
                    severity="secondary"
                    size="small"
                  />
                </span>
                <span class="flex justify-end">
                  <Button
                    v-if="row.action"
                    :label="row.action"
                    :icon="row.actionIcon"
                    kind="outlined"
                    size="small"
                  />
                </span>
              </div>
            </MockupPart>
          </template>
        </CardBox>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
