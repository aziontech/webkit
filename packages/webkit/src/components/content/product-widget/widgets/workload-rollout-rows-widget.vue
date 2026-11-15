<script setup lang="ts">
  import Button from '../../../actions/button/button.vue'
  import Card from '../../card/card.vue'
  import Tag from '../../tag/tag.vue'
  import ShellMockup, {
    type ProductWidgetShellMockupFade,
    type ShellMockupVariant
  } from '../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'WorkloadRolloutRowsWidget' })

  interface Props {
    /** How the mockup is plated. */
    variant?: ShellMockupVariant
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ProductWidgetShellMockupFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    variant: 'bare',
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
      frameworkIcon: 'ai-color ai-nextjs',
      environment: 'Preview',
      action: ''
    },
    {
      version: 'v42',
      application: 'storefront',
      framework: 'Next.js',
      frameworkIcon: 'ai-color ai-nextjs',
      environment: 'Preview',
      action: 'Promote'
    },
    {
      version: 'v41',
      application: 'storefront',
      framework: 'Next.js',
      frameworkIcon: 'ai-color ai-nextjs',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v18',
      application: 'marketing-site',
      framework: 'Astro',
      frameworkIcon: 'ai-color ai-astro',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v12',
      application: 'docs',
      framework: 'Nuxt',
      frameworkIcon: 'ai-color ai-nuxt',
      environment: 'Preview',
      action: 'Promote'
    },
    {
      version: 'v31',
      application: 'dashboard',
      framework: 'React',
      frameworkIcon: 'ai-color ai-react',
      environment: 'Production',
      action: ''
    },
    {
      version: 'v30',
      application: 'dashboard',
      framework: 'React',
      frameworkIcon: 'ai-color ai-react',
      environment: 'Production',
      action: 'Rollback',
      actionIcon: 'ai ai-undo'
    }
  ]

  const ROW_GRID = 'grid grid-cols-[2.5rem_1fr_6.5rem_5.5rem] items-center gap-(--spacing-sm)'
</script>

<template>
  <ShellMockup
    :variant="variant"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
  >
    <div class="flex h-full flex-col justify-center p-(--spacing-xs)">
      <ShellMockupPart :order="0">
        <Card
          :padded="false"
          class="w-full overflow-hidden"
        >
          <template #header>
            <h3 class="m-0 truncate text-heading-xs text-(--text-default)">Versions</h3>
            <span class="ms-auto inline-flex shrink-0">
              <Button
                label="New Version"
                variant="outline"
                size="medium"
                icon="ai ai-plus"
              />
            </span>
          </template>

          <template #default>
            <ShellMockupPart
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
                    severity="neutral"
                    size="small"
                  />
                </span>
                <span class="flex justify-end">
                  <Button
                    v-if="row.action"
                    :label="row.action"
                    :icon="row.actionIcon"
                    variant="outline"
                    size="small"
                  />
                </span>
              </div>
            </ShellMockupPart>
          </template>
        </Card>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
