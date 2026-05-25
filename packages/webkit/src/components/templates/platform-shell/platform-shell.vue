<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import GlobalHeader from '../../layout/global-header/index.js'
  import TabView from '../../navigation/tab-view/index.js'
  import type { TabViewValue } from '../../navigation/tab-view/injection-key'

  defineOptions({
    name: 'PlatformShell',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the header landmark. */
    headerAriaLabel?: string
    /** Initial active tab when the `tabs` slot is used (uncontrolled). */
    tabDefaultValue?: TabViewValue | null
  }

  const props = withDefaults(defineProps<Props>(), {
    headerAriaLabel: 'Global header',
    tabDefaultValue: 'tab-1'
  })

  defineSlots<{
    'header-left'(): unknown
    'header-middle'(): unknown
    'header-right'(): unknown
    sidebar(): unknown
    'page-header'(): unknown
    tabs(): unknown
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'template-platform-shell'
  )

  const hasSidebar = computed(() => Boolean(slots['sidebar']))
  const hasPageHeader = computed(() => Boolean(slots['page-header']))
  const hasTabs = computed(() => Boolean(slots['tabs']))
  const hasDefault = computed(() => Boolean(slots['default']))

  const GlobalHeaderLeft = GlobalHeader['Left']
  const GlobalHeaderMiddle = GlobalHeader['Middle']
  const GlobalHeaderRight = GlobalHeader['Right']
  const TabViewRoot = TabView['Root']
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex h-screen min-h-0 w-full flex-col bg-[var(--bg-canvas)]"
  >
    <GlobalHeader
      :aria-label="props.headerAriaLabel"
      :data-testid="`${testId}__header`"
    >
      <GlobalHeaderLeft v-if="$slots['header-left']">
        <slot name="header-left" />
      </GlobalHeaderLeft>
      <GlobalHeaderMiddle v-if="$slots['header-middle']">
        <slot name="header-middle" />
      </GlobalHeaderMiddle>
      <GlobalHeaderRight v-if="$slots['header-right']">
        <slot name="header-right" />
      </GlobalHeaderRight>
    </GlobalHeader>

    <div
      class="flex min-h-0 w-full flex-1 overflow-hidden"
      :data-testid="`${testId}__body`"
    >
      <aside
        v-if="hasSidebar"
        class="flex h-full w-[320px] shrink-0 flex-col self-stretch"
        :data-testid="`${testId}__sidebar`"
      >
        <slot name="sidebar" />
      </aside>

      <main
        class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--bg-canvas)]"
        :data-testid="`${testId}__main`"
      >
        <div
          class="flex min-h-0 flex-1 flex-col gap-[var(--spacing-6)] overflow-auto p-[var(--spacing-6)]"
          :data-testid="`${testId}__main-inner`"
        >
          <div
            v-if="hasPageHeader"
            class="w-full shrink-0"
            :data-testid="`${testId}__page-header`"
          >
            <slot name="page-header" />
          </div>

          <TabViewRoot
            v-if="hasTabs"
            :default-value="props.tabDefaultValue"
            class="flex min-h-0 w-full flex-1 flex-col"
            :data-testid="`${testId}__tabs`"
          >
            <slot name="tabs" />
          </TabViewRoot>

          <div
            v-if="hasDefault && !hasTabs"
            class="w-full min-h-0 flex-1"
            :data-testid="`${testId}__content`"
          >
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
