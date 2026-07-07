<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import AzionDefault from '../../../svg/azion/default/default.vue'
  import { cn } from '../../../utils/cn'
  import Button from '../../actions/button/button.vue'
  import type { LogViewLine } from '../../code/log-view/injection-key'
  import LogView from '../../code/log-view/log-view.vue'
  import LogViewContent from '../../code/log-view/log-view-content.vue'
  import LogViewHeader from '../../code/log-view/log-view-header.vue'
  import CardBox from '../../content/card-box/card-box.vue'
  import Item from '../../content/item/index.js'
  import {
    disabledCursorClasses,
    focusSuppressHoverGhostClasses,
    focusVisibleRingClasses,
    ghostLayerClasses
  } from '../../inputs/presets/interactive-states'
  import GlobalHeader from '../../layout/global-header/index.js'
  import Link from '../../navigation/link/link.vue'
  import Tag from '../../tag/tag.vue'

  defineOptions({
    name: 'DeploySuccess',
    inheritAttrs: false
  })

  export interface DeploySuccessStep {
    /** Step title shown beside the leading icon. */
    title: string
    /** Supporting copy under the step title. */
    description: string
    /** Azion icon class (e.g. `ai ai-domains`). */
    icon: string
  }

  interface Props {
    /** Main success heading in the card header region. */
    title?: string
    /** Supporting copy before the scope tag. */
    description?: string
    /** Scope label rendered in the header tag. */
    scope?: string
    /** Deployed application name above the build log. */
    appName?: string
    /** Log entries passed to LogView. */
    lines?: LogViewLine[]
    /** Section label above the next-steps list. */
    stepsLabel?: string
    /** Ordered next-step entries (title, description, icon per row). */
    steps: DeploySuccessStep[]
    /** Primary footer button label. */
    actionLabel?: string
    /** Visit link label in the card header. */
    visitLabel?: string
    /** Visit link destination URL. */
    visitHref?: string
    /** When true, renders the top GlobalHeader bar with the brand slot. */
    showHeader?: boolean
    /** Disables toolbar controls and the primary action button. */
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: 'Congratulations!',
    description: 'You just deployed a new application into',
    scope: 'mygithub-scope',
    appName: 'myappname',
    lines: () => [],
    stepsLabel: 'Next Steps',
    actionLabel: 'Manage',
    visitLabel: 'Visit',
    visitHref: '#',
    showHeader: true,
    disabled: false
  })

  const emit = defineEmits<{
    'action-click': [event: MouseEvent]
    'visit-click': [event: MouseEvent]
    'step-click': [index: number, event: MouseEvent]
  }>()

  defineSlots<{
    header(): unknown
    success(): unknown
    logs(): unknown
    steps(): unknown
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const successHeadingId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'templates-deploy-success'
  )

  const onActionClick = (event: MouseEvent) => emit('action-click', event)
  const onVisitClick = (event: MouseEvent) => emit('visit-click', event)
  const onStepClick = (index: number, event: MouseEvent) => emit('step-click', index, event)

  const GlobalHeaderLeft = GlobalHeader['Left']
  const GlobalHeaderBrand = GlobalHeader['Brand']
  const ItemContent = Item['Content']
  const ItemTitle = Item['Title']
  const ItemDescription = Item['Description']
  const ItemMedia = Item['Media']
  const ItemActions = Item['Actions']

  const ROOT_CLASS =
    'flex min-h-full w-full flex-col bg-[var(--bg-canvas)] transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none'

  const STEP_BUTTON_CLASS = cn(
    'cursor-pointer border-0 bg-transparent text-left text-inherit',
    ...ghostLayerClasses,
    ...focusVisibleRingClasses,
    'focus-visible:before:opacity-100',
    ...focusSuppressHoverGhostClasses,
    ...disabledCursorClasses
  )
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
      class="flex flex-1 flex-col items-center px-[var(--spacing-xxl)] py-[var(--spacing-xxl)]"
      :aria-labelledby="successHeadingId"
      :data-testid="`${testId}__main`"
    >
      <CardBox
        class="w-full max-w-[768px]"
        :data-testid="`${testId}__card`"
      >
        <template #header>
          <slot name="success">
            <div
              class="flex w-full items-start justify-between gap-[var(--spacing-md)]"
              :data-testid="`${testId}__success`"
            >
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
                <h1
                  :id="successHeadingId"
                  class="text-heading-sm text-[var(--text-default)] [word-break:break-word]"
                  :data-testid="`${testId}__title`"
                >
                  {{ title }}
                </h1>
                <div
                  class="flex flex-wrap items-center gap-[var(--spacing-xs)]"
                  :data-testid="`${testId}__description-row`"
                >
                  <p class="text-body-sm whitespace-nowrap text-[var(--text-muted)]">
                    {{ description }}
                  </p>
                  <Tag
                    :label="scope"
                    severity="secondary"
                    icon="pi pi-github"
                    :data-testid="`${testId}__scope-tag`"
                  />
                </div>
              </div>

              <Link
                :label="visitLabel"
                :href="visitHref"
                target="_blank"
                :disabled="disabled"
                :data-testid="`${testId}__visit-link`"
                @click="onVisitClick"
              />
            </div>
          </slot>
        </template>

        <template #content>
          <slot name="logs">
            <div
              class="flex w-full flex-col gap-[var(--spacing-lg)] px-[var(--spacing-lg)] py-[var(--spacing-lg)]"
              :data-testid="`${testId}__logs`"
            >
              <h2
                class="text-heading-xs w-full text-[var(--text-default)] [word-break:break-word]"
                :data-testid="`${testId}__app-name`"
              >
                {{ appName }}
              </h2>

              <LogView
                :lines="lines"
                :disabled="disabled"
                class="h-[263px] min-h-[263px]"
                :data-testid="`${testId}__build-log`"
              >
                <LogViewHeader />
                <LogViewContent />
              </LogView>
            </div>
          </slot>
        </template>

        <template #footer>
          <div
            class="flex w-full flex-col gap-[var(--spacing-md)] px-[var(--spacing-lg)] pb-[var(--spacing-sm)] pt-[var(--spacing-md)]"
          >
            <slot name="steps">
              <div
                class="flex w-full flex-col gap-[var(--spacing-md)]"
                :data-testid="`${testId}__steps`"
              >
                <p
                  class="w-full text-label-sm text-[var(--text-default)] [word-break:break-word]"
                  :data-testid="`${testId}__steps-label`"
                >
                  {{ stepsLabel }}
                </p>

                <div
                  class="flex w-full flex-col gap-[var(--spacing-xs)]"
                  :data-testid="`${testId}__steps-list`"
                >
                  <Item
                    v-for="(step, index) in steps"
                    :key="index"
                    size="medium"
                    as-child
                    :data-testid="`${testId}__step-${index + 1}`"
                  >
                    <button
                      type="button"
                      :class="STEP_BUTTON_CLASS"
                      :disabled="disabled"
                      @click="onStepClick(index, $event)"
                    >
                      <ItemMedia
                        kind="icon"
                        class="relative z-[1] !size-10 shrink-0 !translate-y-0 self-center border-[var(--border-muted)] bg-[var(--bg-surface)]"
                      >
                        <i
                          :class="step.icon"
                          class="inline-flex size-5 items-center justify-center text-[length:inherit] leading-none"
                          aria-hidden="true"
                        />
                      </ItemMedia>
                      <ItemContent class="relative z-[1]">
                        <ItemTitle>{{ step.title }}</ItemTitle>
                        <ItemDescription>{{ step.description }}</ItemDescription>
                      </ItemContent>
                      <ItemActions class="relative z-[1]">
                        <i
                          class="pi pi-chevron-right size-6 shrink-0 leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </ItemActions>
                    </button>
                  </Item>
                </div>
              </div>
            </slot>

            <slot name="actions">
              <Button
                :label="actionLabel"
                kind="secondary"
                size="large"
                class="w-full"
                :disabled="disabled"
                :data-testid="`${testId}__action`"
                @click="onActionClick"
              />
            </slot>
          </div>
        </template>
      </CardBox>
    </main>
  </div>
</template>
