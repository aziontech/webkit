<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import QuoteTabs from '../../marketing/quote-tabs/quote-tabs.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ClientQuotes',
    inheritAttrs: false
  })

  /** The call to action rendered under the quotes. */
  export type ClientQuotesAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Adds a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** One client quotation, featured while its client card is selected. */
  export type ClientQuotesItem = {
    /** The quotation itself. */
    text: string
    /** Who said it, the attribution's lead. */
    name?: string
    /** Their role and company, as one line under the name. */
    jobTitle?: string
    /** Registry name of the client's one-ink mark. */
    mark?: string
    /** URL of the client's colour logo; wins over mark. */
    logo?: string
    /** The client's name in prose, naming its card. */
    clientName?: string
    /** URL of the person's likeness, drawn beside the attribution. */
    photo?: string
  }

  interface Props {
    /** Accessible name of the quote carousel. */
    ariaLabel?: string
    /** The quotes, in order. */
    items?: ClientQuotesItem[]
    /** Button under the quotes; omitted when absent. */
    primaryAction?: ClientQuotesAction
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    items: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-client-quotes'
  )

  const hasItems = computed(() => props.items.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <QuoteTabs
          :aria-label="ariaLabel || undefined"
          :items="items"
        >
          <template #actions>
            <Button
              v-if="primaryAction"
              :label="primaryAction.label"
              :href="primaryAction.href"
              kind="secondary"
              size="large"
              :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
            />
          </template>
        </QuoteTabs>
      </FrameBox>
    </SectionModule>
  </div>
</template>
