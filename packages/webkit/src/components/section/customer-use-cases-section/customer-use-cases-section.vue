<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Button from '../../action/button/button.vue'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import FeatureItem from '../../marketing/feature-item/feature-item.vue'

  defineOptions({
    name: 'CustomerUseCasesSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** One use case, rendered as a frame cell. */
  export type CustomerUseCasesSectionItem = {
    /** Icon class for the glyph that leads the use case's heading. */
    icon: string
    /** The use case, rendered as its h3. */
    title: string
    /** One sentence explaining the use case. */
    description: string
  }

  export interface CustomerUseCasesSectionProps {
    /** Eyebrow above the headline in the title cell, closed by the blinking cursor. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2` in the title cell. */
    title?: string
    /** One-line lead under the headline. */
    description?: string
    /** Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
    /** The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`. */
    items?: CustomerUseCasesSectionItem[]
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<CustomerUseCasesSectionProps>(), {
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    items: () => [],
    anchor: ''
  })

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'customer-use-cases-section'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeading = computed(() => hasItems.value && props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
    :aria-labelledby="hasHeading ? headingId : undefined"
  >
    <Module
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          variant="frame"
          layout="fixed"
          :columns="3"
        >
          <CardGridCell
            variant="canvas"
            class="lg:row-span-2"
          >
            <div class="flex h-full flex-col items-start gap-(--spacing-md)">
              <Eyebrow
                v-if="eyebrow"
                cursor
              >
                {{ eyebrow }}
              </Eyebrow>
              <h2
                v-if="hasHeading"
                :id="headingId"
                class="m-0 text-balance text-heading-lg text-(--text-default)"
              >
                {{ title }}
              </h2>
              <p
                v-if="description"
                class="m-0 mb-(--spacing-xl) text-body-md text-(--text-muted)"
              >
                {{ description }}
              </p>
              <Button
                v-if="primaryAction"
                :label="primaryAction.label"
                :href="primaryAction.href"
                variant="secondary"
                size="large"
                :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
                class="mt-auto"
              />
            </div>
          </CardGridCell>
          <CardGridCell
            v-for="item in items"
            :key="item.title"
            variant="canvas"
          >
            <FeatureItem
              :heading-level="3"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </CardGridCell>
        </CardGrid>
      </RegistrationFrame>
    </Module>
  </section>
</template>
