<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import AzionDefault from '../../../../svg/azion/default/default.vue'
  import { cn } from '../../../../utils/cn'
  import Button from '../../actions/button/button.vue'
  import CardBox from '../../content/card-box/card-box.vue'
  import GlobalHeader from '../../layout/global-header/index.js'

  defineOptions({
    name: 'PlanSuccess',
    inheritAttrs: false
  })

  export interface PlanSuccessStep {
    /** Step title shown beside the number badge. */
    title: string
    /** Supporting copy under the step title. */
    description: string
  }

  interface Props {
    /** Main success heading in the card header region. */
    title?: string
    /** Supporting copy under the success heading. */
    description?: string
    /** Section label above the numbered steps list. */
    stepsLabel?: string
    /** Ordered next-step entries (title + description per row). */
    steps: PlanSuccessStep[]
    /** Primary footer button label. */
    actionLabel?: string
    /** When true, renders the top GlobalHeader bar with the brand slot. */
    showHeader?: boolean
    /** Disables the primary action button. */
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: 'Your Pro Plan is now Active',
    description: 'A receipt has been sent to your email for your records.',
    stepsLabel: 'Next Steps',
    actionLabel: 'Start deploying',
    showHeader: true,
    disabled: false
  })

  const emit = defineEmits<{
    'action-click': [event: MouseEvent]
  }>()

  defineSlots<{
    header(): unknown
    success(): unknown
    steps(): unknown
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const successHeadingId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'templates-plan-success'
  )

  const onActionClick = (event: MouseEvent) => emit('action-click', event)

  const GlobalHeaderLeft = GlobalHeader['Left']
  const GlobalHeaderBrand = GlobalHeader['Brand']

  const ROOT_CLASS =
    'flex min-h-full w-full flex-col bg-[var(--bg-canvas)] transition-colors duration-150 ease-out motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
  >
    <slot name="header">
      <GlobalHeader
        v-if="showHeader"
        :data-testid="`${testId}__header`"
      >
        <GlobalHeaderLeft>
          <GlobalHeaderBrand :data-testid="`${testId}__brand`">
            <AzionDefault aria-label="Azion" />
          </GlobalHeaderBrand>
        </GlobalHeaderLeft>
      </GlobalHeader>
    </slot>

    <main
      class="flex flex-1 flex-col items-center justify-center px-[var(--spacing-8)] py-[var(--spacing-8)]"
      :aria-labelledby="successHeadingId"
      :data-testid="`${testId}__main`"
    >
      <CardBox
        class="w-full max-w-[512px]"
        :data-testid="`${testId}__card`"
      >
        <template #header>
          <slot name="success">
            <div
              class="flex w-full flex-col items-center gap-[10px] px-[var(--spacing-6)] py-[var(--spacing-5)] text-center"
              :data-testid="`${testId}__success`"
            >
              <span
                class="inline-flex size-8 items-center justify-center"
                :data-testid="`${testId}__success-icon`"
              >
                <i
                  class="pi pi-check text-heading-sm leading-none text-[var(--success)]"
                  aria-hidden="true"
                />
              </span>
              <div
                class="flex w-full max-w-[360px] flex-col gap-[var(--spacing-1)] [word-break:break-word]"
              >
                <h1
                  :id="successHeadingId"
                  class="text-heading-sm text-[var(--text-default)]"
                  :data-testid="`${testId}__title`"
                >
                  {{ title }}
                </h1>
                <p
                  class="text-body-xs text-[var(--text-muted)]"
                  :data-testid="`${testId}__description`"
                >
                  {{ description }}
                </p>
              </div>
            </div>
          </slot>
        </template>

        <template #content>
          <slot name="steps">
            <div
              class="flex w-full flex-col gap-[var(--spacing-5)] px-[var(--spacing-6)] py-[var(--spacing-6)]"
              :data-testid="`${testId}__steps`"
            >
              <p
                class="w-full text-button-md text-[var(--text-muted)] [word-break:break-word]"
                :data-testid="`${testId}__steps-label`"
              >
                {{ stepsLabel }}
              </p>
              <ol
                class="flex w-full list-none flex-col gap-[var(--spacing-5)] p-0"
                :data-testid="`${testId}__steps-list`"
              >
                <li
                  v-for="(step, index) in steps"
                  :key="index"
                  class="flex w-full items-start justify-between gap-[var(--spacing-3)]"
                  :data-testid="`${testId}__step-${index + 1}`"
                >
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] bg-[var(--bg-hover)] px-[11px] text-button-md text-[var(--text-default)]"
                    :data-testid="`${testId}__step-${index + 1}-badge`"
                    aria-hidden="true"
                  >
                    {{ index + 1 }}
                  </div>
                  <div
                    class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-1)] [word-break:break-word]"
                    :data-testid="`${testId}__step-${index + 1}-content`"
                  >
                    <p
                      class="text-body-sm text-[var(--text-default)]"
                      :data-testid="`${testId}__step-${index + 1}-title`"
                    >
                      {{ step.title }}
                    </p>
                    <p
                      class="text-body-xs text-[var(--text-muted)]"
                      :data-testid="`${testId}__step-${index + 1}-description`"
                    >
                      {{ step.description }}
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </slot>
        </template>

        <template #footer>
          <slot name="actions">
            <Button
              :label="actionLabel"
              kind="primary"
              size="medium"
              class="w-full"
              :disabled="disabled"
              :data-testid="`${testId}__action`"
              @click="onActionClick"
            />
          </slot>
        </template>
      </CardBox>
    </main>
  </div>
</template>
