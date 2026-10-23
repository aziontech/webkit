<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import type { PageSection } from './sections'
  import { HERO_SECTIONS, SECTIONS } from './sections'
  import { toPageJson } from './sections/block-id'

  defineOptions({ name: 'SitePage' })

  type PageView = 'design' | 'json'

  interface Props {
    /** The page, top to bottom: an opening hero, then the column's sections. */
    sections: PageSection[]
  }

  const props = defineProps<Props>()

  const VIEW_OPTIONS = [
    { label: 'Design', value: 'design' },
    { label: 'JSON', value: 'json' }
  ]

  const route = useRoute()
  const router = useRouter()

  const view = computed<PageView>({
    get: () => (route.query.view === 'json' ? 'json' : 'design'),
    set: (next) => {
      const query = { ...route.query }
      if (next === 'json') query.view = 'json'
      else delete query.view
      router.replace({ query })
    }
  })

  const jsonOpen = computed({
    get: () => view.value === 'json',
    set: (open: boolean) => {
      view.value = open ? 'json' : 'design'
    }
  })

  const resolve = (entry: PageSection) => {
    const component = SECTIONS[entry.section]
    if (!component) throw new Error(`SitePage: no section is registered as "${entry.section}".`)
    const { section, gap: _gap, ...rest } = entry
    return { key: section, component, props: rest }
  }

  const opening = computed(() =>
    props.sections.filter((entry) => HERO_SECTIONS.has(entry.section)).map(resolve)
  )

  const column = computed(() =>
    props.sections
      .filter((entry) => !HERO_SECTIONS.has(entry.section))
      .map((entry, index, entries) => {
        const resolved = resolve(entry)
        const next = entries[index + 1]
        const stacked =
          entry.section === 'ClosingCallToAction' && next?.section === 'ClosingCallToAction'
        return {
          ...resolved,
          props: stacked ? { ...resolved.props, hatch: false } : resolved.props,
          gap: entry.gap !== false && !(entry.section === 'ClosingCallToAction' && entry.kind === 'frame'),
          gapSize: entry.gap === 'small' ? ('small' as const) : ('medium' as const)
        }
      })
  )

  const isComponent = (value: object) =>
    'render' in value || 'setup' in value || '__name' in value || 'template' in value

  const serialize = (sections: PageSection[]) => {
    const seen = new WeakSet<object>()
    return JSON.stringify(
      toPageJson(sections),
      (key, value: unknown) => {
        if (typeof value === 'function') return { $function: value.name || key }
        if (value && typeof value === 'object') {
          if (isComponent(value)) {
            const named = value as { __name?: string; name?: string }
            return { $component: named.__name ?? named.name ?? key }
          }
          if (seen.has(value)) return { $circular: key }
          seen.add(value)
        }
        return value
      },
      2
    )
  }

  const fileName = computed(
    () => `${route.path.split('/').filter(Boolean).slice(1).join('-') || 'home'}.json`
  )

  const jsonTabs = computed(() => [
    {
      label: fileName.value,
      value: 'json',
      code: jsonOpen.value ? serialize(props.sections) : '',
      language: 'javascript',
      fileName: fileName.value
    }
  ])
</script>

<template>
  <component
    :is="entry.component"
    v-for="(entry, index) in opening"
    :key="`${entry.key}-${index}`"
    v-bind="entry.props"
  />
  <SectionContainer max-width="site">
    <template
      v-for="(entry, index) in column"
      :key="`${entry.key}-${index}`"
    >
      <SectionGap
        v-if="entry.gap"
        hatch
        :size="entry.gapSize"
      />
      <component
        :is="entry.component"
        v-bind="entry.props"
      />
    </template>
  </SectionContainer>
  <div
    class="fixed bottom-(--spacing-lg) left-1/2 z-50 -translate-x-1/2 rounded-(--shape-button) bg-(--bg-surface-raised) shadow-(--shadow-lg)"
  >
    <SegmentedButton
      v-model="view"
      :options="VIEW_OPTIONS"
      aria-label="Page view"
      size="medium"
    />
  </div>
  <Drawer
    v-model:open="jsonOpen"
    size="large"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <div class="sr-only">
          <DrawerTitle>{{ fileName }}</DrawerTitle>
        </div>
        <div class="h-[80dvh] min-h-0 p-(--spacing-md) md:h-auto md:flex-1 [--code-block-height:100%] [--code-block-max-height:none]">
          <CodeBlock :tabs="jsonTabs" />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
