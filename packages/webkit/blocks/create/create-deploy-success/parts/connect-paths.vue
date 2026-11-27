<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Link from '@aziontech/webkit/link'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  import { ACTIONS_STEPS, cliSteps, PATHS } from '../lib/connect-paths'

  export interface ConnectPathsProps {
    /** The project name the CLI steps use. */
    getStarted: string
  }

  const props = defineProps<ConnectPathsProps>()

  const path = ref('cli')
  const steps = computed(() =>
    path.value === 'actions' ? ACTIONS_STEPS : cliSteps(props.getStarted)
  )
</script>

<template>
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow basis-64 flex-col gap-(--spacing-2xs)">
        <h2 class="text-label-md text-(--text-default)">Get started</h2>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Two ways to build and deploy this resource. Select one and follow the steps, or read the
          <Link
            href="https://example.com/docs/cli"
            target="_blank"
            inline
            >CLI docs</Link
          >.
        </p>
      </div>
      <ToggleGroup
        v-model="path"
        :options="PATHS"
        size="large"
        aria-label="Deploy with"
      />
    </div>

    <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="relative flex min-w-0"
      >
        <span
          v-if="index > 0"
          aria-hidden="true"
          class="absolute end-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
        />
        <div class="flex min-w-0 flex-1">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #default>
              <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                  >
                    {{ index + 1 }}
                  </span>
                  <h3 class="min-w-0 text-title-sm text-(--text-default)">
                    {{ step.title }}
                  </h3>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  {{ step.description }}
                </p>
                <div class="mt-(--spacing-2xs) min-w-0">
                  <CodeBlock
                    :tabs="step.tabs"
                    :show-line-numbers="false"
                    :copy-aria-label="`Copy the commands for ${step.title}`"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
