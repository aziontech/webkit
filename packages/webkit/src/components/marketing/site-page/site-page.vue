<script setup lang="ts">
  import { type Component, computed, useAttrs } from 'vue'

  import { resolveScene } from '../../../assets/scene-registry'
  import SectionContainer from '../section-container/section-container.vue'
  import SectionGap from '../section-gap/section-gap.vue'
  import { resolveSection, resolveSectionEntry, warnOnce } from './site-page-sections'

  defineOptions({ name: 'SitePage', inheritAttrs: false })

  /** Break drawn before a column section. */
  export type SitePageGap = 'none' | 'small' | 'medium'

  /** A scene drawn in one slot of a section. */
  export type SitePageScene = {
    /** Scene registry name. */
    component: string
    /** SitePageProps bound onto the scene; the slot's own props win on a clash. */
    props?: Record<string, unknown>
  }

  /** One entry of the page data. */
  export type SitePageSection = {
    /** Public subpath of the section to render. */
    _id: string
    /** SitePageProps bound onto the section. */
    props?: Record<string, unknown>
    /** Slot name of the section mapped to the scene drawn in it. */
    scenes?: Record<string, SitePageScene>
    /** Break before a column section; ignored on openings. */
    gap?: SitePageGap
    /** Transport details of a form, opaque to the renderer and handed back on submit. */
    submission?: Record<string, unknown>
  }

  /** Payload of a section form submission. */
  export type SitePageSubmit = {
    /** The entry whose form was submitted. */
    section: SitePageSection
    /** The submitted form values. */
    values: Record<string, string>
  }

  type ResolvedScene = { slot: string; component: Component; props: Record<string, unknown> }

  type ResolvedSection = {
    key: string
    entry: SitePageSection
    props: Record<string, unknown>
    component: Component
    scenes: ResolvedScene[]
    gapSize: 'small' | 'medium' | null
  }

  export interface SitePageProps {
    /** Opening sections, rendered full bleed above the column in order. */
    hero?: SitePageSection[]
    /** Column sections, rendered in order inside the site column with a hatched gap before each and after the last. */
    sections?: SitePageSection[]
  }

  const props = withDefaults(defineProps<SitePageProps>(), {
    hero: () => [],
    sections: () => []
  })

  const emit = defineEmits<{
    /** A section form passed its own validation; the payload carries the entry and its values. */
    submit: [event: SubmitEvent, payload: SitePageSubmit]
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-site-page'
  )

  const heroEntries = computed(() => resolveEntries(props.hero))

  const columnEntries = computed(() => resolveEntries(props.sections, true))

  const closesPage = computed(() => {
    const last = columnEntries.value.at(-1)
    return isClosing(last?.entry) && last?.props['hatch'] !== false
  })

  function isClosing(entry?: SitePageSection): boolean {
    if (!entry) return false
    const { id, props: bound } = resolveSectionEntry(entry._id, entry.props)
    return (
      id.startsWith('closing-call-to-action') ||
      (id === 'template-gallery' && bound['closing'] === true)
    )
  }

  function resolveScenes(entry: SitePageSection): ResolvedScene[] {
    const scenes: ResolvedScene[] = []
    for (const [slot, scene] of Object.entries(entry.scenes ?? {})) {
      const component = resolveScene(scene.component)
      if (!component) {
        warnOnce(`scene:${scene.component}`, `no scene is registered as "${scene.component}".`)
        continue
      }
      scenes.push({ slot, component, props: scene.props ?? {} })
    }
    return scenes
  }

  function resolveEntries(entries: SitePageSection[], column = false): ResolvedSection[] {
    const resolved: ResolvedSection[] = []
    entries.forEach((entry, index) => {
      const { id, props: bound } = resolveSectionEntry(entry._id, entry.props)
      const component = resolveSection(id)
      if (!component) return
      const closing = column && isClosing(entry)
      resolved.push({
        key: `${entry._id}-${index}`,
        entry,
        props: closing && isClosing(entries[index + 1]) ? { ...bound, hatch: false } : bound,
        component,
        scenes: resolveScenes(entry),
        gapSize:
          entry.gap === 'none' || (closing && bound['variant'] === 'frame')
            ? null
            : entry.gap === 'small'
              ? 'small'
              : 'medium'
      })
    })
    return resolved
  }

  function onSubmit(entry: SitePageSection, event: Event, values?: unknown) {
    if (typeof values !== 'object' || values === null) return
    emit('submit', event as SubmitEvent, {
      section: entry,
      values: values as Record<string, string>
    })
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <component
      :is="item.component"
      v-for="item in heroEntries"
      :key="item.key"
      v-bind="item.props"
      @submit="(event: Event, values?: unknown) => onSubmit(item.entry, event, values)"
    >
      <template
        v-for="scene in item.scenes"
        #[scene.slot]="slotProps"
      >
        <component
          :is="scene.component"
          v-bind="{ ...scene.props, ...slotProps }"
        />
      </template>
    </component>
    <SectionContainer
      v-if="columnEntries.length > 0"
      max-width="site"
    >
      <template
        v-for="item in columnEntries"
        :key="item.key"
      >
        <SectionGap
          v-if="item.gapSize"
          hatch
          :size="item.gapSize"
        />
        <component
          :is="item.component"
          v-bind="item.props"
          @submit="(event: Event, values?: unknown) => onSubmit(item.entry, event, values)"
        >
          <template
            v-for="scene in item.scenes"
            #[scene.slot]="slotProps"
          >
            <component
              :is="scene.component"
              v-bind="{ ...scene.props, ...slotProps }"
            />
          </template>
        </component>
      </template>
      <SectionGap
        v-if="!closesPage"
        hatch
        size="medium"
      />
    </SectionContainer>
  </div>
</template>
